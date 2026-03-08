import { Bus } from "@/bus";
import { u16, u8 } from "@/common";
import { CPU } from "@/cpu";
import { Regs, RegType } from "@/entities/regs";
import { IntUtils } from "@/utils/int_utils";


export class LoadProcesses {

    constructor(private regs: Regs, private mem: Bus, private cpu: CPU) {

    }
    public process_ld_r8_r8 = (destReg: RegType, targetReg: RegType): boolean => {
        this.regs[destReg] = this.regs[targetReg]
        return true
    }

    public process_ld_r16_r16 = (destReg: RegType, targetReg: RegType): boolean => {
        this.regs[destReg] = this.regs[targetReg]
        return true
    }

    public process_ld_r8_d8 = (destReg: RegType): boolean => {
        this.regs[destReg] = this.cpu.fetch()
        return true
    }


    public process_ld_16r_d16 = (destReg: RegType): boolean => {
        this.regs[destReg] = this.cpu.fetch16bit()
        return true
    }


    public process_ld_mr_r8 = (destReg: RegType, targetReg: RegType): boolean => {
        this.mem.write8(this.regs[destReg], this.regs[targetReg])


        return true
    }

    public process_ld_hl_ra = (inc: boolean): boolean => {
        const a = this.regs.a;
        const hl = this.regs.hl;

        this.mem.write8(hl, a);
        this.regs.hl = inc ? this.regs.hl + 1 : this.regs.hl - 1

        return true
    }


    public process_ld_a16_sp = (): boolean => {
        const addr = this.cpu.fetch16bit();
        const sp = this.regs.sp;

        this.mem.write16(addr, sp);


        return true
    }

    public process_ld_a16_ra = (): boolean => {
        const addr = this.cpu.fetch16bit();
        const a = this.regs.a;

        this.mem.write8(addr, a);


        return true
    }

    public process_ld_ra_a16 = (): boolean => {
        const addr = this.cpu.fetch16bit();
        this.regs.a = this.mem.read8(addr);


        return true
    }



    public process_ld_r8_mr = (destReg: RegType, targetReg: RegType): boolean => {
        const targetVal = this.mem.read8(this.regs[targetReg])
        this.regs[destReg] = targetVal;

        return true
    }

    public process_ld_ra_hl = (inc: boolean): boolean => {
        const hl = this.regs.hl;

        const hlVal = this.mem.read8(hl);
        this.regs.a = hlVal

        this.regs.hl = inc ? this.regs.hl + 1 : this.regs.hl - 1

        return true
    }


    public process_ld_HL_SPR = (): boolean => {
        const unsigned8 = this.cpu.fetch();
        const signed8 = IntUtils.toSigned(unsigned8)

        this.regs.hl = IntUtils.toU16((this.regs.sp + signed8))
        this.regs.Z = false
        this.regs.N = false

        this.regs.H = ((this.regs.sp & 0xF) + (unsigned8 & 0xF)) > 0xF
        this.regs.C = ((this.regs.sp & 0xFF) + (unsigned8 & 0xFF)) > 0xFF

        return true
    }


    public process_ld_mrc_ra = (): boolean => {
        const addr = 0xFF00 + this.regs.c
        const a = this.regs.a

        this.mem.write8(addr, a);

        return true
    }


    public process_ld_ra_mrc = (): boolean => {
        const addr = 0xFF00 + this.regs.c

        this.regs.a = this.mem.read8(addr);


        return true
    }



    public process_pop_r16 = (regType: RegType): boolean => {
        this.regs[regType] = this.mem.read16(this.regs.sp)
        this.regs.sp += 2

        return true
    }

    public process_push_r16 = (regType: RegType): boolean => {
        //todo: maybe optimize?
        this.regs.sp -= 2;
        this.mem.write16(this.regs.sp, this.regs[regType])

        return true
    }


    // LDH (a8), A   → [0xFF00 + a8] = A
    public process_ldh_a8_ra = (): boolean => {
        const offset = this.cpu.fetch();          // read immediate 8-bit value
        const addr = 0xFF00 + offset;                 // build IO address
        this.mem.write8(addr, this.regs.a);           // store A into [0xFF00 + a8]
        return true;
    };

    // LDH A, (a8)   → A = [0xFF00 + a8]
    public process_ldh_ra_a8 = (): boolean => {
        const offset = this.cpu.fetch();          // read immediate 8-bit value
        const addr = 0xFF00 + offset;                 // build IO address
        this.regs.a = this.mem.read8(addr);           // load from [0xFF00 + a8] into A
        return true;
    };


    public process_ld_hl_d8 = (): boolean => {
        const immediate = this.cpu.fetch();
        const hl = this.regs.hl;

        this.mem.write8(hl, immediate);
        
        return true;
    }

}
