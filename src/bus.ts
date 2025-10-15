// gameboy-memory.js
// Minimal Game Boy Memory Map skeleton (MBC0) with a simple bus.

import { Cartridge } from "./cart";
import { BETWEEN } from "./common";

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


    // 0xC000 – 0xDFFF

    read(address: number): number {
        if (address < 0x8000) {
            return this.cart.read(address)
        }

        else if (BETWEEN(address, 0xC000, 0xDFFF)) {
            return this.wram[address - 0xC000]
        }

        else if (BETWEEN(address, 0x8000, 0x9FFF)) {
            return this.vram[address - 0x8000]
        }

        // 0x8000 – 0x9FFF → VRAM

        return 0xFF
        // not from cart is not implemented
    }

    write(address: number, value: number) {
        if (address < 0x8000) {
            this.cart.write(address, value)
        }

        else if (BETWEEN(address, 0xC000, 0xDFFF)) {
            this.wram[address - 0xC000] = value;
        }

        else if (BETWEEN(address, 0x8000, 0x9FFF)) {
            this.vram[address - 0x8000] = value;
        }



        // not from cart is not implemented
    }

}