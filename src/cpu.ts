import { Bus } from "./bus"
import { u16, u8 } from "./common"
import { AddrMode, Instruction, RegType } from "./entities/instruction"
import { InstructionTable } from "./entities/instructionTable"
import { CPU_Registers } from "./entities/ProgramRegisters"
import { IntegerHelper } from "./utils/integerHelper"

const instructionTable = new InstructionTable()

export class CPU {

    private regs: CPU_Registers
    private mem: Bus
    private fetchedData: u16
    private mem_dest: u16;
    private dest_is_mem: boolean;
    private cur_opcode: u16;
    private cur_inst: Instruction


    constructor(mem: Bus) {
        this.mem = mem
        this.regs = new CPU_Registers()

        this.regs.pc = 0x100
        this.regs.a = 0x01
    }

    public async insertCart(romFile: File) {
        await this.mem.cart.initCart(romFile)
    }

    cpu_step(): boolean {
        const opcode = this.fetch()
        const currInstruction = this.decodeAndFetchData(opcode)
        this.execute(currInstruction, opcode)

        return true
    }

    fetch(): u8 {
        var currWord = this.mem.read(this.regs.pc)
        this.regs.incrementPC()
        return currWord;
    }

    public decodeAndFetchData(opcode: u8): Instruction {
        const instruction = instructionTable.get(opcode)
        this.cur_inst = instruction

        // this is how I get my values,
        // for example AM_R_D8 saves u8 in register

        switch (instruction.mode) {
            case AddrMode.AM_IMP:
                break;
            case AddrMode.AM_R_D8:
                this.fetchedData = this.fetch()
                break;
            case AddrMode.AM_R:
                this.fetchedData = this.regs[instruction.reg_1]
                break;
            case AddrMode.AM_D16:
                let low = this.fetch()
                let high = this.fetch()
                this.fetchedData = IntegerHelper.makeU16(low, high)
                break;
            default:
                console.log("not implemented");
                break;
        }

        return instruction
    }


    execute(instruction: Instruction, opcode: u8) {
        console.log(`Executing instruction: 0X${opcode.toString(16)}`)
        console.log(this.regs.toString().padStart(2, "0"))
    }
}