import { Bus } from "@/bus";
import { u16, u8 } from "@/common";
import { CPU } from "@/cpu";
import { Regs, RegType } from "@/entities/regs";
import { IntUtils } from "@/utils/int_utils";

export class ArithmeticProcesses {
    constructor(private regs: Regs, private mem: Bus, private cpu: CPU) {

    }


    public process_inc_r8 = (regTarget: RegType): boolean => {
        const oldVal = this.regs[regTarget]
        this.regs[regTarget] = IntUtils.toU8(this.regs[regTarget] + 1)

        this.regs.Z = this.regs[regTarget] === 0
        this.regs.N = false
        this.regs.H = IntUtils.hasHalfCarry8(oldVal, 1)

        return true
    }

    public process_inc_r16 = (regTarget: RegType): boolean => {
        this.regs[regTarget] = IntUtils.toU16(this.regs[regTarget] + 1)

        return true
    }

    public process_inc_mr = (): boolean => {
        const memDest = this.regs.hl
        const destVal = this.mem.read8(memDest);          // <- use your actual memory read
        const result = IntUtils.toU8(destVal + 1);

        this.regs.Z = result === 0;
        this.regs.N = false;
        this.regs.H = IntUtils.hasHalfCarry8(destVal, 1)

        this.mem.write8(memDest, result)

        return true;
    }

    public process_dec_r8 = (regTarget: RegType): boolean => {
        const oldVal = this.regs[regTarget]
        this.regs[regTarget] = IntUtils.toU8(this.regs[regTarget] - 1)

        this.regs.Z = this.regs[regTarget] === 0
        this.regs.N = true
        this.regs.H = IntUtils.halfBorrowSub8(oldVal, 1)

        return true
    }

    public process_dec_r16 = (regTarget: RegType): boolean => {
        this.regs[regTarget] = IntUtils.toU16(this.regs[regTarget] - 1)

        return true
    }

    public process_dec_mr = (): boolean => {
        const memDest = this.regs.hl
        const orig = this.mem.read8(memDest);
        const result = IntUtils.toU8(orig - 1);

        this.regs.Z = result === 0;
        this.regs.N = true;
        this.regs.H = IntUtils.hasBorrow8(orig, 1)

        this.mem.write8(memDest, result)

        return true;
    }

    public process_add_8r_8r = (regDest: RegType, regTarget: RegType): boolean => {
        const destVal = this.regs[regDest];
        const targetVal = this.regs[regTarget]

        const newVal = destVal + targetVal
        this.regs[regDest] = IntUtils.toU8(newVal);

        this.regs.Z = this.regs[regDest] === 0
        this.regs.N = false
        this.regs.H = IntUtils.hasHalfCarry8(destVal, targetVal)
        this.regs.C = IntUtils.hasCarry8(destVal, targetVal);

        return true
    }

    public process_add_16r_16r = (regDest: RegType, regTarget: RegType): boolean => {
        const destVal = this.regs[regDest];
        const targetVal = this.regs[regTarget]

        const newVal = destVal + targetVal
        this.regs[regDest] = IntUtils.toU16(newVal);

        this.regs.N = false

        this.regs.H = ((destVal & 0x0FFF) + (targetVal & 0x0FFF)) > 0x0FFF
        this.regs.C = destVal + targetVal > 0xFFFF;

        return true
    }

    public process_add_r8_mr = (): boolean => {
        const destVal = this.regs.a
        const targetMemAddr = this.regs.hl
        const targetVal = this.mem.read8(targetMemAddr)

        const newValRaw = targetVal + destVal
        this.regs.hl = IntUtils.toU8(newValRaw);

        this.regs.N = false
        this.regs.H = ((this.regs.hl & 0x0FFF) + (targetVal & 0x0FFF)) > 0x0FFF
        this.regs.C = (this.regs.hl + targetVal) > 0xFFFF

        return true

    }

