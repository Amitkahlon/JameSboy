import { Bus } from "./bus"
import { u16, u8 } from "./common"
import { Emu } from "./emu"
import { AddrMode, CondType, Instruction, InType } from "./entities/instruction"
import { InstructionTable } from "./entities/instructionTable"
import { Regs, RegType } from "./entities/regs"
import { IntUtils } from "./utils/int_utils"

const instructionTable = new InstructionTable()

export class CPU {
    public regs: Regs
    private mem: Bus
    private fetchedData: u16
    private mem_dest: u16;
    private dest_is_mem: boolean = false
    private curr_instruction: Instruction
    private curr_opcode: u8
    private ctx: Emu
    private halted: boolean
    private stepping: boolean;
    public ime: boolean = false
    private ie_register: u8



    constructor(mem: Bus, ctx: Emu) {
        this.ctx = ctx
        this.mem = mem
        this.regs = new Regs()

        this.regs.pc = 0x0100
        this.regs.a = 0x01
    }



    public async insertCart(romFile: File) {
        await this.mem.cart.initCart(romFile)
    }

    public decode(opcode: u8): Instruction {
        this.curr_instruction = instructionTable.get(opcode)
        return this.curr_instruction
    }

    public cpu_step(): boolean {
        if (!this.halted) {
            //reset values, maybe use this only when debugging
            this.fetchedData = 0
            this.curr_instruction = null
            this.dest_is_mem = false
            this.mem_dest = 0

            const currPc = this.regs.pc
            const opcode = this.fetch()
            this.curr_opcode = opcode
            const currInstruction = this.decode(opcode)


            if (currInstruction == null) {
                console.log(`unknown instruction:  (${opcode.toString(16).padStart(2, '0')})`)
                return false
            }

            this.fetchData()

            console.log(`${currPc.toString(16)}: ${currInstruction.type.slice(3)} (${opcode.toString(16).padStart(2, '0')}) (${this.fetchedData.toString(16)})`)

            const execRes = this.execute()

            // this.ctx.addCycles(currInstruction.cycles)
            return execRes
        }
    }




    public fetch(): u8 {
        var currWord = this.mem.read8(this.regs.pc)
        this.regs.incrementPC()
        return currWord;
    }

    public fetchData(): void {
        // this is how I get my values,
        // for example AM_R_D8 saves u8 in register

        if (this.curr_instruction === null) {
            return
        }

        switch (this.curr_instruction.mode) {
            case "AM_IMP":
                break;
            case "AM_R_D8":
                this.fetch8bitImmediate()
                break;
            case "AM_R":
                this.fetchedData = this.regs[this.curr_instruction.reg_1]
                break;
            case "AM_D16":
            case "AM_R_D16":
                this.fetch16bitImmediate()
                break;
            case "AM_MR_R":
                this.setMemDestToReg()
                break;
            case "AM_HLI_R":
            case "AM_HLD_R":
                this.setMemDestToReg()
                break;
            case "AM_MR_D8":
                this.fetch8bitImmediate()
                this.setMemDestToReg()
                break;
            case "AM_A16_R":
                this.fetchMemDest()
                this.fetchedData = this.regs[this.curr_instruction.reg_2]
                break;
            case "AM_R_MR":
                let addr = this.regs[this.curr_instruction.reg_2]
                this.fetchedData = this.mem.read8(addr)
                break;
            case "AM_R_HLI":
            case "AM_R_HLD":
                addr = this.regs[this.curr_instruction.reg_2]
                this.fetchedData = this.mem.read8(addr)
                if (this.curr_instruction.mode === "AM_R_HLI") {
                    this.regs[this.curr_instruction.reg_2]++;
                } else {
                    this.regs[this.curr_instruction.reg_2]--;
                }
                break;
            case "AM_R_R":
                this.fetchedData = this.regs[this.curr_instruction.reg_2];
                break;
            case "AM_HL_SPR":
                const offset = this.fetch()
                const signed = IntUtils.toSigned(offset)
                this.fetchedData = signed
                break;
            case "AM_R_A16":
                this.fetchFromMem()
                break;

            default:
                if (this.curr_instruction.mode != null) {
                    console.log(`does not know how to fetch data method: ${this.curr_instruction.mode}`);
                }
                break;
        }
    }


    public fetch16bit(): u16 {
        let low = this.fetch()
        let high = this.fetch()
        return IntUtils.makeU16(low, high)
    }

