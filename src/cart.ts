


export interface RomHeader {
  entry: Uint8Array;          // 4 bytes
  logo: Uint8Array;           // 0x30 = 48 bytes

  title: string;              // 16 bytes ASCII
  newLicCode: number;         // u16
  sgbFlag: number;            // u8
  type: number;               // u8
  romSize: number;            // u8
  ramSize: number;            // u8
  destCode: number;           // u8
  licCode: number;            // u8
  version: number;            // u8
  checksum: number;           // u8
  globalChecksum: number;     // u16
}


export class Cartridge {

  public rom: Uint8Array
  rom_header: RomHeader
  romBank: number = 1;

  private async loadROM(pathOrFile: string | File): Promise<Uint8Array> {
    if (typeof pathOrFile === 'string') {
      // Node.js
      const { readFile } = await import("fs/promises");
      const path = await import("node:path");
      const romPath = path.resolve(__dirname, `../public/roms/${pathOrFile}.gb`);
      const buffer = await readFile(romPath as string);
      return new Uint8Array(buffer);
    } else {
      // Browser
      const file = pathOrFile as File;
      const arrayBuffer = await file.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
  }


  async initCart(pathOrFile: string | File) {
    this.rom = await this.loadROM(pathOrFile);
    const view = new DataView(this.rom.buffer);
    const base = 0x0100; // ROM header base address

    const entry = this.rom.slice(base, base + 4);
    const logo = this.rom.slice(base + 4, base + 0x34);

    const titleBytes = this.rom.slice(base + 0x34, base + 0x44);
    const title = new TextDecoder().decode(titleBytes).replace(/\0/g, '');

    const newLicCode = view.getUint16(base + 0x44, true); // Little Endian
    const sgbFlag = view.getUint8(base + 0x46);
    const type = view.getUint8(base + 0x47);
    const romSize = view.getUint8(base + 0x48);
    const ramSize = view.getUint8(base + 0x49);
    const destCode = view.getUint8(base + 0x4A);
    const licCode = view.getUint8(base + 0x4B);
    const version = view.getUint8(base + 0x4C);
    const checksum = view.getUint8(base + 0x4D);
    const globalChecksum = view.getUint16(base + 0x4E, false); // Big Endian

    const rHeader: RomHeader = {
      entry,
      logo,
      title,
      newLicCode,
      sgbFlag,
      type,
      romSize,
      ramSize,
      destCode,
      licCode,
      version,
      checksum,
      globalChecksum
    };

    this.rom_header = rHeader

  }

  getBytes = (start: number, end: number) => {
    return this.rom.slice(start, end);
  }

  read(address: number): number {
    return this.rom[address];
    // ROM Bank 0 (Fixed at 0x0000 - 0x3FFF)
    if (address < 0x4000) {
      return this.rom[address];
    }

    // ROM Bank N (Switchable at 0x4000 - 0x7FFF)
    // We calculate the offset inside the bank (address - 0x4000)
    // And add it to the start of the selected bank (this.romBank * 16KB)
    return this.rom[(address - 0x4000) + (this.romBank * 0x4000)];
  }

  write(address: number, value: number) {
    // Writing to ROM addresses (0x0000-0x7FFF) is used to control the MBC (Memory Bank Controller).
    // It does NOT change the content of the ROM.
    // For now, we ignore these writes to allow games to run without crashing.
    // TODO: Implement MBC logic (switching banks, enabling RAM, etc.)
    // MBC1 Implementation (Basic ROM Banking)
    // Writing to 0x2000 - 0x3FFF selects the lower 5 bits of the ROM Bank Number
    if (address >= 0x2000 && address <= 0x3FFF) {
      let bank = value & 0x1F; // Mask to 5 bits
      if (bank === 0) {
        bank = 1; // MBC1 translates bank 0 to bank 1
      }
      this.romBank = bank;
      // Note: Full MBC1 implementation would handle upper bits in 0x4000-0x5FFF
    }
  }

  // Read ASCII string from a byte range
  convertToAsci(bytes: Uint8Array<ArrayBuffer>): string {
    return new TextDecoder().decode(bytes).replace(/\0/g, "").trim();
  }
  convertToAsciIncludeZero(bytes: Uint8Array<ArrayBuffer>): string {
    return new TextDecoder("ascii").decode(bytes);
  }

  convertByteToAsci(byte: number) {
    byte.toString(16).toUpperCase().padStart(2, "0");
  }

  // Read a single byte and return as hex string (e.g. "3F")
  readHex(address: number): string {
    return this.read(address).toString(16).toUpperCase().padStart(2, "0");
  }

  // Read a range of bytes and return array of hex strings
  readHexRange(start: number, end: number): string[] {
    return [...this.getBytes(start, end)].map(b => b.toString(16).toUpperCase().padStart(2, "0"));
  }

  toLittleEndianNumber(bytes: Uint8Array): number {
    return bytes.reduceRight((acc, byte) => (acc << 8) | byte, 0);
  }

  verifyChecksum(): boolean {
    let x = 0;
    for (let i = 0x0134; i <= 0x014C; i++) {
      x = x - this.rom[i] - 1;
    }

    return (x & 0xFF) === this.rom_header.checksum
  }

}