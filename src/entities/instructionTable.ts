import { u8 } from "@/common";
import { AddrMode, CondType, Instruction, InType } from "./instruction";


export class InstructionTable {

    private opcodeTable: Instruction[] = Array.from({ length: 0x100 }, (_, i) => (null));

    constructor() {
        this.opcodeTable[0x00] = { type: "IN_NOP", mode: "AM_IMP" }
        this.opcodeTable[0x05] = { type: "IN_DEC", mode: "AM_R", reg_1: "b" }
        this.opcodeTable[0x0E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "c" }
        this.opcodeTable[0xAF] = { type: "IN_XOR", mode: "AM_R", reg_1: "a" }
        this.opcodeTable[0xC3] = { type: "IN_JP", mode: "AM_D16", cond: "CT_NONE" }
        this.opcodeTable[0xF3] = { type: "IN_DI", mode: "AM_IMP" }
        this.opcodeTable[0xFB] = { type: "IN_EI", mode: "AM_IMP" }

        this.opcodeTable[0xCD] = { type: "IN_CALL", mode: "AM_D16" }
        this.opcodeTable[0xC9] = { type: "IN_RET", mode: "AM_IMP" }


        //ld commands
        this.opcodeTable[0x01] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "bc" }
        this.opcodeTable[0x11] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "de" }
        this.opcodeTable[0x21] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "hl" }
        this.opcodeTable[0x31] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "sp" }

        this.opcodeTable[0x02] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "bc", reg_2: "a" }
        this.opcodeTable[0x12] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "de", reg_2: "a" }
        this.opcodeTable[0x22] = { type: "IN_LD", mode: "AM_HLI_R", reg_1: "hl", reg_2: "a" }
        this.opcodeTable[0x32] = { type: "IN_LD", mode: "AM_HLD_R", reg_1: "hl", reg_2: "a" }

        this.opcodeTable[0x06] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "b" }
        this.opcodeTable[0x16] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "d" }
        this.opcodeTable[0x26] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "h" }
        this.opcodeTable[0x36] = { type: "IN_LD", mode: "AM_MR_D8", reg_1: "hl" }

        this.opcodeTable[0x08] = { type: "IN_LD", mode: "AM_A16_R", reg_1: "sp" }

        this.opcodeTable[0x0A] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "a", reg_2: "bc" }
        this.opcodeTable[0x1A] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "a", reg_2: "de" }
        this.opcodeTable[0x2A] = { type: "IN_LD", mode: "AM_R_HLI", reg_1: "a", reg_2: "hl" }
        this.opcodeTable[0x3A] = { type: "IN_LD", mode: "AM_R_HLD", reg_1: "a", reg_2: "hl" }

        this.opcodeTable[0x0E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "c" }
        this.opcodeTable[0x1E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "e" }
        this.opcodeTable[0x2E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "l" }
        this.opcodeTable[0x3E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "a" }

        // 0x40–0x47
        this.opcodeTable[0x40] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "b" };
        this.opcodeTable[0x41] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "c" };
        this.opcodeTable[0x42] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "d" };
        this.opcodeTable[0x43] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "e" };
        this.opcodeTable[0x44] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "h" };
        this.opcodeTable[0x45] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "l" };
        this.opcodeTable[0x46] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "b", reg_2: "hl" };
        this.opcodeTable[0x47] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "a" };

        // 0x48–0x4F
        this.opcodeTable[0x48] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "b" };
        this.opcodeTable[0x49] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "c" };
        this.opcodeTable[0x4A] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "d" };
        this.opcodeTable[0x4B] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "e" };
        this.opcodeTable[0x4C] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "h" };
        this.opcodeTable[0x4D] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "l" };
        this.opcodeTable[0x4E] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "c", reg_2: "hl" };
        this.opcodeTable[0x4F] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "a" };

        // 0x50–0x57
        this.opcodeTable[0x50] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "b" };
        this.opcodeTable[0x51] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "c" };
        this.opcodeTable[0x52] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "d" };
        this.opcodeTable[0x53] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "e" };
        this.opcodeTable[0x54] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "h" };
        this.opcodeTable[0x55] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "l" };
        this.opcodeTable[0x56] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "d", reg_2: "hl" };
        this.opcodeTable[0x57] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "a" };

        // 0x58–0x5F
        this.opcodeTable[0x58] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "b" };
        this.opcodeTable[0x59] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "c" };
        this.opcodeTable[0x5A] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "d" };
        this.opcodeTable[0x5B] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "e" };
        this.opcodeTable[0x5C] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "h" };
        this.opcodeTable[0x5D] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "l" };
        this.opcodeTable[0x5E] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "e", reg_2: "hl" };
        this.opcodeTable[0x5F] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "a" };

        // 0x60–0x67
        this.opcodeTable[0x60] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "b" };
        this.opcodeTable[0x61] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "c" };
        this.opcodeTable[0x62] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "d" };
        this.opcodeTable[0x63] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "e" };
        this.opcodeTable[0x64] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "h" };
        this.opcodeTable[0x65] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "l" };
        this.opcodeTable[0x66] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "h", reg_2: "hl" };
        this.opcodeTable[0x67] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "a" };

        // 0x68–0x6F
        this.opcodeTable[0x68] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "b" };
        this.opcodeTable[0x69] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "c" };
        this.opcodeTable[0x6A] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "d" };
        this.opcodeTable[0x6B] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "e" };
        this.opcodeTable[0x6C] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "h" };
        this.opcodeTable[0x6D] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "l" };
        this.opcodeTable[0x6E] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "l", reg_2: "hl" };
        this.opcodeTable[0x6F] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "a" };

        // 0x70–0x77  (writes to (HL))
        this.opcodeTable[0x70] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "b" };
        this.opcodeTable[0x71] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "c" };
        this.opcodeTable[0x72] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "d" };
        this.opcodeTable[0x73] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "e" };
        this.opcodeTable[0x74] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "h" };
        this.opcodeTable[0x75] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "l" };
        this.opcodeTable[0x76] = { type: "IN_HALT", mode: "AM_IMP" };
        this.opcodeTable[0x77] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "a" };

        // 0x78–0x7F
        this.opcodeTable[0x78] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "b" };
        this.opcodeTable[0x79] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "c" };
        this.opcodeTable[0x7A] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "d" };
        this.opcodeTable[0x7B] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "e" };
        this.opcodeTable[0x7C] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "h" };
        this.opcodeTable[0x7D] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "l" };
        this.opcodeTable[0x7E] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "a", reg_2: "hl" };
        this.opcodeTable[0x7F] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "a" };

        // last 2 lines
        //special commands
        this.opcodeTable[0xE2] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "c", reg_2: "a" };
        this.opcodeTable[0xF8] = { type: "IN_LD", mode: "AM_HL_SPR", reg_1: "hl", reg_2: "sp" };
        this.opcodeTable[0xF9] = { type: "IN_LD", mode: "AM_R_R", reg_1: "sp", reg_2: "hl" };

        this.opcodeTable[0xEA] = { type: "IN_LD", mode: "AM_A16_R", reg_1: "a" };
        this.opcodeTable[0xFA] = { type: "IN_LD", mode: "AM_R_A16", reg_1: "a" };






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