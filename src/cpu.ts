import { Bus } from "./bus"
import { u16, u8 } from "./common"
import { Emu } from "./emu"
import { AddrMode, CondType, Instruction, InType } from "./entities/instruction"
import { InstructionTable } from "./entities/instructionTable"
import { Regs } from "./entities/regs"
import { IntegerHelper } from "./utils/integerHelper"

const instructionTable = new InstructionTable()

export class CPU {
    public regs: Regs
    private mem: Bus
    private fetchedData: u16
    private mem_dest: u16;
    private dest_is_mem: boolean;
    private curr_instruction: Instruction
    private ctx: Emu
    private halted: boolean
    private stepping: boolean;
    private ime: boolean
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

    cpu_step(): boolean {
        if (!this.halted) {
            //reset values, maybe use this only when debugging
            this.fetchedData = 0
            this.curr_instruction = null

            const currPc = this.regs.pc
            const opcode = this.fetch()
            const currInstruction = this.decode(opcode)


            if (currInstruction == null) {
                console.log(`unknown instruction:  (${opcode.toString(16).padStart(2, '0')})`)
                return false
            }

            this.fetchData()

            console.log(`${currPc.toString(16)}: ${currInstruction.type.slice(3)} (${opcode.toString(16).padStart(2, '0')}) (${this.fetchedData.toString(16)})`)
            return this.execute()
        }
    }

    private fetch(): u8 {
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
                this.fetchedData = this.fetch()
                break;
            case "AM_R":
                this.fetchedData = this.regs[this.curr_instruction.reg_1]
                break;
            case "AM_D16":
            case "AM_R_D16":
                let low = this.fetch()
                let high = this.fetch()
                this.fetchedData = IntegerHelper.makeU16(low, high)
                break;
            case "AM_MR_R":
                this.dest_is_mem = true
                this.mem_dest = this.regs[this.curr_instruction.reg_1]
                break;
            case "AM_HLI_R":
            case "AM_HLD_R":
                this.dest_is_mem = true
                this.mem_dest = this.regs[this.curr_instruction.reg_1]
                break;
            case "AM_MR_D8":
                this.dest_is_mem = true
                this.fetchedData = this.fetch()
                this.mem_dest = this.regs[this.curr_instruction.reg_1]
                break;
            case "AM_A16_R":
                this.dest_is_mem = true
                low = this.fetch()
                high = this.fetch()
                this.mem_dest = IntegerHelper.makeU16(low, high)
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
                const signed = (offset << 24) >> 24; // turn into signed 8-bit
                this.fetchedData = signed
                break;
            case "AM_R_A16":
                low = this.fetch()
                high = this.fetch()
                addr = IntegerHelper.makeU16(low, high)
                this.fetchedData = this.mem.read8(addr);
                break;

            default:
                if (this.curr_instruction.mode != null) {
                    console.log(`does not know how to fetch data method: ${this.curr_instruction.mode}`);
                }
                break;
        }
    }




    private execute(): boolean {
        const instructionProc: () => any = this.instructionProcesses[this.curr_instruction.type]
        if (!instructionProc) {
            console.log("does not know how to process this command yet!")
            return false
        }

        instructionProc();
        return true
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


    public check_cond() {
        const z = this.regs.Z
        const c = this.regs.c

        switch (this.curr_instruction.cond) {
            case "CT_NONE": return true
            case "CT_C": return c
            case "CT_NC": return !c
            case "CT_NZ": return !z
            case "CT_Z": return z
        }

        return false
    }

    public instructionProcesses: Partial<Record<InType, () => void>> = {
        ["IN_JP"]: this.processJP,
        ["IN_NOP"]: this.processNOP,
        ["IN_DI"]: this.processDI,
        ["IN_LD"]: this.processLD,
        ["IN_CALL"]: this.processCALL,
        ["IN_RET"]: this.processRET,
        ["IN_EI"]: this.processEI

    }
}
