import { Cartridge } from '@/cart'
import { beforeAll, describe, expect, it, test, beforeEach } from 'vitest'
import path from 'path';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { romTypeName, } from '@/entities/rom_typs';
import { licCodeeName } from '@/entities/lic_codes';
import { CPU } from '@/cpu';
import { Bus } from '@/bus';
import { Emu } from '@/emu';



describe("cart dmg acid tests", () => {
  const romName = `dmg-acid2`
  const cart: Cartridge = new Cartridge()

  it("should initialize cart with file name", async () => {
    await cart.initCart(romName)
  })

  it('should read rom title', async () => {
    expect(cart.rom_header.title).to.eq("DMG-ACID2")
  });

  it('should read type', async () => {
    expect(cart.rom_header.type).to.eq(0)
    const name = romTypeName(cart.rom_header.type)
    expect(name).to.eq("ROM ONLY")
  });

  it("ROM Size", () => {
    expect(cart.rom_header.romSize).to.eq(0)
  })

  it("RAM Size", () => {
    expect(cart.rom_header.ramSize).to.eq(0)

  })

  it("Lic Code", () => {
    expect(cart.rom_header.ramSize).to.eq(0)
    const licCode = licCodeeName(cart.rom_header.licCode)
    expect(licCode).to.eq("None")
  })

  it("ROM Vers", () => {
    expect(cart.rom_header.version).to.eq(0)
  })

  it("checksum", () => {
    expect(cart.rom_header.checksum).to.eq(159)
    const isValid = cart.verifyChecksum()
    expect(isValid).to.eq(true)
  })



})

