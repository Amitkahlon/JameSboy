import { u8 } from "@/common";
import { AddrMode, CondType, Instruction, InType, RegType } from "./instruction";


export class InstructionTable {

    private opcodeTable: Instruction[] = Array.from({ length: 0x100 }, (_, i) => ({}));

    constructor() {
        // maybe should just assigned variables instead of creating new one?
        // like this is more readable atm
        this.opcodeTable[0x00] = { type: InType.IN_NOP, mode: AddrMode.AM_IMP }
        this.opcodeTable[0x05] = { type: InType.IN_NOP, mode: AddrMode.AM_R, reg_1: "b" }
        this.opcodeTable[0x0E] = { type: InType.IN_LD, mode: AddrMode.AM_R_D8, reg_1: "c" }
        this.opcodeTable[0xAF] = { type: InType.IN_XOR, mode: AddrMode.AM_R, reg_1: "a" }
        this.opcodeTable[0xC3] = { type: InType.IN_JP, mode: AddrMode.AM_D16 }
        this.opcodeTable[0xF3] = { type: InType.IN_DI }
    }


    get(opcode: u8) {
        const instruction = this.opcodeTable[opcode]

        return instruction
    }
}

//example 
// opcodeTable[0x00] = {
//         type: InType.IN_NOP,
//         mode: AddrMode.AM_IMP,
//         reg_1: "none",
//         reg_2: "none",
//         cond: CondType.CT_NONE,
//         param: 0,
//     };

// opcodeTable[0x06] = { // LD B, d8
//         type: InType.IN_LD,
//         mode: AddrMode.AM_R_D8,
//         reg_1: "b",
//         reg_2: "none",
//         cond: CondType.CT_NONE,
//         param: 0,
//     };

// opcodeTable[0x04] = { // INC B
//         type: InType.IN_INC,
//         mode: AddrMode.AM_R,
//         reg_1: "b",
//         reg_2: "none",
//         cond: CondType.CT_NONE,
//         param: 0,
//     };