import { AddrMode, CondType, Instruction, InType, RegType } from "./instruction";

export const opcodeTable: Instruction[] = new Array(256);

opcodeTable[0x00] = {
    type: InType.IN_NOP,
    mode: AddrMode.AM_IMP,
    reg_1: "none",
    reg_2: "none",
    cond: CondType.CT_NONE,
    param: 0,
};

opcodeTable[0x06] = { // LD B, d8
    type: InType.IN_LD,
    mode: AddrMode.AM_R_D8,
    reg_1: "b",
    reg_2: "none",
    cond: CondType.CT_NONE,
    param: 0,
};

opcodeTable[0x04] = { // INC B
    type: InType.IN_INC,
    mode: AddrMode.AM_R,
    reg_1: "b",
    reg_2: "none",
    cond: CondType.CT_NONE,
    param: 0,
};