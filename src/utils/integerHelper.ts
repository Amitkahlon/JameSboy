export class IntegerHelper {
    static toU8(n: number): number {
        return n & 0xFF;
    }

    static toU16(n: number): number {
        return n & 0xFFFF;
    }

    static makeU16(low: number, high: number): number {
        return ((high & 0xFF) << 8) | (low & 0xFF);
    }

    static getLowByte(n: number): number {
        return n & 0xFF;
    }

    static getHighByte(n: number): number {
        return (n >> 8) & 0xFF;
    }

    static isBitSet(value: number, bit: number): boolean {
        return ((value >> bit) & 1) === 1;
    }

    static setBit(value: number, bit: number): number {
        return value | (1 << bit);
    }

    static clearBit(value: number, bit: number): number {
        return value & ~(1 << bit);
    }

    static toggleBit(value: number, bit: number): number {
        return value ^ (1 << bit);
    }

    static hasCarry8(a: number, b: number): boolean {
        return (a + b) > 0xFF;
    }

    // check if half-carry (carry from bit 3 to bit 4)
    static hasHalfCarry8(a: number, b: number): boolean {
        return ((a & 0xF) + (b & 0xF)) > 0xF;
    }

    // check borrow (in subtraction)
    static hasBorrow8(a: number, b: number): boolean {
        return a < b;
    }

    // ensure pc and sp stay in range
    static wrapAddress16(addr: number): number {
        return addr & 0xFFFF;
    }
}