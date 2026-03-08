// gameboy-memory.js
// Minimal Game Boy Memory Map skeleton (MBC0) with a simple bus.

import { Cartridge } from "./cart";
import { BETWEEN, u8 } from "./common";
import { Emu } from "./emu";
import { IntUtils } from "./utils/int_utils";

// Address ranges reference (GB classic):
// 0000-3FFF: ROM Bank 0
// 4000-7FFF: ROM Bank N (banked; here: fixed for MBC0)
// 8000-9FFF: VRAM (8KB)
// A000-BFFF: External RAM (cartridge RAM) - omitted or simple buffer
// C000-CFFF: Work RAM bank 0 (WRAM0)
// D000-DFFF: Work RAM bank 1 (WRAM1) - on DMG still usable (not banked)
// E000-FDFF: Echo RAM (mirror of C000-DDFF) - usually not used
// FE00-FE9F: OAM (sprite attribute table)
// FEA0-FEFF: Unusable
// FF00-FF7F: I/O registers
// FF80-FFFE: HRAM (high RAM)
// FFFF      : IE (interrupt enable)

export class Bus {
    cart: Cartridge = new Cartridge()
    private wram: Uint8Array = new Uint8Array(0x2000); // 8KB Work RAM
    private vram: Uint8Array = new Uint8Array(0x2000); // 8KB VRAM
    private hram: Uint8Array = new Uint8Array(0x80);   // HRAM (High RAM)
    private io: Uint8Array = new Uint8Array(0x80);     // IO Registers
    private ie: u8 = 0;                                // Interrupt Enable Register
    public onSerialWrite: ((value: number) => void) | undefined;

    constructor(private ctx: Emu) {

    }

    // 0xC000 – 0xDFFF

    read8(address: number): u8 {

        if (address < 0x8000) {
            return this.cart.read(address)
        }

        else if (BETWEEN(address, 0xC000, 0xDFFF)) {
            return this.wram[address - 0xC000]
        }

        else if (BETWEEN(address, 0x8000, 0x9FFF)) {
            return this.vram[address - 0x8000]
        }

        else if (BETWEEN(address, 0xFF00, 0xFF7F)) {
            return this.io[address - 0xFF00]
        }

        else if (BETWEEN(address, 0xFF80, 0xFFFE)) {
            return this.hram[address - 0xFF80]
        }

        else if (address === 0xFFFF) {
            return this.ie;
        }

        // 0x8000 – 0x9FFF → VRAM

        return 0xFF
        // not from cart is not implemented
    }

    read16(address: number) {
        let low = this.read8(address);
        let high = this.read8(address + 1);

        return IntUtils.makeU16(low, high)
    }

    write8(address: number, value: number) {
        if (address < 0x8000) {
            this.cart.write(address, value)
        }

        else if (BETWEEN(address, 0xC000, 0xDFFF)) {
            this.wram[address - 0xC000] = value;
        }

        else if (BETWEEN(address, 0x8000, 0x9FFF)) {
            this.vram[address - 0x8000] = value;
        }

        else if (BETWEEN(address, 0xFF00, 0xFF7F)) {
            if (address === 0xFF02 && value === 0x81) {
                if (this.onSerialWrite) {
                    this.onSerialWrite(this.io[1]);
                }
            }
            this.io[address - 0xFF00] = value;
        }

        else if (BETWEEN(address, 0xFF80, 0xFFFE)) {
            this.hram[address - 0xFF80] = value;
        }

        else if (address === 0xFFFF) {
            this.ie = value;
        }
    }

    write16(address: number, value: number) {
        let low = IntUtils.getLowByte(value);
        let high = IntUtils.getHighByte(value);

        this.write8(address, low);
        this.write8(address + 1, high);
    }

    /**
     * Helper to request an interrupt by setting the corresponding bit in IF (0xFF0F)
     * 0: V-Blank, 1: LCD, 2: Timer, 3: Serial, 4: Joypad
     */
    requestInterrupt(bit: number) {
        const currentIF = this.io[0x0F]; // Direct access to IO array for speed, 0xFF0F - 0xFF00 = 0x0F
        this.io[0x0F] = currentIF | (1 << bit);
    }

}