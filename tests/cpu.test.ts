import { Cartridge } from '@/cart'
import { beforeAll, describe, expect, it, test } from 'vitest'
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


