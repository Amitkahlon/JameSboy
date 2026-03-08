import { Cartridge } from '@/cart'
import { describe, expect, it } from 'vitest'
import { romTypeName } from '@/entities/rom_typs';
import { licCodeeName } from '@/entities/lic_codes';

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