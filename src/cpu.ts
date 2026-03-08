import { Bus } from "./bus"
import { u16, u8 } from "./common"
import { Emu } from "./emu"
import { Instruction, } from "./entities/instruction"
import { InstructionTable } from "./entities/instructionTable"
import { Regs, RegType } from "./entities/regs"
import { IntUtils } from "./utils/int_utils"

export class CPU {
    public regs: Regs
    private mem: Bus
    private curr_opcode: u8
    private halted: boolean
    public ime: boolean = false
    private ctx: Emu
    public instructionTable: InstructionTable



    constructor(mem: Bus, ctx: Emu) {
        this.ctx = ctx
        this.mem = mem
        this.regs = new Regs()
        this.instructionTable = new InstructionTable(this, this.regs, mem);

        // this is the state of the registers after the bootrom is done.
        
        this.regs.pc = 0x0100
        this.regs.a = 0x01
        this.regs.f = 0xB0
        this.regs.sp = 0xFFFE
        this.regs.c = 0x13
        this.regs.e = 0xD8
        this.regs.h = 0x01
        this.regs.l = 0x4D
    }



    public async insertCart(romFile: File) {
        await this.mem.cart.initCart(romFile)
    }

    public decode(opcode: u8): Instruction {
        return this.instructionTable.get(opcode)
    }

    public cpu_step(): boolean {
        if (this.handleInterrupts()) {
            return true;
        }

        if (this.halted) {
            this.addCycles(4);
            return true;
        }

        //reset values, maybe use this only when debugging

        const currPc = this.regs.pc
        const opcode = this.fetch()
        this.curr_opcode = opcode
        const currInstruction = this.decode(opcode)


        if (currInstruction == null) {
            console.log(`unknown instruction:  (${opcode.toString(16).padStart(2, '0')})`)
            return false
        }

        console.log(`0x${currPc.toString(16)}: ${currInstruction.type.slice(3)}(${opcode.toString(16).padStart(2, '0')}) (0x${this.mem.read8(currPc + 1).toString(16)}) (0x${this.mem.read8(currPc + 2).toString(16)})`)

        if (!this.execute(currInstruction)) return false

        this.addCycles(currInstruction.cycles)
        return true
    }

    private handleInterrupts(): boolean {
        const ie = this.mem.read8(0xFFFF);
        const intFlags = this.mem.read8(0xFF0F);

        if (this.ime) {
            const fired = ie & intFlags;
            if ((fired & 0x1F) !== 0) {
                this.ime = false;
                this.halted = false;

                this.addCycles(20);

                this.regs.sp -= 2;
                this.mem.write16(this.regs.sp, this.regs.pc);

                // Priority: V-Blank (0), LCD (1), Timer (2), Serial (3), Joypad (4)
                let vector = 0x00;
                if (fired & 0x01) {
                    vector = 0x40;
                    this.mem.write8(0xFF0F, intFlags & ~0x01);
                } else if (fired & 0x02) {
                    vector = 0x48;
                    this.mem.write8(0xFF0F, intFlags & ~0x02);
                } else if (fired & 0x04) {
                    vector = 0x50;
                    this.mem.write8(0xFF0F, intFlags & ~0x04);
                } else if (fired & 0x08) {
                    vector = 0x58;
                    this.mem.write8(0xFF0F, intFlags & ~0x08);
                } else if (fired & 0x10) {
                    vector = 0x60;
                    this.mem.write8(0xFF0F, intFlags & ~0x10);
                }

                this.regs.pc = vector;
                return true;
            }
        }
        return false;
    }


    public fetch(): u8 {
        var currWord = this.mem.read8(this.regs.pc)
        this.regs.incrementPC()
        return currWord;
    }


    public fetch16bit(): u16 {
        let low = this.fetch()
        let high = this.fetch()
        return IntUtils.makeU16(low, high)
    }


    public execute(currInstruction: Instruction): boolean {
        const instructionHandler = currInstruction.handler
        if (!instructionHandler) {
            console.log(`does not know how to process this command yet!, Opcode: ${this.curr_opcode.toString(16)}`)
            return false
        }

        return instructionHandler();
    }

    private addCycles(cycles: number) {
        //console.log("not implemented");
        // The CPU consumes cycles, so we must advance the rest of the system by that amount
        // this.ctx.timer.tick(cycles);
        // this.ctx.ppu.tick(cycles);
        
        // Note: You need to add timer and ppu instances to your Emu class for this to work.
    }
}
