import { u16, u8 } from "@/common";
import { IntUtils } from "@/utils/int_utils";

export class Regs {
    a: u8 = 0
    f: u8 = 0
    b: u8 = 0
    c: u8 = 0
    d: u8 = 0
    e: u8 = 0
    h: u8 = 0
    l: u8 = 0
    pc: u16 = 0
    sp: u16 = 0


    get af(): number {
        return ((this.a << 8) | (this.f & 0xF0)) & 0xFFFF;
    }

    set af(value: number) {
        this.a = (value >> 8) & 0xFF;
        this.f = value & 0xF0; // lower 4 bits must always be 0
    }

    get bc(): number {
        return ((this.b << 8) | this.c) & 0xFFFF;
    }

    set bc(value: number) {
        this.b = (value >> 8) & 0xFF;
        this.c = value & 0xFF;
    }

    get de(): number {
        return ((this.d << 8) | this.e) & 0xFFFF;
    }

    set de(value: number) {
        this.d = (value >> 8) & 0xFF;
        this.e = value & 0xFF;
    }

    get hl(): number {
        return ((this.h << 8) | this.l) & 0xFFFF;
    }

    set hl(value: number) {
        this.h = (value >> 8) & 0xFF;
        this.l = value & 0xFF;
    }

    public incrementPC() {
        this.pc++
    }

    //zero flag
    get Z() {
        return IntUtils.isBitSet(this.f, 7)
    }

    // Subtract flag
    get N() {
        return IntUtils.isBitSet(this.f, 6)
    }

    //half carry flag
    get H() {
        return IntUtils.isBitSet(this.f, 5)
    }

    // carry flag
    get C() {
        return IntUtils.isBitSet(this.f, 4)
    }




    toString(): string {

        return `A:${this.a.toString(16).padStart(2, "0")} ` +
            `F:${this.f.toString(16).padStart(2, "0")} ` +
            `B:${this.b.toString(16).padStart(2, "0")} ` +
            `C:${this.c.toString(16).padStart(2, "0")} ` +
            `D:${this.d.toString(16).padStart(2, "0")} ` +
            `E:${this.e.toString(16).padStart(2, "0")} ` +
            `H:${this.h.toString(16).padStart(2, "0")} ` +
            `L:${this.l.toString(16).padStart(2, "0")} ` +
            `PC:${this.pc.toString(16).padStart(4, "0")} ` +
            `SP:${this.sp.toString(16).padStart(4, "0")} ` +
            `[Z:${this.Z} N:${this.N} H:${this.H} C:${this.C}]`;
    }


    public static is16Reg(reg: RegType): boolean {
        return reg.length === 2
    }
}

export type RegType =
    "a" |
    "f" |
    "b" |
    "c" |
    "d" |
    "e" |
    "h" |
    "l" |
    "af" |
    "bc" |
    "de" |
    "hl" |
    "sp" |
    "pc"