    public process_add_d8 = (regDest: RegType): boolean => {
        const immediate: u8 = this.cpu.fetch()

        const old = this.regs[regDest];
        const newRaw = old + immediate;
        this.regs[regDest] = IntUtils.toU8(newRaw);

        this.regs.Z = this.regs[regDest] === 0
        this.regs.N = false
        this.regs.H = IntUtils.hasHalfCarry8(old, immediate)
        this.regs.C = IntUtils.hasCarry8(old, immediate);

        return true;
    }

    public process_add_sp_sd8 = (): boolean => {
        const rawByte = this.cpu.fetch()
        const sp = this.regs.sp & 0xFFFF;
        const offset = IntUtils.toSigned(rawByte); // signed int8 -> int32

        this.regs.Z = false;
        this.regs.N = false;
        this.regs.H = ((sp & 0xF) + (rawByte & 0xF)) > 0xF;   // low nibble
        this.regs.C = ((sp & 0xFF) + (rawByte & 0xFF)) > 0xFF;  // low byte

        this.regs.sp = IntUtils.toU16(sp + offset);

        return true
    };

    public process_sub_8r = (regTarget: RegType): boolean => {
        const destVal = this.regs.a;
        const targetVal = this.regs[regTarget];

        this.regs.a = IntUtils.toU8(destVal - targetVal);

        this.regs.Z = this.regs.a === 0
        this.regs.N = true
        this.regs.H = IntUtils.halfBorrowSub8(destVal, targetVal)
        this.regs.C = IntUtils.hasBorrow8(destVal, targetVal);

        return true
    }

    public process_sub_r8_mr = (): boolean => {
        const memTarget = this.regs.hl
        const targetVal = this.mem.read8(memTarget);
        const result = IntUtils.toU8(this.regs.a - targetVal);

        this.regs.Z = result === 0;
        this.regs.N = true;
        this.regs.H = IntUtils.hasBorrow8(this.regs.a, targetVal)

        this.regs.a = result

        return true;
    }




    //ALU Operations


    public process_and_r8 = (targetReg: RegType): boolean => {
        const targetVal = this.regs[targetReg];
        this.regs.a = targetVal & this.regs.a

        this.handle_and_flags()

        return true
    }


    public process_and_hl = (): boolean => {
        const memAddr = this.regs.hl
        const targetVal = this.mem.read8(memAddr)

        this.regs.a = targetVal & this.regs.a

        this.handle_and_flags()

        return true
    }

    public process_and_d8 = (): boolean => {
        const immediate = this.cpu.fetch()
        this.regs.a = this.regs.a & immediate
        this.handle_and_flags()
        return true
    }

    private handle_and_flags = () => {
        this.regs.Z = this.regs.a === 0
        this.regs.N = false
        this.regs.H = true
        this.regs.C = false
    }

    public process_xor_r8 = (targetReg: RegType): boolean => {
        const targetVal = this.regs[targetReg];
        this.regs.a = targetVal ^ this.regs.a

        this.handle_xor_flags()


        return true
    }


    public process_xor_hl = (): boolean => {
        const memAddr = this.regs.hl
        const targetVal = this.mem.read8(memAddr)

        this.regs.a = targetVal ^ this.regs.a

        this.handle_xor_flags()
        return true
    }

    public process_xor_d8 = (): boolean => {
        const immediate = this.cpu.fetch()
        this.regs.a = this.regs.a ^ immediate

        this.handle_xor_flags()
        return true
    }


    private handle_xor_flags = () => {
        this.regs.Z = this.regs.a === 0
        this.regs.N = false
        this.regs.H = false
        this.regs.C = false
    }


    public process_or_r8 = (targetReg: RegType): boolean => {
        const targetVal = this.regs[targetReg];
        this.regs.a = targetVal | this.regs.a

        this.handle_or_flags()

        return true
    }


    public process_or_hl = (): boolean => {
        const memAddr = this.regs.hl
        const targetVal = this.mem.read8(memAddr)

        this.regs.a = targetVal | this.regs.a

        this.handle_or_flags()
        return true
    }