    public fetch8bit() {
        return this.fetch()
    }


    public execute(): boolean {
        const instructionProc: () => any = this.instructionProcesses[this.curr_instruction.type]
        if (!instructionProc) {
            console.log(`does not know how to process this command yet!, Opcode: ${this.curr_opcode.toString(16)}`)
            return false
        }

        instructionProc();
        return true
    }


    private setZeroFlag(val: boolean) {
        this.regs.Z = val
    }

    private setCarryFlag(val: boolean) {
        this.regs.C = val;
    }

    private setHalfCarryFlag(val: boolean) {
        this.regs.H = val
    }

    private setSubFlag(val: boolean) {
        this.regs.N = val
    }


    public processJP = () => {
        const cond = this.check_cond();
        if (cond) {
            this.regs.pc = this.fetchedData
        }
    }

    public processNOP = () => {
        return true
    }

    public processDI = () => {
        this.ime = false
    }

    public processEI = () => {
        this.ime = true
    }

    public processLD = () => {
        const ins = this.curr_instruction
        if (this.dest_is_mem) {
            if (Regs.is16Reg(ins.reg_2)) {
                this.mem.write16(this.mem_dest, this.fetchedData)
            } else {
                this.mem.write8(this.mem_dest, this.fetchedData)
            }

            return
        }

        if (ins.mode === "AM_HL_SPR") {
            this.regs.hl = (this.regs.sp + this.fetchedData) & 0xFFFF
            this.regs.Z = false
            this.regs.N = false

            this.regs.H = IntUtils.hasHalfCarry8(this.regs.sp, this.fetchedData)
            this.regs.C = IntUtils.hasCarry8(this.regs.sp, this.fetchedData)

            return
        }


        this.regs[ins.reg_1] = this.fetchedData
    }

    public processCALL = () => {
        const addr = this.fetchedData
        this.regs.sp -= 2
        this.mem.write16(this.regs.sp, this.regs.pc)
        this.regs.pc = addr
    }


    public processRET = () => {
        const returnAddr = this.mem.read16(this.regs.sp)
        this.regs.sp += 2

        this.regs.pc = returnAddr
    }

    public processINC = () => {
        const handleFlags = (v) => {
            this.regs.Z = IntUtils.toU8(v + 1) === 0
            this.regs.N = false
            this.regs.H = IntUtils.hasHalfCarry8(v, 1)
        }

        if (this.dest_is_mem) {
            const val = this.mem.read8(this.mem_dest)

            this.mem.write8(this.mem_dest, val + 1)
            handleFlags(val)
        }

        if (!Regs.is16Reg(this.curr_instruction.reg_1)) {
            handleFlags(this.regs[this.curr_instruction.reg_1])
        }

        this.regs[this.curr_instruction.reg_1]++;
    }
    public processDEC = () => {
        const flagEffect = this.curr_instruction.flags;
        const target = this.curr_instruction.reg_1; // e.g., "a", "b", "hl", "sp"...
        const is16Bit = Regs.is16Reg(target);

        // Helper setters that mimic your ADD style
        const setZ = (val: boolean) => {
            if (flagEffect.Z === "*") this.setZeroFlag(val);
            else if (flagEffect.Z !== "-") this.setZeroFlag(flagEffect.Z === 1);
        };
        const setN = (val: boolean) => {
            if (flagEffect.N === "*") this.regs.N = val;
            else if (flagEffect.N !== "-") this.regs.N = (flagEffect.N === 1);
        };
        const setH = (val: boolean) => {
            if (flagEffect.H === "*") this.setHalfCarryFlag(val);
            else if (flagEffect.H !== "-") this.setHalfCarryFlag(flagEffect.H === 1);
        };
        const setC = (val: boolean) => {
            // DEC 8-bit doesn't affect C on GB (should be '-'), but honor the table if not '-'
            if (flagEffect.C !== "-") this.setCarryFlag(flagEffect.C === "*" ? val : (flagEffect.C === 1));
        };

        // Detect if this is DEC (HL) – adjust this condition to your addressing modes if needed
        const isMemHL =
            (this.curr_instruction.mode === "AM_MR" || this.curr_instruction.mode === "AM_R_MR") &&
            target === "hl";

        // --- 8-bit DEC on memory (HL) ---
        if (isMemHL && !is16Bit) {
            // Read-modify-write on (HL)
            const addr = this.regs.hl & 0xFFFF;
            const orig = this.mem.read8(addr);          // <- use your actual memory read
            const raw = orig - 1;
            const result = raw & 0xFF;

            // Flags for DEC r / DEC (HL): Z set if zero, N=1, H = half-borrow from bit 4, C unaffected
            setZ(result === 0);
            setN(true);
            setH(IntUtils.halfBorrowSub8(orig, 1)); // equivalent to ((orig & 0xF) === 0)
            // C typically '-' for DEC; only set if your table says so:
            setC(false);

            this.mem.write8(addr, result);              // <- use your actual memory write
            return;
        }

        // --- Register DEC ---
        const orig = this.regs[target];

        if (!is16Bit) {
            // 8-bit DEC r
            const raw = orig - 1;
            const result = raw & 0xFF;

            setZ(result === 0);
            setN(true);
            setH(IntUtils.halfBorrowSub8(orig, 1)); // half-borrow on low nibble
            setC(false); // C unaffected unless table overrides

            this.regs[target] = result;
            return;
        } else {
            // 16-bit DEC rr (BC/DE/HL/SP)
            // On Game Boy: DEC rr does NOT affect flags (all '-' in the table).
            const raw = orig - 1;
            const result = raw & 0xFFFF;

            // Honor table if it ever asks to change something, otherwise do nothing:
            if (flagEffect.Z !== "-") setZ(false);
            if (flagEffect.N !== "-") setN(false);
            if (flagEffect.H !== "-") setH(false);
            if (flagEffect.C !== "-") setC(false);

            this.regs[target] = result;
            return;
        }
    };


