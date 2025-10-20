import { u8 } from "@/common";
import { AddrMode, CondType, Instruction, InType } from "./instruction";


export class InstructionTable {

    private opcodeTable: Instruction[] = Array.from({ length: 0x100 }, (_, i) => (null));



    constructor() {
        // 0x00–0x0F
        this.opcodeTable[0x00] = { type: "IN_NOP", mode: "AM_IMP" };
        this.opcodeTable[0x01] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "bc" };
        this.opcodeTable[0x02] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "bc", reg_2: "a" };
        this.opcodeTable[0x03] = { type: "IN_INC", mode: "AM_R", reg_1: "bc" };
        this.opcodeTable[0x04] = { type: "IN_INC", mode: "AM_R", reg_1: "b" };
        this.opcodeTable[0x05] = { type: "IN_DEC", mode: "AM_R", reg_1: "b" };
        this.opcodeTable[0x06] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "b" };
        this.opcodeTable[0x07] = { type: "IN_RLCA", mode: "AM_IMP" };
        this.opcodeTable[0x08] = { type: "IN_LD", mode: "AM_A16_R", reg_1: "sp" };
        this.opcodeTable[0x09] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "hl", reg_2: "bc" };
        this.opcodeTable[0x0A] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "a", reg_2: "bc" };
        this.opcodeTable[0x0B] = { type: "IN_DEC", mode: "AM_R", reg_1: "bc" };
        this.opcodeTable[0x0C] = { type: "IN_INC", mode: "AM_R", reg_1: "c" };
        this.opcodeTable[0x0D] = { type: "IN_DEC", mode: "AM_R", reg_1: "c" };
        this.opcodeTable[0x0E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "c" };
        this.opcodeTable[0x0F] = { type: "IN_RRCA", mode: "AM_IMP" };

        // 0x10–0x1F
        this.opcodeTable[0x10] = { type: "IN_STOP", mode: "AM_IMP" };
        this.opcodeTable[0x11] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "de" };
        this.opcodeTable[0x12] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "de", reg_2: "a" };
        this.opcodeTable[0x13] = { type: "IN_INC", mode: "AM_R", reg_1: "de" };
        this.opcodeTable[0x14] = { type: "IN_INC", mode: "AM_R", reg_1: "d" };
        this.opcodeTable[0x15] = { type: "IN_DEC", mode: "AM_R", reg_1: "d" };
        this.opcodeTable[0x16] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "d" };
        this.opcodeTable[0x17] = { type: "IN_RLA", mode: "AM_IMP" };
        this.opcodeTable[0x18] = { type: "IN_JR", mode: "AM_D8", cond: "CT_NONE" };
        this.opcodeTable[0x19] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "hl", reg_2: "de" };
        this.opcodeTable[0x1A] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "a", reg_2: "de" };
        this.opcodeTable[0x1B] = { type: "IN_DEC", mode: "AM_R", reg_1: "de" };
        this.opcodeTable[0x1C] = { type: "IN_INC", mode: "AM_R", reg_1: "e" };
        this.opcodeTable[0x1D] = { type: "IN_DEC", mode: "AM_R", reg_1: "e" };
        this.opcodeTable[0x1E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "e" };
        this.opcodeTable[0x1F] = { type: "IN_RRA", mode: "AM_IMP" };

        // 0x20–0x2F
        this.opcodeTable[0x20] = { type: "IN_JR", mode: "AM_D8", cond: "CT_NZ" };
        this.opcodeTable[0x21] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "hl" };
        this.opcodeTable[0x22] = { type: "IN_LD", mode: "AM_HLI_R", reg_1: "hl", reg_2: "a" };
        this.opcodeTable[0x23] = { type: "IN_INC", mode: "AM_R", reg_1: "hl" };
        this.opcodeTable[0x24] = { type: "IN_INC", mode: "AM_R", reg_1: "h" };
        this.opcodeTable[0x25] = { type: "IN_DEC", mode: "AM_R", reg_1: "h" };
        this.opcodeTable[0x26] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "h" };
        this.opcodeTable[0x27] = { type: "IN_DAA", mode: "AM_IMP" };
        this.opcodeTable[0x28] = { type: "IN_JR", mode: "AM_D8", cond: "CT_Z" };
        this.opcodeTable[0x29] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "hl", reg_2: "hl" };
        this.opcodeTable[0x2A] = { type: "IN_LD", mode: "AM_R_HLI", reg_1: "a", reg_2: "hl" };
        this.opcodeTable[0x2B] = { type: "IN_DEC", mode: "AM_R", reg_1: "hl" };
        this.opcodeTable[0x2C] = { type: "IN_INC", mode: "AM_R", reg_1: "l" };
        this.opcodeTable[0x2D] = { type: "IN_DEC", mode: "AM_R", reg_1: "l" };
        this.opcodeTable[0x2E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "l" };
        this.opcodeTable[0x2F] = { type: "IN_CPL", mode: "AM_IMP" };

        // 0x30–0x3F
        this.opcodeTable[0x30] = { type: "IN_JR", mode: "AM_D8", cond: "CT_NC" };
        this.opcodeTable[0x31] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "sp" };
        this.opcodeTable[0x32] = { type: "IN_LD", mode: "AM_HLD_R", reg_1: "hl", reg_2: "a" };
        this.opcodeTable[0x33] = { type: "IN_INC", mode: "AM_R", reg_1: "sp" };
        this.opcodeTable[0x34] = { type: "IN_INC", mode: "AM_MR", reg_1: "hl" };
        this.opcodeTable[0x35] = { type: "IN_DEC", mode: "AM_MR", reg_1: "hl" };
        this.opcodeTable[0x36] = { type: "IN_LD", mode: "AM_MR_D8", reg_1: "hl" };
        this.opcodeTable[0x37] = { type: "IN_SCF", mode: "AM_IMP" };
        this.opcodeTable[0x38] = { type: "IN_JR", mode: "AM_D8", cond: "CT_C" };
        this.opcodeTable[0x39] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "hl", reg_2: "sp" };
        this.opcodeTable[0x3A] = { type: "IN_LD", mode: "AM_R_HLD", reg_1: "a", reg_2: "hl" };
        this.opcodeTable[0x3B] = { type: "IN_DEC", mode: "AM_R", reg_1: "sp" };
        this.opcodeTable[0x3C] = { type: "IN_INC", mode: "AM_R", reg_1: "a" };
        this.opcodeTable[0x3D] = { type: "IN_DEC", mode: "AM_R", reg_1: "a" };
        this.opcodeTable[0x3E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0x3F] = { type: "IN_CCF", mode: "AM_IMP" };

        // 0x40–0x4F
        this.opcodeTable[0x40] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "b" };
        this.opcodeTable[0x41] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "c" };
        this.opcodeTable[0x42] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "d" };
        this.opcodeTable[0x43] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "e" };
        this.opcodeTable[0x44] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "h" };
        this.opcodeTable[0x45] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "l" };
        this.opcodeTable[0x46] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "b", reg_2: "hl" };
        this.opcodeTable[0x47] = { type: "IN_LD", mode: "AM_R_R", reg_1: "b", reg_2: "a" };
        this.opcodeTable[0x48] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "b" };
        this.opcodeTable[0x49] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "c" };
        this.opcodeTable[0x4A] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "d" };
        this.opcodeTable[0x4B] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "e" };
        this.opcodeTable[0x4C] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "h" };
        this.opcodeTable[0x4D] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "l" };
        this.opcodeTable[0x4E] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "c", reg_2: "hl" };
        this.opcodeTable[0x4F] = { type: "IN_LD", mode: "AM_R_R", reg_1: "c", reg_2: "a" };

        // 0x50–0x5F
        this.opcodeTable[0x50] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "b" };
        this.opcodeTable[0x51] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "c" };
        this.opcodeTable[0x52] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "d" };
        this.opcodeTable[0x53] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "e" };
        this.opcodeTable[0x54] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "h" };
        this.opcodeTable[0x55] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "l" };
        this.opcodeTable[0x56] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "d", reg_2: "hl" };
        this.opcodeTable[0x57] = { type: "IN_LD", mode: "AM_R_R", reg_1: "d", reg_2: "a" };
        this.opcodeTable[0x58] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "b" };
        this.opcodeTable[0x59] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "c" };
        this.opcodeTable[0x5A] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "d" };
        this.opcodeTable[0x5B] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "e" };
        this.opcodeTable[0x5C] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "h" };
        this.opcodeTable[0x5D] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "l" };
        this.opcodeTable[0x5E] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "e", reg_2: "hl" };
        this.opcodeTable[0x5F] = { type: "IN_LD", mode: "AM_R_R", reg_1: "e", reg_2: "a" };

        // 0x60–0x6F
        this.opcodeTable[0x60] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "b" };
        this.opcodeTable[0x61] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "c" };
        this.opcodeTable[0x62] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "d" };
        this.opcodeTable[0x63] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "e" };
        this.opcodeTable[0x64] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "h" };
        this.opcodeTable[0x65] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "l" };
        this.opcodeTable[0x66] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "h", reg_2: "hl" };
        this.opcodeTable[0x67] = { type: "IN_LD", mode: "AM_R_R", reg_1: "h", reg_2: "a" };
        this.opcodeTable[0x68] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "b" };
        this.opcodeTable[0x69] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "c" };
        this.opcodeTable[0x6A] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "d" };
        this.opcodeTable[0x6B] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "e" };
        this.opcodeTable[0x6C] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "h" };
        this.opcodeTable[0x6D] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "l" };
        this.opcodeTable[0x6E] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "l", reg_2: "hl" };
        this.opcodeTable[0x6F] = { type: "IN_LD", mode: "AM_R_R", reg_1: "l", reg_2: "a" };

        // 0x70–0x7F
        this.opcodeTable[0x70] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "b" };
        this.opcodeTable[0x71] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "c" };
        this.opcodeTable[0x72] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "d" };
        this.opcodeTable[0x73] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "e" };
        this.opcodeTable[0x74] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "h" };
        this.opcodeTable[0x75] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "l" };
        this.opcodeTable[0x76] = { type: "IN_HALT", mode: "AM_IMP" };
        this.opcodeTable[0x77] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "hl", reg_2: "a" };
        this.opcodeTable[0x78] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "b" };
        this.opcodeTable[0x79] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "c" };
        this.opcodeTable[0x7A] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "d" };
        this.opcodeTable[0x7B] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "e" };
        this.opcodeTable[0x7C] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "h" };
        this.opcodeTable[0x7D] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "l" };
        this.opcodeTable[0x7E] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "a", reg_2: "hl" };
        this.opcodeTable[0x7F] = { type: "IN_LD", mode: "AM_R_R", reg_1: "a", reg_2: "a" };

        // 0x80–0x8F
        this.opcodeTable[0x80] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "a", reg_2: "b" };
        this.opcodeTable[0x81] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "a", reg_2: "c" };
        this.opcodeTable[0x82] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "a", reg_2: "d" };
        this.opcodeTable[0x83] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "a", reg_2: "e" };
        this.opcodeTable[0x84] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "a", reg_2: "h" };
        this.opcodeTable[0x85] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "a", reg_2: "l" };
        this.opcodeTable[0x86] = { type: "IN_ADD", mode: "AM_R_MR", reg_1: "a", reg_2: "hl" };
        this.opcodeTable[0x87] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "a", reg_2: "a" };
        this.opcodeTable[0x88] = { type: "IN_ADC", mode: "AM_R_R", reg_1: "a", reg_2: "b" };
        this.opcodeTable[0x89] = { type: "IN_ADC", mode: "AM_R_R", reg_1: "a", reg_2: "c" };
        this.opcodeTable[0x8A] = { type: "IN_ADC", mode: "AM_R_R", reg_1: "a", reg_2: "d" };
        this.opcodeTable[0x8B] = { type: "IN_ADC", mode: "AM_R_R", reg_1: "a", reg_2: "e" };
        this.opcodeTable[0x8C] = { type: "IN_ADC", mode: "AM_R_R", reg_1: "a", reg_2: "h" };
        this.opcodeTable[0x8D] = { type: "IN_ADC", mode: "AM_R_R", reg_1: "a", reg_2: "l" };
        this.opcodeTable[0x8E] = { type: "IN_ADC", mode: "AM_R_MR", reg_1: "a", reg_2: "hl" };
        this.opcodeTable[0x8F] = { type: "IN_ADC", mode: "AM_R_R", reg_1: "a", reg_2: "a" };

        // 0x90–0x9F
        this.opcodeTable[0x90] = { type: "IN_SUB", mode: "AM_R", reg_1: "b" };
        this.opcodeTable[0x91] = { type: "IN_SUB", mode: "AM_R", reg_1: "c" };
        this.opcodeTable[0x92] = { type: "IN_SUB", mode: "AM_R", reg_1: "d" };
        this.opcodeTable[0x93] = { type: "IN_SUB", mode: "AM_R", reg_1: "e" };
        this.opcodeTable[0x94] = { type: "IN_SUB", mode: "AM_R", reg_1: "h" };
        this.opcodeTable[0x95] = { type: "IN_SUB", mode: "AM_R", reg_1: "l" };
        this.opcodeTable[0x96] = { type: "IN_SUB", mode: "AM_MR", reg_1: "hl" };
        this.opcodeTable[0x97] = { type: "IN_SUB", mode: "AM_R", reg_1: "a" };
        this.opcodeTable[0x98] = { type: "IN_SBC", mode: "AM_R_R", reg_1: "a", reg_2: "b" };
        this.opcodeTable[0x99] = { type: "IN_SBC", mode: "AM_R_R", reg_1: "a", reg_2: "c" };
        this.opcodeTable[0x9A] = { type: "IN_SBC", mode: "AM_R_R", reg_1: "a", reg_2: "d" };
        this.opcodeTable[0x9B] = { type: "IN_SBC", mode: "AM_R_R", reg_1: "a", reg_2: "e" };
        this.opcodeTable[0x9C] = { type: "IN_SBC", mode: "AM_R_R", reg_1: "a", reg_2: "h" };
        this.opcodeTable[0x9D] = { type: "IN_SBC", mode: "AM_R_R", reg_1: "a", reg_2: "l" };
        this.opcodeTable[0x9E] = { type: "IN_SBC", mode: "AM_R_MR", reg_1: "a", reg_2: "hl" };
        this.opcodeTable[0x9F] = { type: "IN_SBC", mode: "AM_R_R", reg_1: "a", reg_2: "a" };

        // 0xA0–0xAF
        this.opcodeTable[0xA0] = { type: "IN_AND", mode: "AM_R", reg_1: "b" };
        this.opcodeTable[0xA1] = { type: "IN_AND", mode: "AM_R", reg_1: "c" };
        this.opcodeTable[0xA2] = { type: "IN_AND", mode: "AM_R", reg_1: "d" };
        this.opcodeTable[0xA3] = { type: "IN_AND", mode: "AM_R", reg_1: "e" };
        this.opcodeTable[0xA4] = { type: "IN_AND", mode: "AM_R", reg_1: "h" };
        this.opcodeTable[0xA5] = { type: "IN_AND", mode: "AM_R", reg_1: "l" };
        this.opcodeTable[0xA6] = { type: "IN_AND", mode: "AM_MR", reg_1: "hl" };
        this.opcodeTable[0xA7] = { type: "IN_AND", mode: "AM_R", reg_1: "a" };
        this.opcodeTable[0xA8] = { type: "IN_XOR", mode: "AM_R", reg_1: "b" };
        this.opcodeTable[0xA9] = { type: "IN_XOR", mode: "AM_R", reg_1: "c" };
        this.opcodeTable[0xAA] = { type: "IN_XOR", mode: "AM_R", reg_1: "d" };
        this.opcodeTable[0xAB] = { type: "IN_XOR", mode: "AM_R", reg_1: "e" };
        this.opcodeTable[0xAC] = { type: "IN_XOR", mode: "AM_R", reg_1: "h" };
        this.opcodeTable[0xAD] = { type: "IN_XOR", mode: "AM_R", reg_1: "l" };
        this.opcodeTable[0xAE] = { type: "IN_XOR", mode: "AM_MR", reg_1: "hl" };
        this.opcodeTable[0xAF] = { type: "IN_XOR", mode: "AM_R", reg_1: "a" };

        // 0xB0–0xBF
        this.opcodeTable[0xB0] = { type: "IN_OR", mode: "AM_R", reg_1: "b" };
        this.opcodeTable[0xB1] = { type: "IN_OR", mode: "AM_R", reg_1: "c" };
        this.opcodeTable[0xB2] = { type: "IN_OR", mode: "AM_R", reg_1: "d" };
        this.opcodeTable[0xB3] = { type: "IN_OR", mode: "AM_R", reg_1: "e" };
        this.opcodeTable[0xB4] = { type: "IN_OR", mode: "AM_R", reg_1: "h" };
        this.opcodeTable[0xB5] = { type: "IN_OR", mode: "AM_R", reg_1: "l" };
        this.opcodeTable[0xB6] = { type: "IN_OR", mode: "AM_MR", reg_1: "hl" };
        this.opcodeTable[0xB7] = { type: "IN_OR", mode: "AM_R", reg_1: "a" };
        this.opcodeTable[0xB8] = { type: "IN_CP", mode: "AM_R", reg_1: "b" };
        this.opcodeTable[0xB9] = { type: "IN_CP", mode: "AM_R", reg_1: "c" };
        this.opcodeTable[0xBA] = { type: "IN_CP", mode: "AM_R", reg_1: "d" };
        this.opcodeTable[0xBB] = { type: "IN_CP", mode: "AM_R", reg_1: "e" };
        this.opcodeTable[0xBC] = { type: "IN_CP", mode: "AM_R", reg_1: "h" };
        this.opcodeTable[0xBD] = { type: "IN_CP", mode: "AM_R", reg_1: "l" };
        this.opcodeTable[0xBE] = { type: "IN_CP", mode: "AM_MR", reg_1: "hl" };
        this.opcodeTable[0xBF] = { type: "IN_CP", mode: "AM_R", reg_1: "a" };

        // 0xC0–0xCF
        this.opcodeTable[0xC0] = { type: "IN_RET", mode: "AM_IMP", cond: "CT_NZ" };
        this.opcodeTable[0xC1] = { type: "IN_POP", mode: "AM_R", reg_1: "bc" };
        this.opcodeTable[0xC2] = { type: "IN_JP", mode: "AM_D16", cond: "CT_NZ" };
        this.opcodeTable[0xC3] = { type: "IN_JP", mode: "AM_D16", cond: "CT_NONE" };
        this.opcodeTable[0xC4] = { type: "IN_CALL", mode: "AM_D16", cond: "CT_NZ" };
        this.opcodeTable[0xC5] = { type: "IN_PUSH", mode: "AM_R", reg_1: "bc" };
        this.opcodeTable[0xC6] = { type: "IN_ADD", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0xC7] = { type: "IN_RST", mode: "AM_IMP", param: 0x00 };
        this.opcodeTable[0xC8] = { type: "IN_RET", mode: "AM_IMP", cond: "CT_Z" };
        this.opcodeTable[0xC9] = { type: "IN_RET", mode: "AM_IMP" };
        this.opcodeTable[0xCA] = { type: "IN_JP", mode: "AM_D16", cond: "CT_Z" };
        this.opcodeTable[0xCB] = { type: "IN_CB", mode: "AM_IMP" };        // CB prefix
        this.opcodeTable[0xCC] = { type: "IN_CALL", mode: "AM_D16", cond: "CT_Z" };
        this.opcodeTable[0xCD] = { type: "IN_CALL", mode: "AM_D16" };
        this.opcodeTable[0xCE] = { type: "IN_ADC", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0xCF] = { type: "IN_RST", mode: "AM_IMP", param: 0x08 };

        // 0xD0–0xDF
        this.opcodeTable[0xD0] = { type: "IN_RET", mode: "AM_IMP", cond: "CT_NC" };
        this.opcodeTable[0xD1] = { type: "IN_POP", mode: "AM_R", reg_1: "de" };
        this.opcodeTable[0xD2] = { type: "IN_JP", mode: "AM_D16", cond: "CT_NC" };
        this.opcodeTable[0xD3] = { type: "IN_NOP", mode: "AM_IMP" };        // invalid
        this.opcodeTable[0xD4] = { type: "IN_CALL", mode: "AM_D16", cond: "CT_NC" };
        this.opcodeTable[0xD5] = { type: "IN_PUSH", mode: "AM_R", reg_1: "de" };
        this.opcodeTable[0xD6] = { type: "IN_SUB", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0xD7] = { type: "IN_RST", mode: "AM_IMP", param: 0x10 };
        this.opcodeTable[0xD8] = { type: "IN_RET", mode: "AM_IMP", cond: "CT_C" };
        this.opcodeTable[0xD9] = { type: "IN_RETI", mode: "AM_IMP" };
        this.opcodeTable[0xDA] = { type: "IN_JP", mode: "AM_D16", cond: "CT_C" };
        this.opcodeTable[0xDB] = { type: "IN_NOP", mode: "AM_IMP" };        // invalid
        this.opcodeTable[0xDC] = { type: "IN_CALL", mode: "AM_D16", cond: "CT_C" };
        this.opcodeTable[0xDD] = { type: "IN_NOP", mode: "AM_IMP" };        // invalid
        this.opcodeTable[0xDE] = { type: "IN_SBC", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0xDF] = { type: "IN_RST", mode: "AM_IMP", param: 0x18 };

        // 0xE0–0xEF
        this.opcodeTable[0xE0] = { type: "IN_LD", mode: "AM_A8_R", reg_1: "a" };                 // LDH (a8),A
        this.opcodeTable[0xE1] = { type: "IN_POP", mode: "AM_R", reg_1: "hl" };
        this.opcodeTable[0xE2] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "c", reg_2: "a" };    // (C) = A
        this.opcodeTable[0xE3] = { type: "IN_NOP", mode: "AM_IMP" };                               // invalid
        this.opcodeTable[0xE4] = { type: "IN_NOP", mode: "AM_IMP" };                               // invalid
        this.opcodeTable[0xE5] = { type: "IN_PUSH", mode: "AM_R", reg_1: "hl" };
        this.opcodeTable[0xE6] = { type: "IN_AND", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0xE7] = { type: "IN_RST", mode: "AM_IMP", param: 0x20 };
        this.opcodeTable[0xE8] = { type: "IN_ADD", mode: "AM_R_D8", reg_1: "sp" };                // ADD SP,r8 (treat as signed)
        this.opcodeTable[0xE9] = { type: "IN_JP", mode: "AM_R", reg_1: "hl" };                // JP (HL)
        this.opcodeTable[0xEA] = { type: "IN_LD", mode: "AM_A16_R", reg_1: "a" };                 // (a16) = A
        this.opcodeTable[0xEB] = { type: "IN_NOP", mode: "AM_IMP" };                               // invalid
        this.opcodeTable[0xEC] = { type: "IN_NOP", mode: "AM_IMP" };                               // invalid
        this.opcodeTable[0xED] = { type: "IN_NOP", mode: "AM_IMP" };                               // invalid
        this.opcodeTable[0xEE] = { type: "IN_XOR", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0xEF] = { type: "IN_RST", mode: "AM_IMP", param: 0x28 };

        // 0xF0–0xFF
        this.opcodeTable[0xF0] = { type: "IN_LD", mode: "AM_R_A8", reg_1: "a" };                 // A = (a8)
        this.opcodeTable[0xF1] = { type: "IN_POP", mode: "AM_R", reg_1: "af" };
        this.opcodeTable[0xF2] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "a", reg_2: "c" };    // A = (C)
        this.opcodeTable[0xF3] = { type: "IN_DI", mode: "AM_IMP" };
        this.opcodeTable[0xF4] = { type: "IN_NOP", mode: "AM_IMP" };                               // invalid
        this.opcodeTable[0xF5] = { type: "IN_PUSH", mode: "AM_R", reg_1: "af" };
        this.opcodeTable[0xF6] = { type: "IN_OR", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0xF7] = { type: "IN_RST", mode: "AM_IMP", param: 0x30 };
        this.opcodeTable[0xF8] = { type: "IN_LD", mode: "AM_HL_SPR", reg_1: "hl", reg_2: "sp" };   // HL = SP + r8
        this.opcodeTable[0xF9] = { type: "IN_LD", mode: "AM_R_R", reg_1: "sp", reg_2: "hl" };   // SP = HL
        this.opcodeTable[0xFA] = { type: "IN_LD", mode: "AM_R_A16", reg_1: "a" };                 // A = (a16)
        this.opcodeTable[0xFB] = { type: "IN_EI", mode: "AM_IMP" };
        this.opcodeTable[0xFC] = { type: "IN_NOP", mode: "AM_IMP" };                               // invalid
        this.opcodeTable[0xFD] = { type: "IN_NOP", mode: "AM_IMP" };                               // invalid
        this.opcodeTable[0xFE] = { type: "IN_CP", mode: "AM_R_D8", reg_1: "a" };
        this.opcodeTable[0xFF] = { type: "IN_RST", mode: "AM_IMP", param: 0x38 };

    }


    get(opcode: u8) {
        const instruction = this.opcodeTable[opcode]

        return instruction
    }
}