    public process_or_d8 = (): boolean => {
        const immediate = this.cpu.fetch()
        this.regs.a = this.regs.a | immediate

        this.handle_or_flags()
        return true
    }


    private handle_or_flags = () => {
        this.regs.Z = this.regs.a === 0
        this.regs.N = false
        this.regs.H = false
        this.regs.C = false
    }


    // Compare
    public process_cp_r8 = (targetReg: RegType): boolean => {
        const targetVal = this.regs[targetReg];
        const a = this.regs.a;

        this.regs.Z = targetVal === a
        this.regs.N = true
        this.regs.H = IntUtils.halfBorrowSub8(a, targetVal)
        this.regs.C = targetVal > this.regs.a

        return true
    }


    public process_cp_hl = (): boolean => {
        const memAddr = this.regs.hl
        const targetVal = this.mem.read8(memAddr)
        const a = this.regs.a;

        this.regs.Z = targetVal === a
        this.regs.N = true
        this.regs.H = IntUtils.halfBorrowSub8(a, targetVal)
        this.regs.C = targetVal > this.regs.a

        return true
    }

    public process_cp_d8 = (): boolean => {
        const immediate = this.cpu.fetch()
        const a = this.regs.a;

        this.regs.Z = immediate === a
        this.regs.N = true
        this.regs.H = IntUtils.halfBorrowSub8(a, immediate)
        this.regs.C = immediate > this.regs.a

        return true
    }


    // SBC

    public process_sbc_8r_8r = (regDest: RegType, regTarget: RegType): boolean => {
        const destVal = this.regs[regDest];
        const targetVal = this.regs[regTarget];
        const carry = (this.regs.C ? 1 : 0);

        this.regs[destVal] = IntUtils.toU8(destVal - targetVal - carry);

        //todo: maybe fix half borrow
        this.regs.Z = this.regs.a === 0
        this.regs.N = true
        this.regs.H = IntUtils.halfBorrowSub8(destVal, targetVal - carry)
        this.regs.C = destVal < targetVal + carry

        return true
    }

    public process_sbc_ra_mr = (): boolean => {
        const a = this.regs.a
        const memTarget = this.regs.hl
        const targetVal = this.mem.read8(memTarget);
        const carry = (this.regs.C ? 1 : 0);
        const result = IntUtils.toU8(a - targetVal - carry);

        //todo: maybe fix half borrow
        this.regs.Z = result === 0
        this.regs.N = true
        this.regs.H = IntUtils.halfBorrowSub8(a, targetVal - carry)
        this.regs.C = a < targetVal + carry

        this.regs.a = result

        return true;
    }


    public process_sbc_d8 = (): boolean => {
        const immediate = this.cpu.fetch()
        const a = this.regs.a;
        const carry = (this.regs.C ? 1 : 0);
        const raw = a - immediate - carry;
        this.regs.a = IntUtils.toU8(raw);


        this.regs.Z = this.regs.a === 0
        this.regs.N = true
        this.regs.H = IntUtils.halfBorrowSub8(a, immediate - carry)
        this.regs.C = a < immediate + carry

        return true
    }

    //abc

    public process_abc_8r_8r = (regDest: RegType, regTarget: RegType): boolean => {
        const destVal = this.regs[regDest];
        const targetVal = this.regs[regTarget];
        const carry = (this.regs.C ? 1 : 0);

        this.regs[destVal] = IntUtils.toU8(destVal + targetVal + carry);

        //todo: maybe fix half borrow
        this.regs.Z = this.regs.a === 0
        this.regs.N = false
        this.regs.H = IntUtils.hasHalfCarry8(destVal, targetVal + carry)
        this.regs.C = destVal < targetVal + carry

        return true
    }

    public process_abc_ra_mr = (): boolean => {
        const a = this.regs.a
        const memTarget = this.regs.hl
        const targetVal = this.mem.read8(memTarget);
        const carry = (this.regs.C ? 1 : 0);

        this.regs.a = IntUtils.toU8(a + targetVal + carry);

        //todo: maybe fix half borrow
        this.regs.Z = this.regs.a === 0
        this.regs.N = false
        this.regs.H = IntUtils.hasHalfCarry8(a, targetVal + carry)
        this.regs.C = a < targetVal + carry

        return true;
    }


