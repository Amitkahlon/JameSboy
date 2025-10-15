import { u16, u8 } from "@/common";

export class CPU_Registers {
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

    toString(): string {
        const Z = (this.f & 0x80) ? 1 : 0; // Zero
        const N = (this.f & 0x40) ? 1 : 0; // Subtract
        const H = (this.f & 0x20) ? 1 : 0; // Half-carry
        const C = (this.f & 0x10) ? 1 : 0; // Carry

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
            `[Z:${Z} N:${N} H:${H} C:${C}]`;
    }
}