describe('CPU Instructions', () => {
  let emu: Emu;
  let cpu: CPU;

  beforeEach(() => {
    emu = new Emu(() => { });
    cpu = emu.cpu;
    // Initialize ROM with enough space
    (cpu as any).mem.cart.rom = new Uint8Array(0x10000);
    cpu.regs.pc = 0;

    // Reset registers to known state
    cpu.regs.a = 0;
    cpu.regs.b = 0;
    cpu.regs.c = 0;
    cpu.regs.d = 0;
    cpu.regs.e = 0;
    cpu.regs.h = 0;
    cpu.regs.l = 0;
    cpu.regs.f = 0;
    cpu.regs.sp = 0xFFFE;
  });

  describe('8-bit Loads', () => {
    it('0x06 LD B, d8', () => {
      (cpu as any).mem.cart.rom.set([0x06, 0x42], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x42);
      expect(cpu.regs.pc).toBe(2);
    });

    it('0x0E LD C, d8', () => {
      (cpu as any).mem.cart.rom.set([0x0E, 0x42], 0);
      cpu.cpu_step();
      expect(cpu.regs.c).toBe(0x42);
    });

    it('0x16 LD D, d8', () => {
      (cpu as any).mem.cart.rom.set([0x16, 0x42], 0);
      cpu.cpu_step();
      expect(cpu.regs.d).toBe(0x42);
    });

    it('0x1E LD E, d8', () => {
      (cpu as any).mem.cart.rom.set([0x1E, 0x42], 0);
      cpu.cpu_step();
      expect(cpu.regs.e).toBe(0x42);
    });

    it('0x26 LD H, d8', () => {
      (cpu as any).mem.cart.rom.set([0x26, 0x42], 0);
      cpu.cpu_step();
      expect(cpu.regs.h).toBe(0x42);
    });

    it('0x2E LD L, d8', () => {
      (cpu as any).mem.cart.rom.set([0x2E, 0x42], 0);
      cpu.cpu_step();
      expect(cpu.regs.l).toBe(0x42);
    });

    it('0x7F LD A, A', () => {
      cpu.regs.a = 0x12;
      (cpu as any).mem.cart.rom.set([0x7F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x12);
    });

    it('0x78 LD A, B', () => {
      cpu.regs.b = 0x12;
      (cpu as any).mem.cart.rom.set([0x78], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x12);
    });

    it('0x0A LD A, (BC)', () => {
      cpu.regs.bc = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x55);
      (cpu as any).mem.cart.rom.set([0x0A], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x55);
    });

    it('0x1A LD A, (DE)', () => {
      cpu.regs.de = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x55);
      (cpu as any).mem.cart.rom.set([0x1A], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x55);
    });

    it('0xFA LD A, (a16)', () => {
      (cpu as any).mem.write8(0xC000, 0x55);
      (cpu as any).mem.cart.rom.set([0xFA, 0x00, 0xC0], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x55);
    });

    it('0x02 LD (BC), A', () => {
      cpu.regs.a = 0x55;
      cpu.regs.bc = 0xC000;
      (cpu as any).mem.cart.rom.set([0x02], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x55);
    });

    it('0x12 LD (DE), A', () => {
      cpu.regs.a = 0x55;
      cpu.regs.de = 0xC000;
      (cpu as any).mem.cart.rom.set([0x12], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x55);
    });

    it('0xEA LD (a16), A', () => {
      cpu.regs.a = 0x55;
      (cpu as any).mem.cart.rom.set([0xEA, 0x00, 0xC0], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x55);
    });

    it('0x22 LD (HL+), A', () => {
      cpu.regs.hl = 0xC000;
      cpu.regs.a = 0x55;
      (cpu as any).mem.cart.rom.set([0x22], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x55);
      expect(cpu.regs.hl).toBe(0xC001);
    });

    it('0x2A LD A, (HL+)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0xAA);
      (cpu as any).mem.cart.rom.set([0x2A], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xAA);
      expect(cpu.regs.hl).toBe(0xC001);
    });

    it('0x32 LD (HL-), A', () => {
      cpu.regs.hl = 0xC000;
      cpu.regs.a = 0x55;
      (cpu as any).mem.cart.rom.set([0x32], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x55);
      expect(cpu.regs.hl).toBe(0xBFFF);
    });

    it('0x3A LD A, (HL-)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0xAA);
      (cpu as any).mem.cart.rom.set([0x3A], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xAA);
      expect(cpu.regs.hl).toBe(0xBFFF);
    });

    it('0x36 LD (HL), d8', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.cart.rom.set([0x36, 0x77], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x77);
    });
  });

  describe('16-bit Loads', () => {
    it('0x01 LD BC, d16', () => {
      (cpu as any).mem.cart.rom.set([0x01, 0x34, 0x12], 0);
      cpu.cpu_step();
      expect(cpu.regs.bc).toBe(0x1234);
    });

    it('0x11 LD DE, d16', () => {
      (cpu as any).mem.cart.rom.set([0x11, 0x34, 0x12], 0);
      cpu.cpu_step();
      expect(cpu.regs.de).toBe(0x1234);
    });

    it('0x21 LD HL, d16', () => {
      (cpu as any).mem.cart.rom.set([0x21, 0x34, 0x12], 0);
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0x1234);
    });

    it('0x31 LD SP, d16', () => {
      (cpu as any).mem.cart.rom.set([0x31, 0x34, 0x12], 0);
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0x1234);
    });

    it('0xF9 LD SP, HL', () => {
      cpu.regs.hl = 0x1234;
      (cpu as any).mem.cart.rom.set([0xF9], 0);
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0x1234);
    });

    it('0x08 LD (a16), SP', () => {
      cpu.regs.sp = 0x1234;
      (cpu as any).mem.cart.rom.set([0x08, 0x00, 0xC0], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read16(0xC000)).toBe(0x1234);
    });

    it('0xF8 LD HL, SP+r8', () => {
      cpu.regs.sp = 0xFFF0;
      (cpu as any).mem.cart.rom.set([0xF8, 0x02], 0); // Add 2
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0xFFF2);
      expect(cpu.regs.Z).toBe(false);
      expect(cpu.regs.N).toBe(false);
    });
  });

  describe('8-bit Arithmetic', () => {
    it('0x80 ADD A, B', () => {
      cpu.regs.a = 0x10;
      cpu.regs.b = 0x20;
      (cpu as any).mem.cart.rom.set([0x80], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x30);
      expect(cpu.regs.Z).toBe(false);
      expect(cpu.regs.N).toBe(false);
      expect(cpu.regs.H).toBe(false);
      expect(cpu.regs.C).toBe(false);
    });

    it('0x87 ADD A, A', () => {
      cpu.regs.a = 0x10;
      (cpu as any).mem.cart.rom.set([0x87], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x20);
    });

    it('0xC6 ADD A, d8', () => {
      cpu.regs.a = 0x10;
      (cpu as any).mem.cart.rom.set([0xC6, 0x20], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x30);
    });

    it('0x90 SUB B', () => {
      cpu.regs.a = 0x30;
      cpu.regs.b = 0x10;
      (cpu as any).mem.cart.rom.set([0x90], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x20);
      expect(cpu.regs.N).toBe(true);
    });

    it('0xA0 AND B', () => {
      cpu.regs.a = 0x0F;
      cpu.regs.b = 0x11;
      (cpu as any).mem.cart.rom.set([0xA0], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x01);
      expect(cpu.regs.H).toBe(true);
    });

    it('0xA8 XOR B', () => {
      cpu.regs.a = 0x0F;
      cpu.regs.b = 0x11;
      (cpu as any).mem.cart.rom.set([0xA8], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x1E);
    });

    it('0xB0 OR B', () => {
      cpu.regs.a = 0x0F;
      cpu.regs.b = 0x10;
      (cpu as any).mem.cart.rom.set([0xB0], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x1F);
    });

    it('0xB8 CP B', () => {
      cpu.regs.a = 0x10;
      cpu.regs.b = 0x10;
      (cpu as any).mem.cart.rom.set([0xB8], 0);
      cpu.cpu_step();
      expect(cpu.regs.Z).toBe(true);
      expect(cpu.regs.N).toBe(true);
    });

    it('0x04 INC B', () => {
      cpu.regs.b = 0x0F;
      (cpu as any).mem.cart.rom.set([0x04], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x10);
      expect(cpu.regs.H).toBe(true);
    });

    it('0x05 DEC B', () => {
      cpu.regs.b = 0x01;
      (cpu as any).mem.cart.rom.set([0x05], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x00);
      expect(cpu.regs.Z).toBe(true);
      expect(cpu.regs.N).toBe(true);
    });

    it('0x34 INC (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x10);
      (cpu as any).mem.cart.rom.set([0x34], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x11);
      expect(cpu.regs.Z).toBe(false);
      expect(cpu.regs.N).toBe(false);
      expect(cpu.regs.H).toBe(false);
    });

    it('0x35 DEC (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x01);
      (cpu as any).mem.cart.rom.set([0x35], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x00);
      expect(cpu.regs.Z).toBe(true);
      expect(cpu.regs.N).toBe(true);
    });
  });

  describe('16-bit Arithmetic', () => {
    it('0x09 ADD HL, BC', () => {
      cpu.regs.hl = 0x1000;
      cpu.regs.bc = 0x0100;
      (cpu as any).mem.cart.rom.set([0x09], 0);
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0x1100);
      expect(cpu.regs.N).toBe(false);
    });

    it('0x03 INC BC', () => {
      cpu.regs.bc = 0xFFFF;
      (cpu as any).mem.cart.rom.set([0x03], 0);
      cpu.cpu_step();
      expect(cpu.regs.bc).toBe(0x0000);
    });

    it('0x0B DEC BC', () => {
      cpu.regs.bc = 0x0000;
      (cpu as any).mem.cart.rom.set([0x0B], 0);
      cpu.cpu_step();
      expect(cpu.regs.bc).toBe(0xFFFF);
    });
  });

  describe('Rotates & Shifts', () => {
    it('0x07 RLCA', () => {
      cpu.regs.a = 0x80;
      (cpu as any).mem.cart.rom.set([0x07], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x01);
      expect(cpu.regs.C).toBe(true);
    });

    it('0x17 RLA', () => {
      cpu.regs.a = 0x80;
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x17], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x01);
      expect(cpu.regs.C).toBe(true);
    });
  });

  describe('Jumps & Calls', () => {
    it('0xC3 JP a16', () => {
      (cpu as any).mem.cart.rom.set([0xC3, 0x00, 0x10], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x1000);
    });

    it('0x20 JR NZ, r8 (Taken)', () => {
      cpu.regs.Z = false;
      (cpu as any).mem.cart.rom.set([0x20, 0x05], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2 + 5);
    });

    it('0xCD CALL a16', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xCD, 0x50, 0x20], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x2050);
      expect((cpu as any).mem.read16(cpu.regs.sp)).toBe(3);
    });

    it('0xC9 RET', () => {
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      (cpu as any).mem.cart.rom.set([0xC9], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x1234);
      expect(cpu.regs.sp).toBe(0xFFFE);
    });

    it('0xD9 RETI', () => {
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      cpu.ime = false;
      (cpu as any).mem.cart.rom.set([0xD9], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x1234);
      expect(cpu.ime).toBe(true);
    });
  });

  describe('Misc', () => {
    it('0x00 NOP', () => {
      (cpu as any).mem.cart.rom.set([0x00], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(1);
    });

    it('0x2F CPL', () => {
      cpu.regs.a = 0xFF;
      (cpu as any).mem.cart.rom.set([0x2F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x00);
      expect(cpu.regs.N).toBe(true);
      expect(cpu.regs.H).toBe(true);
    });
  });

  describe('CB Prefix', () => {
    it('0xCB 0x37 SWAP A', () => {
      cpu.regs.a = 0xF0;
      (cpu as any).mem.cart.rom.set([0xCB, 0x37], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x0F);
      expect(cpu.regs.Z).toBe(false);
    });
  });

  describe('Stack Operations', () => {
    it('0xC5 PUSH BC', () => {
      cpu.regs.bc = 0x1234;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xC5], 0);
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0xFFFC);
      expect((cpu as any).mem.read16(0xFFFC)).toBe(0x1234);
    });

    it('0xC1 POP BC', () => {
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x5678);
      (cpu as any).mem.cart.rom.set([0xC1], 0);
      cpu.cpu_step();
      expect(cpu.regs.bc).toBe(0x5678);
      expect(cpu.regs.sp).toBe(0xFFFE);
    });

    it('0xF1 POP AF (Masks lower nibble of F)', () => {
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x12FF); // F = 0xFF
      (cpu as any).mem.cart.rom.set([0xF1], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x12);
      expect(cpu.regs.f).toBe(0xF0); // Lower nibble cleared
    });
  });

  describe('Advanced Arithmetic', () => {
    it('0xCE ADC A, d8', () => {
      cpu.regs.a = 0x10;
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0xCE, 0x20], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x31);
    });

    it('0xDE SBC A, d8', () => {
      cpu.regs.a = 0x30;
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0xDE, 0x10], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x1F);
    });

    it('0x27 DAA (BCD Correction)', () => {
      // 0x09 + 0x01 = 0x0A -> DAA -> 0x10
      cpu.regs.a = 0x09;
      cpu.regs.b = 0x01;
      (cpu as any).mem.cart.rom.set([0x80, 0x27], 0); // ADD A, B; DAA
      cpu.cpu_step(); // ADD
      cpu.cpu_step(); // DAA
      expect(cpu.regs.a).toBe(0x10);
    });

    it('0xE8 ADD SP, r8', () => {
      cpu.regs.sp = 0xFFF8;
      (cpu as any).mem.cart.rom.set([0xE8, 0x02], 0); // Add 2
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0xFFFA);
      expect(cpu.regs.Z).toBe(false);
      expect(cpu.regs.N).toBe(false);
    });
  });

  describe('High RAM & IO', () => {
    it('0xE0 LDH (a8), A', () => {
      cpu.regs.a = 0x77;
      (cpu as any).mem.cart.rom.set([0xE0, 0x80], 0); // Write to FF80 (HRAM)
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xFF80)).toBe(0x77);
    });

    it('0xF0 LDH A, (a8)', () => {
      (cpu as any).mem.write8(0xFF81, 0x88);
      (cpu as any).mem.cart.rom.set([0xF0, 0x81], 0); // Read from FF81
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x88);
    });

    it('0xE2 LD (C), A', () => {
      cpu.regs.c = 0x10;
      cpu.regs.a = 0xFF;
      (cpu as any).mem.cart.rom.set([0xE2], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xFF10)).toBe(0xFF);
    });

    it('0xF2 LD A, (C)', () => {
      cpu.regs.c = 0x20;
      (cpu as any).mem.write8(0xFF20, 0x88);
      (cpu as any).mem.cart.rom.set([0xF2], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x88);
    });
  });

  describe('More 8-bit Loads', () => {
    it('0x41 LD B, C', () => {
      cpu.regs.c = 0x12;
      (cpu as any).mem.cart.rom.set([0x41], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x12);
    });
    it('0x46 LD B, (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x34);
      (cpu as any).mem.cart.rom.set([0x46], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x34);
    });
    it('0x70 LD (HL), B', () => {
      cpu.regs.hl = 0xC000;
      cpu.regs.b = 0x78;
      (cpu as any).mem.cart.rom.set([0x70], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x78);
    });
  });

  describe('More 16-bit Arithmetic', () => {
    it('0x13 INC DE', () => {
      cpu.regs.de = 0xFFFF;
      (cpu as any).mem.cart.rom.set([0x13], 0);
      cpu.cpu_step();
      expect(cpu.regs.de).toBe(0x0000);
    });
    it('0x1B DEC DE', () => {
      cpu.regs.de = 0x0000;
      (cpu as any).mem.cart.rom.set([0x1B], 0);
      cpu.cpu_step();
      expect(cpu.regs.de).toBe(0xFFFF);
    });
    it('0x19 ADD HL, DE', () => {
      cpu.regs.hl = 0x1000;
      cpu.regs.de = 0x0100;
      (cpu as any).mem.cart.rom.set([0x19], 0);
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0x1100);
    });
  });

  describe('More Rotates & Shifts (Accumulator)', () => {
    it('0x0F RRCA', () => {
      cpu.regs.a = 0x01;
      (cpu as any).mem.cart.rom.set([0x0F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x80);
      expect(cpu.regs.C).toBe(true);
    });
    it('0x1F RRA', () => {
      cpu.regs.a = 0x01;
      cpu.regs.C = false;
      (cpu as any).mem.cart.rom.set([0x1F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x00);
      expect(cpu.regs.C).toBe(true);
    });
  });

  describe('Control Flow', () => {
    it('0x18 JR r8', () => {
      (cpu as any).mem.cart.rom.set([0x18, 0x04], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2 + 4);
    });
    it('0x28 JR Z, r8 (Taken)', () => {
      cpu.regs.Z = true;
      (cpu as any).mem.cart.rom.set([0x28, 0x04], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2 + 4);
    });
    it('0xE9 JP (HL)', () => {
      cpu.regs.hl = 0x1234;
      (cpu as any).mem.cart.rom.set([0xE9], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x1234);
    });
    it('0xC4 CALL NZ, a16 (Taken)', () => {
      cpu.regs.Z = false;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xC4, 0x50, 0x20], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x2050);
      expect((cpu as any).mem.read16(cpu.regs.sp)).toBe(3);
    });
    it('0xC0 RET NZ (Taken)', () => {
      cpu.regs.Z = false;
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      (cpu as any).mem.cart.rom.set([0xC0], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x1234);
    });
    it('0xC7 RST 00H', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xC7], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x0000);
      expect((cpu as any).mem.read16(cpu.regs.sp)).toBe(1);
    });
  });

  describe('More Misc', () => {
    it('0x37 SCF', () => {
      cpu.regs.C = false;
      (cpu as any).mem.cart.rom.set([0x37], 0);
      cpu.cpu_step();
      expect(cpu.regs.C).toBe(true);
    });
    it('0x3F CCF', () => {
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x3F], 0);
      cpu.cpu_step();
      expect(cpu.regs.C).toBe(false);
    });
    it('0xF3 DI', () => {
      cpu.ime = true;
      (cpu as any).mem.cart.rom.set([0xF3], 0);
      cpu.cpu_step();
      expect(cpu.ime).toBe(false);
    });
    it('0xFB EI', () => {
      cpu.ime = false;
      (cpu as any).mem.cart.rom.set([0xFB], 0);
      cpu.cpu_step();
      expect(cpu.ime).toBe(true);
    });
  });

  describe('More ALU', () => {
    it('0x88 ADC A, B', () => {
      cpu.regs.a = 0x10;
      cpu.regs.b = 0x20;
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x88], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x31);
    });
    it('0x98 SBC A, B', () => {
      cpu.regs.a = 0x30;
      cpu.regs.b = 0x10;
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x98], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x1F);
    });
    it('0xFE CP d8', () => {
      cpu.regs.a = 0x10;
      (cpu as any).mem.cart.rom.set([0xFE, 0x10], 0);
      cpu.cpu_step();
      expect(cpu.regs.Z).toBe(true);
    });
  });

  describe('Even More Instructions', () => {
    it('0xF5 PUSH AF', () => {
      cpu.regs.a = 0x12;
      cpu.regs.f = 0xD0; // Z=1, N=1, H=0, C=1 -> 1101 0000
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xF5], 0);
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0xFFFC);
      const val = (cpu as any).mem.read16(0xFFFC);
      expect(val).toBe(0x12D0);
    });

    it('0x29 ADD HL, HL', () => {
      cpu.regs.hl = 0x1000;
      (cpu as any).mem.cart.rom.set([0x29], 0);
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0x2000);
      expect(cpu.regs.N).toBe(false);
    });

    it('0x39 ADD HL, SP', () => {
      cpu.regs.hl = 0x1000;
      cpu.regs.sp = 0x0100;
      (cpu as any).mem.cart.rom.set([0x39], 0);
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0x1100);
      expect(cpu.regs.N).toBe(false);
    });

    it('0x33 INC SP', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0x33], 0);
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0xFFFF);
    });

    it('0x3B DEC SP', () => {
      cpu.regs.sp = 0x0000;
      (cpu as any).mem.cart.rom.set([0x3B], 0);
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0xFFFF);
    });

    it('0x10 STOP', () => {
      (cpu as any).mem.cart.rom.set([0x10, 0x00], 0);
      const result = cpu.cpu_step();
      expect(result).toBe(false);
    });

    it('0xFF RST 38H', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xFF], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x0038);
      expect((cpu as any).mem.read16(cpu.regs.sp)).toBe(1);
    });
  });

  describe('More CB Prefix', () => {
    it('0xCB 0x7C BIT 7, H', () => {
      cpu.regs.h = 0x80; // Bit 7 set
      (cpu as any).mem.cart.rom.set([0xCB, 0x7C], 0);
      cpu.cpu_step();
      expect(cpu.regs.Z).toBe(false);

      cpu.regs.h = 0x00; // Bit 7 clear
      cpu.regs.pc = 0;
      (cpu as any).mem.cart.rom.set([0xCB, 0x7C], 0);
      cpu.cpu_step();
      expect(cpu.regs.Z).toBe(true);
    });

    it('0xCB 0x9F RES 3, A', () => {
      cpu.regs.a = 0xFF;
      (cpu as any).mem.cart.rom.set([0xCB, 0x9F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xF7); // 1111 0111
    });

    it('0xCB 0xCD SET 1, L', () => {
      cpu.regs.l = 0x00;
      (cpu as any).mem.cart.rom.set([0xCB, 0xCD], 0);
      cpu.cpu_step();
      expect(cpu.regs.l).toBe(0x02); // 0000 0010
    });

    it('0xCB 0x12 RL D', () => {
      cpu.regs.d = 0x80;
      cpu.regs.C = false;
      (cpu as any).mem.cart.rom.set([0xCB, 0x12], 0);
      cpu.cpu_step();
      expect(cpu.regs.d).toBe(0x00);
      expect(cpu.regs.C).toBe(true);
    });
  });

  describe('Shift & Rotate Instructions (CB)', () => {
    it('0xCB 0x20 SLA B', () => {
      // Shift Left Arithmetic: B << 1. Bit 0 becomes 0. C = old bit 7.
      cpu.regs.b = 0x81; // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x20], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x02); // 0000 0010
      expect(cpu.regs.C).toBe(true); // Old bit 7 was 1
      expect(cpu.regs.Z).toBe(false);
    });

    it('0xCB 0x28 SRA B', () => {
      // Shift Right Arithmetic: B >> 1. Bit 7 unchanged. C = old bit 0.
      cpu.regs.b = 0x81; // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x28], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0xC0); // 1100 0000 (Bit 7 stays 1)
      expect(cpu.regs.C).toBe(true); // Old bit 0 was 1
      expect(cpu.regs.Z).toBe(false);
    });

    it('0xCB 0x38 SRL B', () => {
      // Shift Right Logical: B >> 1. Bit 7 becomes 0. C = old bit 0.
      cpu.regs.b = 0x81; // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x38], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x40); // 0100 0000
      expect(cpu.regs.C).toBe(true); // Old bit 0 was 1
      expect(cpu.regs.Z).toBe(false);
    });

    it('0xCB 0x00 RLC B', () => {
      // Rotate Left Circular: B << 1. Bit 0 = old bit 7. C = old bit 7.
      cpu.regs.b = 0x81; // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x00], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x03); // 0000 0011
      expect(cpu.regs.C).toBe(true);
      expect(cpu.regs.Z).toBe(false);
    });

    it('0xCB 0x08 RRC B', () => {
      // Rotate Right Circular: B >> 1. Bit 7 = old bit 0. C = old bit 0.
      cpu.regs.b = 0x81; // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x08], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0xC0); // 1100 0000
      expect(cpu.regs.C).toBe(true);
      expect(cpu.regs.Z).toBe(false);
    });

    it('0xCB 0x18 RR B', () => {
      // Rotate Right through Carry: B >> 1. Bit 7 = old C. C = old bit 0.
      cpu.regs.b = 0x01; // 0000 0001
      cpu.regs.C = true; // Old Carry = 1
      (cpu as any).mem.cart.rom.set([0xCB, 0x18], 0);
      cpu.cpu_step();
      expect(cpu.regs.b).toBe(0x80); // 1000 0000 (Bit 7 became old C)
      expect(cpu.regs.C).toBe(true); // New C = old bit 0
      expect(cpu.regs.Z).toBe(false);
    });
  });

  describe('Other Instructions', () => {
    it('0x76 HALT', () => {
      (cpu as any).mem.cart.rom.set([0x76], 0);
      const result = cpu.cpu_step();
      expect(result).toBe(false);
    });

    it('0xE7 RST 20H', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xE7], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x0020);
      expect((cpu as any).mem.read16(cpu.regs.sp)).toBe(1);
    });
  });

  describe('Logic with Immediate', () => {
    it('0xE6 AND d8', () => {
      cpu.regs.a = 0xFF;
      (cpu as any).mem.cart.rom.set([0xE6, 0x0F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x0F);
      expect(cpu.regs.H).toBe(true);
    });
    it('0xEE XOR d8', () => {
      cpu.regs.a = 0xFF;
      (cpu as any).mem.cart.rom.set([0xEE, 0x0F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xF0);
    });
    it('0xF6 OR d8', () => {
      cpu.regs.a = 0xF0;
      (cpu as any).mem.cart.rom.set([0xF6, 0x0F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xFF);
    });
  });

  describe('Logic with (HL)', () => {
    it('0xA6 AND (HL)', () => {
      cpu.regs.a = 0xFF;
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x0F);
      (cpu as any).mem.cart.rom.set([0xA6], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x0F);
      expect(cpu.regs.H).toBe(true);
    });
    it('0xAE XOR (HL)', () => {
      cpu.regs.a = 0xFF;
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x0F);
      (cpu as any).mem.cart.rom.set([0xAE], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xF0);
    });
    it('0xB6 OR (HL)', () => {
      cpu.regs.a = 0xF0;
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x0F);
      (cpu as any).mem.cart.rom.set([0xB6], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xFF);
    });
    it('0xBE CP (HL)', () => {
      cpu.regs.a = 0x10;
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x10);
      (cpu as any).mem.cart.rom.set([0xBE], 0);
      cpu.cpu_step();
      expect(cpu.regs.Z).toBe(true);
      expect(cpu.regs.N).toBe(true);
    });
  });

  describe('Missing Stack Ops', () => {
    it('0xD5 PUSH DE', () => {
      cpu.regs.de = 0x8899;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xD5], 0);
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0xFFFC);
      expect((cpu as any).mem.read16(0xFFFC)).toBe(0x8899);
    });
    it('0xE5 PUSH HL', () => {
      cpu.regs.hl = 0xAABB;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xE5], 0);
      cpu.cpu_step();
      expect(cpu.regs.sp).toBe(0xFFFC);
      expect((cpu as any).mem.read16(0xFFFC)).toBe(0xAABB);
    });
    it('0xD1 POP DE', () => {
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1122);
      (cpu as any).mem.cart.rom.set([0xD1], 0);
      cpu.cpu_step();
      expect(cpu.regs.de).toBe(0x1122);
      expect(cpu.regs.sp).toBe(0xFFFE);
    });
    it('0xE1 POP HL', () => {
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x3344);
      (cpu as any).mem.cart.rom.set([0xE1], 0);
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0x3344);
      expect(cpu.regs.sp).toBe(0xFFFE);
    });
  });

  describe('Conditional Jumps/Calls (Carry)', () => {
    it('0x30 JR NC, r8 (Taken)', () => {
      cpu.regs.C = false;
      (cpu as any).mem.cart.rom.set([0x30, 0x05], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2 + 5);
    });
    it('0x30 JR NC, r8 (Not Taken)', () => {
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x30, 0x05], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2);
    });
    it('0x38 JR C, r8 (Taken)', () => {
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x38, 0x05], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2 + 5);
    });
    it('0xD2 JP NC, a16 (Taken)', () => {
      cpu.regs.C = false;
      (cpu as any).mem.cart.rom.set([0xD2, 0x00, 0x20], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x2000);
    });
    it('0xDA JP C, a16 (Taken)', () => {
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0xDA, 0x00, 0x30], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x3000);
    });
    it('0xD4 CALL NC, a16 (Taken)', () => {
      cpu.regs.C = false;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xD4, 0x50, 0x40], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x4050);
      expect((cpu as any).mem.read16(cpu.regs.sp)).toBe(3);
    });
    it('0xDC CALL C, a16 (Taken)', () => {
      cpu.regs.C = true;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xDC, 0x60, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x5060);
      expect((cpu as any).mem.read16(cpu.regs.sp)).toBe(3);
    });
    it('0xD0 RET NC (Taken)', () => {
      cpu.regs.C = false;
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      (cpu as any).mem.cart.rom.set([0xD0], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x1234);
    });
    it('0xD8 RET C (Taken)', () => {
      cpu.regs.C = true;
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x5678);
      (cpu as any).mem.cart.rom.set([0xD8], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x5678);
    });
  });

  describe('More RST Vectors', () => {
    it('0xCF RST 08H', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xCF], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x0008);
    });
    it('0xD7 RST 10H', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xD7], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x0010);
    });
    it('0xDF RST 18H', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xDF], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x0018);
    });
    it('0xEF RST 28H', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xEF], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x0028);
    });
    it('0xF7 RST 30H', () => {
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xF7], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x0030);
    });
  });

  describe('Arithmetic on Memory (HL)', () => {
    it('0x8E ADC A, (HL)', () => {
      cpu.regs.a = 0x10;
      cpu.regs.hl = 0xC000;
      cpu.regs.C = true;
      (cpu as any).mem.write8(0xC000, 0x20);
      (cpu as any).mem.cart.rom.set([0x8E], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x31);
    });

    it('0x9E SBC A, (HL)', () => {
      cpu.regs.a = 0x30;
      cpu.regs.hl = 0xC000;
      cpu.regs.C = true;
      (cpu as any).mem.write8(0xC000, 0x10);
      (cpu as any).mem.cart.rom.set([0x9E], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x1F);
    });
  });

  describe('CB Prefix on Memory (HL)', () => {
    it('0xCB 0x06 RLC (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x81); // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x06], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x03); // 0000 0011
      expect(cpu.regs.C).toBe(true);
    });

    it('0xCB 0x0E RRC (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x81); // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x0E], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0xC0); // 1100 0000
      expect(cpu.regs.C).toBe(true);
    });

    it('0xCB 0x16 RL (HL)', () => {
      cpu.regs.hl = 0xC000;
      cpu.regs.C = false;
      (cpu as any).mem.write8(0xC000, 0x80); // 1000 0000
      (cpu as any).mem.cart.rom.set([0xCB, 0x16], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x00);
      expect(cpu.regs.C).toBe(true);
    });

    it('0xCB 0x1E RR (HL)', () => {
      cpu.regs.hl = 0xC000;
      cpu.regs.C = true;
      (cpu as any).mem.write8(0xC000, 0x01); // 0000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x1E], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x80); // 1000 0000
      expect(cpu.regs.C).toBe(true);
    });

    it('0xCB 0x26 SLA (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x80); // 1000 0000
      (cpu as any).mem.cart.rom.set([0xCB, 0x26], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x00);
      expect(cpu.regs.C).toBe(true);
    });

    it('0xCB 0x2E SRA (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x81); // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x2E], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0xC0); // 1100 0000
      expect(cpu.regs.C).toBe(true);
    });

    it('0xCB 0x36 SWAP (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0xF0);
      (cpu as any).mem.cart.rom.set([0xCB, 0x36], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x0F);
    });

    it('0xCB 0x3E SRL (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x81); // 1000 0001
      (cpu as any).mem.cart.rom.set([0xCB, 0x3E], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x40); // 0100 0000
      expect(cpu.regs.C).toBe(true);
    });

    it('0xCB 0x46 BIT 0, (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x01);
      (cpu as any).mem.cart.rom.set([0xCB, 0x46], 0);
      cpu.cpu_step();
      expect(cpu.regs.Z).toBe(false);

      (cpu as any).mem.write8(0xC000, 0xFE);
      cpu.regs.pc = 0;
      (cpu as any).mem.cart.rom.set([0xCB, 0x46], 0);
      cpu.cpu_step();
      expect(cpu.regs.Z).toBe(true);
    });

    it('0xCB 0x86 RES 0, (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x01);
      (cpu as any).mem.cart.rom.set([0xCB, 0x86], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x00);
    });

    it('0xCB 0xC6 SET 0, (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x00);
      (cpu as any).mem.cart.rom.set([0xCB, 0xC6], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x01);
    });
  });

  describe('Completing Instruction Set', () => {
    it('0xCA JP Z, a16 (Taken)', () => {
      cpu.regs.Z = true;
      (cpu as any).mem.cart.rom.set([0xCA, 0x00, 0x40], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x4000);
    });

    it('0xCC CALL Z, a16 (Taken)', () => {
      cpu.regs.Z = true;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xCC, 0x50, 0x40], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x4050);
      expect((cpu as any).mem.read16(cpu.regs.sp)).toBe(3);
    });

    it('0xC8 RET Z (Taken)', () => {
      cpu.regs.Z = true;
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      (cpu as any).mem.cart.rom.set([0xC8], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(0x1234);
    });

    it('0x7E LD A, (HL)', () => {
      cpu.regs.hl = 0xC000;
      (cpu as any).mem.write8(0xC000, 0x7E);
      (cpu as any).mem.cart.rom.set([0x7E], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x7E);
    });

    it('0x77 LD (HL), A', () => {
      cpu.regs.hl = 0xC000;
      cpu.regs.a = 0x77;
      (cpu as any).mem.cart.rom.set([0x77], 0);
      cpu.cpu_step();
      expect((cpu as any).mem.read8(0xC000)).toBe(0x77);
    });

    it('0x79 LD A, C', () => {
      cpu.regs.c = 0x79;
      (cpu as any).mem.cart.rom.set([0x79], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x79);
    });

    it('0x4F LD C, A', () => {
      cpu.regs.a = 0x4F;
      (cpu as any).mem.cart.rom.set([0x4F], 0);
      cpu.cpu_step();
      expect(cpu.regs.c).toBe(0x4F);
    });

    it('0x89 ADC A, C', () => {
      cpu.regs.a = 0x10;
      cpu.regs.c = 0x20;
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x89], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x31);
    });

    it('0x99 SBC A, C', () => {
      cpu.regs.a = 0x30;
      cpu.regs.c = 0x10;
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x99], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x1F);
    });

    it('0xA1 AND C', () => {
      cpu.regs.a = 0xFF;
      cpu.regs.c = 0x0F;
      (cpu as any).mem.cart.rom.set([0xA1], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x0F);
      expect(cpu.regs.H).toBe(true);
    });

    it('0xA9 XOR C', () => {
      cpu.regs.a = 0xFF;
      cpu.regs.c = 0x0F;
      (cpu as any).mem.cart.rom.set([0xA9], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xF0);
    });

    it('0xB1 OR C', () => {
      cpu.regs.a = 0xF0;
      cpu.regs.c = 0x0F;
      (cpu as any).mem.cart.rom.set([0xB1], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0xFF);
    });

    it('0xB9 CP C', () => {
      cpu.regs.a = 0x10;
      cpu.regs.c = 0x10;
      (cpu as any).mem.cart.rom.set([0xB9], 0);
      cpu.cpu_step();
      expect(cpu.regs.Z).toBe(true);
    });
  });

  describe('Remaining 8-bit Loads (Register to Register)', () => {
    // LD B, r
    it('0x40 LD B, B', () => { cpu.regs.b = 0x10; (cpu as any).mem.cart.rom.set([0x40], 0); cpu.cpu_step(); expect(cpu.regs.b).toBe(0x10); });
    it('0x42 LD B, D', () => { cpu.regs.d = 0x20; (cpu as any).mem.cart.rom.set([0x42], 0); cpu.cpu_step(); expect(cpu.regs.b).toBe(0x20); });
    it('0x43 LD B, E', () => { cpu.regs.e = 0x30; (cpu as any).mem.cart.rom.set([0x43], 0); cpu.cpu_step(); expect(cpu.regs.b).toBe(0x30); });
    it('0x44 LD B, H', () => { cpu.regs.h = 0x40; (cpu as any).mem.cart.rom.set([0x44], 0); cpu.cpu_step(); expect(cpu.regs.b).toBe(0x40); });
    it('0x45 LD B, L', () => { cpu.regs.l = 0x50; (cpu as any).mem.cart.rom.set([0x45], 0); cpu.cpu_step(); expect(cpu.regs.b).toBe(0x50); });
    it('0x47 LD B, A', () => { cpu.regs.a = 0x60; (cpu as any).mem.cart.rom.set([0x47], 0); cpu.cpu_step(); expect(cpu.regs.b).toBe(0x60); });

    // LD C, r
    it('0x48 LD C, B', () => { cpu.regs.b = 0x10; (cpu as any).mem.cart.rom.set([0x48], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x10); });
    it('0x49 LD C, C', () => { cpu.regs.c = 0x20; (cpu as any).mem.cart.rom.set([0x49], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x20); });
    it('0x4A LD C, D', () => { cpu.regs.d = 0x30; (cpu as any).mem.cart.rom.set([0x4A], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x30); });
    it('0x4B LD C, E', () => { cpu.regs.e = 0x40; (cpu as any).mem.cart.rom.set([0x4B], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x40); });
    it('0x4C LD C, H', () => { cpu.regs.h = 0x50; (cpu as any).mem.cart.rom.set([0x4C], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x50); });
    it('0x4D LD C, L', () => { cpu.regs.l = 0x60; (cpu as any).mem.cart.rom.set([0x4D], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x60); });
    it('0x4E LD C, (HL)', () => { cpu.regs.hl = 0xC000; (cpu as any).mem.write8(0xC000, 0x70); (cpu as any).mem.cart.rom.set([0x4E], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x70); });

    // LD D, r
    it('0x50 LD D, B', () => { cpu.regs.b = 0x10; (cpu as any).mem.cart.rom.set([0x50], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x10); });
    it('0x51 LD D, C', () => { cpu.regs.c = 0x20; (cpu as any).mem.cart.rom.set([0x51], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x20); });
    it('0x52 LD D, D', () => { cpu.regs.d = 0x30; (cpu as any).mem.cart.rom.set([0x52], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x30); });
    it('0x53 LD D, E', () => { cpu.regs.e = 0x40; (cpu as any).mem.cart.rom.set([0x53], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x40); });
    it('0x54 LD D, H', () => { cpu.regs.h = 0x50; (cpu as any).mem.cart.rom.set([0x54], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x50); });
    it('0x55 LD D, L', () => { cpu.regs.l = 0x60; (cpu as any).mem.cart.rom.set([0x55], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x60); });
    it('0x56 LD D, (HL)', () => { cpu.regs.hl = 0xC000; (cpu as any).mem.write8(0xC000, 0x70); (cpu as any).mem.cart.rom.set([0x56], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x70); });
    it('0x57 LD D, A', () => { cpu.regs.a = 0x80; (cpu as any).mem.cart.rom.set([0x57], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x80); });

    // LD E, r
    it('0x58 LD E, B', () => { cpu.regs.b = 0x10; (cpu as any).mem.cart.rom.set([0x58], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x10); });
    it('0x59 LD E, C', () => { cpu.regs.c = 0x20; (cpu as any).mem.cart.rom.set([0x59], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x20); });
    it('0x5A LD E, D', () => { cpu.regs.d = 0x30; (cpu as any).mem.cart.rom.set([0x5A], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x30); });
    it('0x5B LD E, E', () => { cpu.regs.e = 0x40; (cpu as any).mem.cart.rom.set([0x5B], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x40); });
    it('0x5C LD E, H', () => { cpu.regs.h = 0x50; (cpu as any).mem.cart.rom.set([0x5C], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x50); });
    it('0x5D LD E, L', () => { cpu.regs.l = 0x60; (cpu as any).mem.cart.rom.set([0x5D], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x60); });
    it('0x5E LD E, (HL)', () => { cpu.regs.hl = 0xC000; (cpu as any).mem.write8(0xC000, 0x70); (cpu as any).mem.cart.rom.set([0x5E], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x70); });
    it('0x5F LD E, A', () => { cpu.regs.a = 0x80; (cpu as any).mem.cart.rom.set([0x5F], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x80); });

    // LD H, r
    it('0x60 LD H, B', () => { cpu.regs.b = 0x10; (cpu as any).mem.cart.rom.set([0x60], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x10); });
    it('0x61 LD H, C', () => { cpu.regs.c = 0x20; (cpu as any).mem.cart.rom.set([0x61], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x20); });
    it('0x62 LD H, D', () => { cpu.regs.d = 0x30; (cpu as any).mem.cart.rom.set([0x62], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x30); });
    it('0x63 LD H, E', () => { cpu.regs.e = 0x40; (cpu as any).mem.cart.rom.set([0x63], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x40); });
    it('0x64 LD H, H', () => { cpu.regs.h = 0x50; (cpu as any).mem.cart.rom.set([0x64], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x50); });
    it('0x65 LD H, L', () => { cpu.regs.l = 0x60; (cpu as any).mem.cart.rom.set([0x65], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x60); });
    it('0x66 LD H, (HL)', () => { cpu.regs.hl = 0xC000; (cpu as any).mem.write8(0xC000, 0x70); (cpu as any).mem.cart.rom.set([0x66], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x70); });
    it('0x67 LD H, A', () => { cpu.regs.a = 0x80; (cpu as any).mem.cart.rom.set([0x67], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x80); });

    // LD L, r
    it('0x68 LD L, B', () => { cpu.regs.b = 0x10; (cpu as any).mem.cart.rom.set([0x68], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x10); });
    it('0x69 LD L, C', () => { cpu.regs.c = 0x20; (cpu as any).mem.cart.rom.set([0x69], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x20); });
    it('0x6A LD L, D', () => { cpu.regs.d = 0x30; (cpu as any).mem.cart.rom.set([0x6A], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x30); });
    it('0x6B LD L, E', () => { cpu.regs.e = 0x40; (cpu as any).mem.cart.rom.set([0x6B], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x40); });
    it('0x6C LD L, H', () => { cpu.regs.h = 0x50; (cpu as any).mem.cart.rom.set([0x6C], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x50); });
    it('0x6D LD L, L', () => { cpu.regs.l = 0x60; (cpu as any).mem.cart.rom.set([0x6D], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x60); });
    it('0x6E LD L, (HL)', () => { cpu.regs.hl = 0xC000; (cpu as any).mem.write8(0xC000, 0x70); (cpu as any).mem.cart.rom.set([0x6E], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x70); });
    it('0x6F LD L, A', () => { cpu.regs.a = 0x80; (cpu as any).mem.cart.rom.set([0x6F], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x80); });

    // LD (HL), r
    it('0x71 LD (HL), C', () => { cpu.regs.hl = 0xC000; cpu.regs.c = 0x20; (cpu as any).mem.cart.rom.set([0x71], 0); cpu.cpu_step(); expect((cpu as any).mem.read8(0xC000)).toBe(0x20); });
    it('0x72 LD (HL), D', () => { cpu.regs.hl = 0xC000; cpu.regs.d = 0x30; (cpu as any).mem.cart.rom.set([0x72], 0); cpu.cpu_step(); expect((cpu as any).mem.read8(0xC000)).toBe(0x30); });
    it('0x73 LD (HL), E', () => { cpu.regs.hl = 0xC000; cpu.regs.e = 0x40; (cpu as any).mem.cart.rom.set([0x73], 0); cpu.cpu_step(); expect((cpu as any).mem.read8(0xC000)).toBe(0x40); });
    it('0x74 LD (HL), H', () => { cpu.regs.hl = 0xC000; cpu.regs.h = 0xC0; (cpu as any).mem.cart.rom.set([0x74], 0); cpu.cpu_step(); expect((cpu as any).mem.read8(0xC000)).toBe(0xC0); });
    it('0x75 LD (HL), L', () => { cpu.regs.hl = 0xC000; cpu.regs.l = 0x00; (cpu as any).mem.cart.rom.set([0x75], 0); cpu.cpu_step(); expect((cpu as any).mem.read8(0xC000)).toBe(0x00); });

    // LD A, r
    it('0x7A LD A, D', () => { cpu.regs.d = 0x30; (cpu as any).mem.cart.rom.set([0x7A], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x30); });
    it('0x7B LD A, E', () => { cpu.regs.e = 0x40; (cpu as any).mem.cart.rom.set([0x7B], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x40); });
    it('0x7C LD A, H', () => { cpu.regs.h = 0x50; (cpu as any).mem.cart.rom.set([0x7C], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x50); });
    it('0x7D LD A, L', () => { cpu.regs.l = 0x60; (cpu as any).mem.cart.rom.set([0x7D], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x60); });
  });

  describe('Remaining 8-bit Arithmetic (INC/DEC)', () => {
    // INC r
    it('0x0C INC C', () => { cpu.regs.c = 0x10; (cpu as any).mem.cart.rom.set([0x0C], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x11); });
    it('0x14 INC D', () => { cpu.regs.d = 0x20; (cpu as any).mem.cart.rom.set([0x14], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x21); });
    it('0x1C INC E', () => { cpu.regs.e = 0x30; (cpu as any).mem.cart.rom.set([0x1C], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x31); });
    it('0x24 INC H', () => { cpu.regs.h = 0x40; (cpu as any).mem.cart.rom.set([0x24], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x41); });
    it('0x2C INC L', () => { cpu.regs.l = 0x50; (cpu as any).mem.cart.rom.set([0x2C], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x51); });
    it('0x3C INC A', () => { cpu.regs.a = 0x60; (cpu as any).mem.cart.rom.set([0x3C], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x61); });

    // DEC r
    it('0x0D DEC C', () => { cpu.regs.c = 0x10; (cpu as any).mem.cart.rom.set([0x0D], 0); cpu.cpu_step(); expect(cpu.regs.c).toBe(0x0F); });
    it('0x15 DEC D', () => { cpu.regs.d = 0x20; (cpu as any).mem.cart.rom.set([0x15], 0); cpu.cpu_step(); expect(cpu.regs.d).toBe(0x1F); });
    it('0x1D DEC E', () => { cpu.regs.e = 0x30; (cpu as any).mem.cart.rom.set([0x1D], 0); cpu.cpu_step(); expect(cpu.regs.e).toBe(0x2F); });
    it('0x25 DEC H', () => { cpu.regs.h = 0x40; (cpu as any).mem.cart.rom.set([0x25], 0); cpu.cpu_step(); expect(cpu.regs.h).toBe(0x3F); });
    it('0x2D DEC L', () => { cpu.regs.l = 0x50; (cpu as any).mem.cart.rom.set([0x2D], 0); cpu.cpu_step(); expect(cpu.regs.l).toBe(0x4F); });
    it('0x3D DEC A', () => { cpu.regs.a = 0x60; (cpu as any).mem.cart.rom.set([0x3D], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x5F); });
  });

  describe('Remaining ALU Operations', () => {
    // ADD A, r
    it('0x81 ADD A, C', () => { cpu.regs.a = 1; cpu.regs.c = 2; (cpu as any).mem.cart.rom.set([0x81], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(3); });
    it('0x82 ADD A, D', () => { cpu.regs.a = 1; cpu.regs.d = 2; (cpu as any).mem.cart.rom.set([0x82], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(3); });
    it('0x83 ADD A, E', () => { cpu.regs.a = 1; cpu.regs.e = 2; (cpu as any).mem.cart.rom.set([0x83], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(3); });
    it('0x84 ADD A, H', () => { cpu.regs.a = 1; cpu.regs.h = 2; (cpu as any).mem.cart.rom.set([0x84], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(3); });
    it('0x85 ADD A, L', () => { cpu.regs.a = 1; cpu.regs.l = 2; (cpu as any).mem.cart.rom.set([0x85], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(3); });
    it('0x86 ADD A, (HL)', () => { cpu.regs.a = 1; cpu.regs.hl = 0xC000; (cpu as any).mem.write8(0xC000, 2); (cpu as any).mem.cart.rom.set([0x86], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(3); });

    // ADC A, r
    it('0x8A ADC A, D', () => { cpu.regs.a = 1; cpu.regs.d = 2; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x8A], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(4); });
    it('0x8B ADC A, E', () => { cpu.regs.a = 1; cpu.regs.e = 2; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x8B], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(4); });
    it('0x8C ADC A, H', () => { cpu.regs.a = 1; cpu.regs.h = 2; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x8C], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(4); });
    it('0x8D ADC A, L', () => { cpu.regs.a = 1; cpu.regs.l = 2; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x8D], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(4); });

    // SUB r
    it('0x91 SUB C', () => { cpu.regs.a = 3; cpu.regs.c = 1; (cpu as any).mem.cart.rom.set([0x91], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(2); });
    it('0x92 SUB D', () => { cpu.regs.a = 3; cpu.regs.d = 1; (cpu as any).mem.cart.rom.set([0x92], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(2); });
    it('0x93 SUB E', () => { cpu.regs.a = 3; cpu.regs.e = 1; (cpu as any).mem.cart.rom.set([0x93], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(2); });
    it('0x94 SUB H', () => { cpu.regs.a = 3; cpu.regs.h = 1; (cpu as any).mem.cart.rom.set([0x94], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(2); });
    it('0x95 SUB L', () => { cpu.regs.a = 3; cpu.regs.l = 1; (cpu as any).mem.cart.rom.set([0x95], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(2); });
    it('0x96 SUB (HL)', () => { cpu.regs.a = 3; cpu.regs.hl = 0xC000; (cpu as any).mem.write8(0xC000, 1); (cpu as any).mem.cart.rom.set([0x96], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(2); });
    it('0x97 SUB A', () => { cpu.regs.a = 3; (cpu as any).mem.cart.rom.set([0x97], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0); });

    // SBC A, r
    it('0x9A SBC A, D', () => { cpu.regs.a = 3; cpu.regs.d = 1; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x9A], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(1); });
    it('0x9B SBC A, E', () => { cpu.regs.a = 3; cpu.regs.e = 1; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x9B], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(1); });
    it('0x9C SBC A, H', () => { cpu.regs.a = 3; cpu.regs.h = 1; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x9C], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(1); });
    it('0x9D SBC A, L', () => { cpu.regs.a = 3; cpu.regs.l = 1; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x9D], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(1); });
    it('0x9F SBC A, A', () => { cpu.regs.a = 3; cpu.regs.C = true; (cpu as any).mem.cart.rom.set([0x9F], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xFF); });

    // AND r
    it('0xA2 AND D', () => { cpu.regs.a = 0xFF; cpu.regs.d = 0x0F; (cpu as any).mem.cart.rom.set([0xA2], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x0F); });
    it('0xA3 AND E', () => { cpu.regs.a = 0xFF; cpu.regs.e = 0x0F; (cpu as any).mem.cart.rom.set([0xA3], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x0F); });
    it('0xA4 AND H', () => { cpu.regs.a = 0xFF; cpu.regs.h = 0x0F; (cpu as any).mem.cart.rom.set([0xA4], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x0F); });
    it('0xA5 AND L', () => { cpu.regs.a = 0xFF; cpu.regs.l = 0x0F; (cpu as any).mem.cart.rom.set([0xA5], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x0F); });
    it('0xA7 AND A', () => { cpu.regs.a = 0x0F; (cpu as any).mem.cart.rom.set([0xA7], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x0F); });

    // XOR r
    it('0xAA XOR D', () => { cpu.regs.a = 0xFF; cpu.regs.d = 0x0F; (cpu as any).mem.cart.rom.set([0xAA], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xF0); });
    it('0xAB XOR E', () => { cpu.regs.a = 0xFF; cpu.regs.e = 0x0F; (cpu as any).mem.cart.rom.set([0xAB], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xF0); });
    it('0xAC XOR H', () => { cpu.regs.a = 0xFF; cpu.regs.h = 0x0F; (cpu as any).mem.cart.rom.set([0xAC], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xF0); });
    it('0xAD XOR L', () => { cpu.regs.a = 0xFF; cpu.regs.l = 0x0F; (cpu as any).mem.cart.rom.set([0xAD], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xF0); });
    it('0xAF XOR A', () => { cpu.regs.a = 0xFF; (cpu as any).mem.cart.rom.set([0xAF], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0x00); });

    // OR r
    it('0xB2 OR D', () => { cpu.regs.a = 0xF0; cpu.regs.d = 0x0F; (cpu as any).mem.cart.rom.set([0xB2], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xFF); });
    it('0xB3 OR E', () => { cpu.regs.a = 0xF0; cpu.regs.e = 0x0F; (cpu as any).mem.cart.rom.set([0xB3], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xFF); });
    it('0xB4 OR H', () => { cpu.regs.a = 0xF0; cpu.regs.h = 0x0F; (cpu as any).mem.cart.rom.set([0xB4], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xFF); });
    it('0xB5 OR L', () => { cpu.regs.a = 0xF0; cpu.regs.l = 0x0F; (cpu as any).mem.cart.rom.set([0xB5], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xFF); });
    it('0xB7 OR A', () => { cpu.regs.a = 0xF0; (cpu as any).mem.cart.rom.set([0xB7], 0); cpu.cpu_step(); expect(cpu.regs.a).toBe(0xF0); });

    // CP r
    it('0xBA CP D', () => { cpu.regs.a = 0x10; cpu.regs.d = 0x10; (cpu as any).mem.cart.rom.set([0xBA], 0); cpu.cpu_step(); expect(cpu.regs.Z).toBe(true); });
    it('0xBB CP E', () => { cpu.regs.a = 0x10; cpu.regs.e = 0x10; (cpu as any).mem.cart.rom.set([0xBB], 0); cpu.cpu_step(); expect(cpu.regs.Z).toBe(true); });
    it('0xBC CP H', () => { cpu.regs.a = 0x10; cpu.regs.h = 0x10; (cpu as any).mem.cart.rom.set([0xBC], 0); cpu.cpu_step(); expect(cpu.regs.Z).toBe(true); });
    it('0xBD CP L', () => { cpu.regs.a = 0x10; cpu.regs.l = 0x10; (cpu as any).mem.cart.rom.set([0xBD], 0); cpu.cpu_step(); expect(cpu.regs.Z).toBe(true); });
    it('0xBF CP A', () => { cpu.regs.a = 0x10; (cpu as any).mem.cart.rom.set([0xBF], 0); cpu.cpu_step(); expect(cpu.regs.Z).toBe(true); });
  });

  describe('Missing Instructions', () => {
    it('0x3E LD A, d8', () => {
      (cpu as any).mem.cart.rom.set([0x3E, 0x77], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x77);
    });
    it('0x23 INC HL', () => {
      cpu.regs.hl = 0xFFFF;
      (cpu as any).mem.cart.rom.set([0x23], 0);
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0x0000);
    });
    it('0x2B DEC HL', () => {
      cpu.regs.hl = 0x0000;
      (cpu as any).mem.cart.rom.set([0x2B], 0);
      cpu.cpu_step();
      expect(cpu.regs.hl).toBe(0xFFFF);
    });
    it('0x8F ADC A, A', () => {
      cpu.regs.a = 0x10;
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0x8F], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x21);
    });
    it('0xD6 SUB d8', () => {
      cpu.regs.a = 0x30;
      (cpu as any).mem.cart.rom.set([0xD6, 0x10], 0);
      cpu.cpu_step();
      expect(cpu.regs.a).toBe(0x20);
      expect(cpu.regs.N).toBe(true);
    });
    it('0xD3 Invalid (NOP)', () => {
      (cpu as any).mem.cart.rom.set([0xD3], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(1);
    });
  });

  describe('Conditional Branching (Not Taken)', () => {
    it('0x20 JR NZ, r8 (Not Taken)', () => {
      cpu.regs.Z = true;
      (cpu as any).mem.cart.rom.set([0x20, 0x05], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2);
    });
    it('0x28 JR Z, r8 (Not Taken)', () => {
      cpu.regs.Z = false;
      (cpu as any).mem.cart.rom.set([0x28, 0x05], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2);
    });
    it('0x38 JR C, r8 (Not Taken)', () => {
      cpu.regs.C = false;
      (cpu as any).mem.cart.rom.set([0x38, 0x05], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(2);
    });

    it('0xC2 JP NZ, a16 (Not Taken)', () => {
      cpu.regs.Z = true;
      (cpu as any).mem.cart.rom.set([0xC2, 0x00, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(3);
    });
    it('0xCA JP Z, a16 (Not Taken)', () => {
      cpu.regs.Z = false;
      (cpu as any).mem.cart.rom.set([0xCA, 0x00, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(3);
    });
    it('0xD2 JP NC, a16 (Not Taken)', () => {
      cpu.regs.C = true;
      (cpu as any).mem.cart.rom.set([0xD2, 0x00, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(3);
    });
    it('0xDA JP C, a16 (Not Taken)', () => {
      cpu.regs.C = false;
      (cpu as any).mem.cart.rom.set([0xDA, 0x00, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(3);
    });

    it('0xC4 CALL NZ, a16 (Not Taken)', () => {
      cpu.regs.Z = true;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xC4, 0x50, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(3);
      expect(cpu.regs.sp).toBe(0xFFFE);
    });
    it('0xCC CALL Z, a16 (Not Taken)', () => {
      cpu.regs.Z = false;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xCC, 0x50, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(3);
      expect(cpu.regs.sp).toBe(0xFFFE);
    });
    it('0xD4 CALL NC, a16 (Not Taken)', () => {
      cpu.regs.C = true;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xD4, 0x50, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(3);
      expect(cpu.regs.sp).toBe(0xFFFE);
    });
    it('0xDC CALL C, a16 (Not Taken)', () => {
      cpu.regs.C = false;
      cpu.regs.sp = 0xFFFE;
      (cpu as any).mem.cart.rom.set([0xDC, 0x50, 0x50], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(3);
      expect(cpu.regs.sp).toBe(0xFFFE);
    });

    it('0xC0 RET NZ (Not Taken)', () => {
      cpu.regs.Z = true;
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      (cpu as any).mem.cart.rom.set([0xC0], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(1);
      expect(cpu.regs.sp).toBe(0xFFFC);
    });
    it('0xC8 RET Z (Not Taken)', () => {
      cpu.regs.Z = false;
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      (cpu as any).mem.cart.rom.set([0xC8], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(1);
      expect(cpu.regs.sp).toBe(0xFFFC);
    });
    it('0xD0 RET NC (Not Taken)', () => {
      cpu.regs.C = true;
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      (cpu as any).mem.cart.rom.set([0xD0], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(1);
      expect(cpu.regs.sp).toBe(0xFFFC);
    });
    it('0xD8 RET C (Not Taken)', () => {
      cpu.regs.C = false;
      cpu.regs.sp = 0xFFFC;
      (cpu as any).mem.write16(0xFFFC, 0x1234);
      (cpu as any).mem.cart.rom.set([0xD8], 0);
      cpu.cpu_step();
      expect(cpu.regs.pc).toBe(1);
      expect(cpu.regs.sp).toBe(0xFFFC);
    });
  });
});


// describe("instructions", () => {
//   const romName = `dmg-acid2`
//   const context = new Emu()

//   beforeAll(() => {
//     context.insertCart(romName)
//   })


//   it("should run", () => {

//   })
// })



// describe("cart tetris tests", () => {
//   const cart: Cartridge = new Cartridge()

//   it("should initialize cart with file name", async () => {
//     await cart.initCart("tetris")
//   })

//   it('should read rom title', async () => {
//     expect(cart.title).to.eq("TETRIS")
//   });

//   it('should read manufacture code', async () => {
//     expect(cart.manufactureCode).to.eq('')
//   });

//   it('should read CFG code', async () => {
//     expect(cart.CGBFlag).to.eq(0)
//   });

//   it("should get cartridge type", () => {
//     expect(cart.cartridgeType).to.eq(0)
//   })

//   it("should get rom size", () => {
//     expect(cart.cartridgeType).to.eq(0)
//   })



// })