    public process_abc_d8 = (): boolean => {
        const immediate = this.cpu.fetch()
        const a = this.regs.a;
        const carry = (this.regs.C ? 1 : 0);
        this.regs.a = IntUtils.toU8(a + immediate + carry);

        this.regs.Z = this.regs.a === 0
        this.regs.N = false
        this.regs.H = IntUtils.hasHalfCarry8(a, immediate + carry)
        this.regs.C = a < immediate + carry

        return true
    }


    // Rotation/Shifts

    public process_rrca = (): boolean => {
        const a = this.regs.a;

        const carry = a & 0x01;                // bit 0 before rotation
        const rotated = ((a >> 1) | (carry << 7)) & 0xFF;

        this.regs.a = rotated;

        // Flags according to Game Boy spec
        this.regs.Z = false;
        this.regs.N = false;
        this.regs.H = false;
        this.regs.C = carry === 1;

        return true;
    };


    public process_RRA = (): boolean => {
        const oldCarry = this.regs.C ? 1 : 0;
        const newCarry = this.regs.a & 0x01; // bit 0 before rotation

        const rotated = ((this.regs.a >> 1) | (oldCarry << 7)) & 0xFF;
        this.regs.a = rotated;

        this.regs.Z = false;
        this.regs.N = false;
        this.regs.H = false;
        this.regs.C = newCarry === 1;

        return true;
    };

    public process_CPL = (): boolean => {
        this.regs.a = (~this.regs.a) & 0xFF;

        this.regs.N = true;
        this.regs.H = true;


        return true;
    };

    public process_CCF = (): boolean => {
        this.regs.N = false;
        this.regs.H = false;
        this.regs.C = !this.regs.C; // invert carry

        return true;
    };

    public process_RLCA = (): boolean => {
        const a = this.regs.a;
        const carry = (a >> 7) & 0x01; // old bit 7

        const rotated = ((a << 1) | carry) & 0xFF;
        this.regs.a = rotated;

        // Flags
        this.regs.Z = false;
        this.regs.N = false;
        this.regs.H = false;
        this.regs.C = carry === 1;

        return true;
    };

    public process_RLA = (): boolean => {
        const a = this.regs.a;
        const oldCarry = this.regs.C ? 1 : 0;
        const newCarry = (a >> 7) & 0x01;

        const rotated = ((a << 1) | oldCarry) & 0xFF;
        this.regs.a = rotated;

        this.regs.Z = false;
        this.regs.N = false;
        this.regs.H = false;
        this.regs.C = newCarry === 1;

        return true;
    };

    public process_RRCA = (): boolean => {
        const a = this.regs.a;
        const carry = a & 0x01; // old bit 0

        const rotated = ((a >> 1) | (carry << 7)) & 0xFF;
        this.regs.a = rotated;

        this.regs.Z = false;
        this.regs.N = false;
        this.regs.H = false;
        this.regs.C = carry === 1;

        return true;
    };

    public process_SCF = (): boolean => {
        this.regs.N = false;
        this.regs.H = false;
        this.regs.C = true;
        return true;
    };

    public process_DAA = (): boolean => {
        let a = this.regs.a;
        let adjust = 0;
        let carry = this.regs.C;

        if (!this.regs.N) {
            if (this.regs.H || (a & 0x0F) > 0x09) adjust |= 0x06;
            if (this.regs.C || a > 0x99) {
                adjust |= 0x60;
                carry = true;
            }
            a = (a + adjust) & 0xFF;
        } else {
            if (this.regs.H) adjust |= 0x06;
            if (this.regs.C) adjust |= 0x60;
            a = (a - adjust) & 0xFF;
        }

        this.regs.a = a;
        this.regs.Z = a === 0;
        this.regs.H = false;
        this.regs.C = carry;

        return true;
    };






}