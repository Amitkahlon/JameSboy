import { Bus } from "@/bus";
import { CPU } from "@/cpu";
import { Regs, RegType } from "@/entities/regs";

export class CBProcesses {
    constructor(private regs: Regs, private mem: Bus, private cpu: CPU) { }

    // -------------------------
    // Helpers
    // -------------------------
    private u8 = (x: number) => x & 0xFF;

    private setZNH_C(z: boolean, n: boolean, h: boolean, c: boolean) {
        this.regs.Z = z;
        this.regs.N = n;
        this.regs.H = h;
        this.regs.C = c;
    }

    private readHL(): number {
        return this.mem.read8(this.regs.hl);
    }
    private writeHL(v: number): void {
        this.mem.write8(this.regs.hl, this.u8(v));
    }

    // -------------------------
    // RLC: Rotate Left (circular)
    // -------------------------
    // RLC r8
    public process_rlc_r8 = (reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const c = (v >>> 7) & 1;                       // old bit7
        const r = this.u8((v << 1) | c);               // circular
        this.regs[reg] = r;

        // Z set if result is 0 (CB-rotates set Z normally), N=0, H=0, C=old bit7
        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    // RLC (HL)
    public process_rlc_mr = (): boolean => {
        const v = this.readHL();
        const c = (v >>> 7) & 1;
        const r = this.u8((v << 1) | c);
        this.writeHL(r);

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    // -------------------------
    // RRC: Rotate Right (circular)
    // -------------------------
    public process_rrc_r8 = (reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const c = v & 1;                               // old bit0
        const r = this.u8((v >>> 1) | (c << 7));
        this.regs[reg] = r;

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    public process_rrc_mr = (): boolean => {
        const v = this.readHL();
        const c = v & 1;
        const r = this.u8((v >>> 1) | (c << 7));
        this.writeHL(r);

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    // -------------------------
    // RL: Rotate Left through Carry
    // -------------------------
    public process_rl_r8 = (reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const oldC = this.regs.C ? 1 : 0;
        const newC = (v >>> 7) & 1;
        const r = this.u8((v << 1) | oldC);
        this.regs[reg] = r;

        this.setZNH_C(r === 0, false, false, newC === 1);
        return true;
    };

    public process_rl_mr = (): boolean => {
        const v = this.readHL();
        const oldC = this.regs.C ? 1 : 0;
        const newC = (v >>> 7) & 1;
        const r = this.u8((v << 1) | oldC);
        this.writeHL(r);

        this.setZNH_C(r === 0, false, false, newC === 1);
        return true;
    };

    // -------------------------
    // RR: Rotate Right through Carry
    // -------------------------
    public process_rr_r8 = (reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const oldC = this.regs.C ? 1 : 0;
        const newC = v & 1;
        const r = this.u8((v >>> 1) | (oldC << 7));
        this.regs[reg] = r;

        this.setZNH_C(r === 0, false, false, newC === 1);
        return true;
    };

    public process_rr_mr = (): boolean => {
        const v = this.readHL();
        const oldC = this.regs.C ? 1 : 0;
        const newC = v & 1;
        const r = this.u8((v >>> 1) | (oldC << 7));
        this.writeHL(r);

        this.setZNH_C(r === 0, false, false, newC === 1);
        return true;
    };

    // -------------------------
    // SLA: Shift Left Arithmetic (<<1), bit0 becomes 0, C=old bit7
    // -------------------------
    public process_sla_r8 = (reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const c = (v >>> 7) & 1;
        const r = this.u8(v << 1);
        this.regs[reg] = r;

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    public process_sla_mr = (): boolean => {
        const v = this.readHL();
        const c = (v >>> 7) & 1;
        const r = this.u8(v << 1);
        this.writeHL(r);

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    // -------------------------
    // SRA: Shift Right Arithmetic (>>1), keep bit7, C=old bit0
    // -------------------------
    public process_sra_r8 = (reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const c = v & 1;
        const msb = v & 0x80;
        const r = this.u8((v >>> 1) | msb); // keep MSB
        this.regs[reg] = r;

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    public process_sra_mr = (): boolean => {
        const v = this.readHL();
        const c = v & 1;
        const msb = v & 0x80;
        const r = this.u8((v >>> 1) | msb);
        this.writeHL(r);

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    // -------------------------
    // SRL: Shift Right Logical (>>1), insert 0 to bit7, C=old bit0
    // -------------------------
    public process_srl_r8 = (reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const c = v & 1;
        const r = this.u8(v >>> 1);
        this.regs[reg] = r;

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    public process_srl_mr = (): boolean => {
        const v = this.readHL();
        const c = v & 1;
        const r = this.u8(v >>> 1);
        this.writeHL(r);

        this.setZNH_C(r === 0, false, false, c === 1);
        return true;
    };

    // -------------------------
    // SWAP: Swap upper and lower nibbles
    // -------------------------
    public process_swap_r8 = (reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const r = this.u8(((v & 0x0F) << 4) | ((v & 0xF0) >>> 4));
        this.regs[reg] = r;

        // Z set if result is 0, N=0, H=0, C=0
        this.setZNH_C(r === 0, false, false, false);
        return true;
    };

    public process_swap_mr = (): boolean => {
        const v = this.readHL();
        const r = this.u8(((v & 0x0F) << 4) | ((v & 0xF0) >>> 4));
        this.writeHL(r);

        this.setZNH_C(r === 0, false, false, false);
        return true;
    };

    // -------------------------
    // BIT b, r8 / (HL): Test bit b (0..7)
    // -------------------------
    public process_bit_b_r8 = (bit: number, reg: RegType): boolean => {
        const v = this.regs[reg] & 0xFF;
        const z = ((v >>> bit) & 1) === 0;
        // Z = 1 if bit is 0; N=0; H=1; C unchanged
        this.regs.Z = z;
        this.regs.N = false;
        this.regs.H = true;
        // C unchanged
        return true;
    };

    public process_bit_b_mr = (bit: number): boolean => {
        const v = this.readHL();
        const z = ((v >>> bit) & 1) === 0;
        this.regs.Z = z;
        this.regs.N = false;
        this.regs.H = true;
        // C unchanged
        return true;
    };

    // -------------------------
    // RES b, r8 / (HL): Reset bit b to 0
    // -------------------------
    public process_res_b_r8 = (bit: number, reg: RegType): boolean => {
        const mask = ~(1 << bit);
        this.regs[reg] = this.u8((this.regs[reg] & 0xFF) & mask);
        // Flags unaffected
        return true;
    };

    public process_res_b_mr = (bit: number): boolean => {
        const v = this.readHL();
        const r = this.u8(v & ~(1 << bit));
        this.writeHL(r);
        // Flags unaffected
        return true;
    };

    // -------------------------
    // SET b, r8 / (HL): Set bit b to 1
    // -------------------------
    public process_set_b_r8 = (bit: number, reg: RegType): boolean => {
        this.regs[reg] = this.u8((this.regs[reg] & 0xFF) | (1 << bit));
        // Flags unaffected
        return true;
    };

    public process_set_b_mr = (bit: number): boolean => {
        const v = this.readHL();
        const r = this.u8(v | (1 << bit));
        this.writeHL(r);
        // Flags unaffected
        return true;
    };
}
