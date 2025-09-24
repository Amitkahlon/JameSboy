import { Bus } from "./bus"
import { u16, u8 } from "./common"
import { AddrMode, Instruction, RegType } from "./entities/instruction"
import { opcodeTable } from "./entities/instructionTable"
import { CPU_Registers } from "./entities/ProgramRegisters"

export class CPU {
    regs: CPU_Registers
    mem: Bus
    private fetchedData: number
    private fetched: boolean


    constructor(mem: Bus) {
        this.mem = mem
        this.regs = new CPU_Registers()
    }

    cpu_step(): boolean {
        const opcode = this.fetch()
        const currInstruction = this.decodeAndFetchData(opcode)
        this.execute(currInstruction, opcode)

        return true
    }

    fetch(): u8 {
        var currWord = this.mem.read(this.regs.pc)
        this.regs.pc++;
        return currWord;
    }

    decodeAndFetchData(opcode: u8): Instruction {
        const instruction = opcodeTable[opcode]
        this.fetched = false

        switch (instruction.mode) {
            case AddrMode.AM_IMP:
                break;
            case AddrMode.AM_R_D8:
                this.fetchedData = this.fetch()
                this.fetched = true
                break;
            case AddrMode.AM_R:
                this.fetchedData = this.regs[instruction.reg_1]
                this.fetched = true
            case AddrMode.AM_D8
                
        }

        return instruction
    }


    execute(instruction: Instruction, opcode: u8) {

    }
}