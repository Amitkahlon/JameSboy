import { u16, u8 } from "@/common";
import { IntUtils } from "@/utils/int_utils";

export class Regs {
    private _a: u8 = 0;
    private _f: u8 = 0;
    private _b: u8 = 0;
    private _c: u8 = 0;
    private _d: u8 = 0;
    private _e: u8 = 0;
    private _h: u8 = 0;
    private _l: u8 = 0;

    public get a(): u8 {
        return this._a;
    }
    public set a(value: u8) {
        this._a = IntUtils.toU8(value);
    }
    public get f(): u8 {
        return this._f;
    }
    public set f(value: u8) {
        this._f = IntUtils.toU8(value);
    }
    public get b(): u8 {
        return this._b;
    }
    public set b(value: u8) {
        this._b = IntUtils.toU8(value);
    }
    public get c(): u8 {
        return this._c;
    }
    public set c(value: u8) {
        this._c = IntUtils.toU8(value);
    }
    public get d(): u8 {
        return this._d;
    }
    public set d(value: u8) {
        this._d = IntUtils.toU8(value);
    }
    public get e(): u8 {
        return this._e;
    }
    public set e(value: u8) {
        this._e = IntUtils.toU8(value);
    }
    public get h(): u8 {
        return this._h;
    }
    public set h(value: u8) {
        this._h = IntUtils.toU8(value);
    }
    public get l(): u8 {
        return this._l;
    }
    public set l(value: u8) {
        this._l = IntUtils.toU8(value);
    }
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

    /**
        zero flag
     */
    get Z() {
        return IntUtils.isBitSet(this.f, 7)
    }

    set Z(val: boolean) {
        this.f = IntUtils.setBit(this.f, 7, val)
    }


    /**
     * Subtract flag
     */
    get N() {
        return IntUtils.isBitSet(this.f, 6)
    }

    set N(val: boolean) {
        this.f = IntUtils.setBit(this.f, 6, val)
    }


    /**
        half carry flag
    */
    get H() {
        return IntUtils.isBitSet(this.f, 5)
    }


    set H(val: boolean) {
        this.f = IntUtils.setBit(this.f, 5, val)
    }

    /**
     carry flag
    */
    get C() {
        return IntUtils.isBitSet(this.f, 4)
    }

    set C(val: boolean) {
        this.f = IntUtils.setBit(this.f, 4, val)
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
