import { u8 } from "@/common";
import { AddrMode, CondType, Instruction, InType } from "./instruction";


export class InstructionTable {

    private opcodeTable: Instruction[] = Array.from({ length: 0x100 }, (_, i) => (null));



    constructor() {
        // 0x00–0x0F
        this.opcodeTable[0x00] = { type: "IN_NOP", mode: "AM_IMP", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 4 };
        this.opcodeTable[0x01] = { type: "IN_LD", mode: "AM_R_D16", reg_1: "bc", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 12 };
        this.opcodeTable[0x02] = { type: "IN_LD", mode: "AM_MR_R", reg_1: "bc", reg_2: "a", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 8 };
        this.opcodeTable[0x03] = { type: "IN_INC", mode: "AM_R", reg_1: "bc", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 8 };
        this.opcodeTable[0x04] = { type: "IN_INC", mode: "AM_R", reg_1: "b", flags: { Z: "*", N: 0, H: "*", C: "-" }, cycles: 4 };
        this.opcodeTable[0x05] = { type: "IN_DEC", mode: "AM_R", reg_1: "b", flags: { Z: "*", N: 1, H: "*", C: "-" }, cycles: 4 };
        this.opcodeTable[0x06] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "b", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 8 };
        this.opcodeTable[0x07] = { type: "IN_RLCA", mode: "AM_IMP", flags: { Z: 0, N: 0, H: 0, C: "*" }, cycles: 4 };
        this.opcodeTable[0x08] = { type: "IN_LD", mode: "AM_A16_R", reg_1: "sp", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 20 };
        this.opcodeTable[0x09] = { type: "IN_ADD", mode: "AM_R_R", reg_1: "hl", reg_2: "bc", flags: { Z: "-", N: 0, H: "*", C: "*" }, cycles: 8 };
        this.opcodeTable[0x0A] = { type: "IN_LD", mode: "AM_R_MR", reg_1: "a", reg_2: "bc", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 8 };
        this.opcodeTable[0x0B] = { type: "IN_DEC", mode: "AM_R", reg_1: "bc", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 8 };
        this.opcodeTable[0x0C] = { type: "IN_INC", mode: "AM_R", reg_1: "c", flags: { Z: "*", N: 0, H: "*", C: "-" }, cycles: 4 };
        this.opcodeTable[0x0D] = { type: "IN_DEC", mode: "AM_R", reg_1: "c", flags: { Z: "*", N: 1, H: "*", C: "-" }, cycles: 4 };
        this.opcodeTable[0x0E] = { type: "IN_LD", mode: "AM_R_D8", reg_1: "c", flags: { Z: "-", N: "-", H: "-", C: "-" }, cycles: 8 };
        this.opcodeTable[0x0F] = { type: "IN_RRCA", mode: "AM_IMP", flags: { Z: 0, N: 0, H: 0, C: "*" }, cycles: 4 };



    }

    get(opcode: u8) {
        const instruction = this.opcodeTable[opcode]

        return instruction
    }
}