    public check_cond() {
        const zFlag = this.regs.Z
        const CFlag = this.regs.C

        switch (this.curr_instruction.cond) {
            case "CT_NONE": return true
            case "CT_C": return CFlag
            case "CT_NC": return !CFlag
            case "CT_NZ": return !zFlag
            case "CT_Z": return zFlag
        }

        return false
    }

    public processADD = () => {
        const flagEffect = this.curr_instruction.flags;
        let rawResult = this.regs[this.curr_instruction.reg_1] + this.fetchedData
        let result: number;

        const is16Bit = Regs.is16Reg(this.curr_instruction.reg_1);

        if (this.curr_instruction.reg_1 === "sp") {
            const r8 = IntUtils.toSigned(this.fetchedData); // sign-extend to 32-bit signed
            rawResult = (this.regs.sp + r8);

            this.regs.H = ((this.regs.sp & 0xF) + (r8 & 0xF)) > 0xF;
            this.regs.C = ((this.regs.sp & 0xFF) + (r8 & 0xFF)) > 0xFF;
            this.regs.N = false
            this.regs.Z = false

            result = rawResult & 0xFF
            this.regs.sp = result;
            return
        }

        result = is16Bit ? IntUtils.toU16(rawResult) : IntUtils.toU8(rawResult)

        if (flagEffect.Z === "*") {
            this.setZeroFlag(result === 0)
        } else if (flagEffect.Z !== "-") {
            this.setZeroFlag(flagEffect.Z === 1)
        }

        if (flagEffect.C === "*") {
            this.setCarryFlag(rawResult !== result)
        } else if (flagEffect.C !== "-") {
            this.setCarryFlag(flagEffect.C === 1)
        }

        flagEffect.N = 0;

        if (flagEffect.H === "*") {
            if (!is16Bit) {
                this.setHalfCarryFlag(IntUtils.hasHalfCarry8(this.regs[this.curr_instruction.reg_1], this.fetchedData));
            } else {
                //this overrides the carry flags from before
                this.regs.H = ((this.regs.hl & 0x0FFF) + (this.regs.hl & 0x0FFF)) > 0x0FFF;
                this.regs.C = (this.regs.hl + this.fetchedData) > 0xFFFF;
            }
        }

        this.regs[this.curr_instruction.reg_1] = result

    }

    public instructionProcesses: Partial<Record<InType, () => void>> = {
        ["IN_JP"]: this.processJP,
        ["IN_NOP"]: this.processNOP,
        ["IN_DI"]: this.processDI,
        ["IN_LD"]: this.processLD,
        ["IN_CALL"]: this.processCALL,
        ["IN_RET"]: this.processRET,
        ["IN_EI"]: this.processEI,
        "IN_INC": this.processINC,
        "IN_DEC": this.processDEC,
        "IN_ADD": this.processADD

    }
}
