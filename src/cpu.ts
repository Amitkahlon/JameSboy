import { u16, u8 } from "./common"
import { CPU_Registers } from "./entities/ProgramRegisters"

export class CPU {
    cpuContext: CPU_Registers
    fetch_data: u16
    mem_dest: u16
    cur_opcode: u8

    haled: boolean
    stepping: boolean

    cpu_init() {

    }

    cpu_step(): boolean {
        console.log("not yet implemented")
        return false
    }
}