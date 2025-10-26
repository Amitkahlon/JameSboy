import { CBProcesses } from "@/cpu_procs/prefixCB";
import { RegType } from "./regs";
import { u8 } from "@/common";

const r: RegType[] = ["b", "c", "d", "e", "h", "l", "hl", "a"];
const isHL = (i: number) => i === 6;

interface CBInstruction {
    handler: () => boolean;
    cycles: number
}

export class CBInstructionTable {
    private cbOpcodeTable = new Array(0x100);

    constructor(private cbProcesses: CBProcesses) {
        this.initCBTable()
    }

    private initCBTable() {
        // ---------- RLC (0x00..0x07)
        for (let i = 0; i < 8; i++) {
            const op = 0x00 + i;
            this.cbOpcodeTable[op] = {
                cycles: isHL(i) ? 16 : 8,
                handler: isHL(i)
                    ? () => this.cbProcesses.process_rlc_mr()
                    : () => this.cbProcesses.process_rlc_r8(r[i]),
            };
        }

        // ---------- RRC (0x08..0x0F)
        for (let i = 0; i < 8; i++) {
            const op = 0x08 + i;
            this.cbOpcodeTable[op] = {
                cycles: isHL(i) ? 16 : 8,
                handler: isHL(i)
                    ? () => this.cbProcesses.process_rrc_mr()
                    : () => this.cbProcesses.process_rrc_r8(r[i]),
            };
        }

        // ---------- RL (0x10..0x17)
        for (let i = 0; i < 8; i++) {
            const op = 0x10 + i;
            this.cbOpcodeTable[op] = {
                cycles: isHL(i) ? 16 : 8,
                handler: isHL(i)
                    ? () => this.cbProcesses.process_rl_mr()
                    : () => this.cbProcesses.process_rl_r8(r[i]),
            };
        }

        // ---------- RR (0x18..0x1F)
        for (let i = 0; i < 8; i++) {
            const op = 0x18 + i;
            this.cbOpcodeTable[op] = {
                cycles: isHL(i) ? 16 : 8,
                handler: isHL(i)
                    ? () => this.cbProcesses.process_rr_mr()
                    : () => this.cbProcesses.process_rr_r8(r[i]),
            };
        }

        // ---------- SLA (0x20..0x27)
        for (let i = 0; i < 8; i++) {
            const op = 0x20 + i;
            this.cbOpcodeTable[op] = {
                cycles: isHL(i) ? 16 : 8,
                handler: isHL(i)
                    ? () => this.cbProcesses.process_sla_mr()
                    : () => this.cbProcesses.process_sla_r8(r[i]),
            };
        }

        // ---------- SRA (0x28..0x2F)
        for (let i = 0; i < 8; i++) {
            const op = 0x28 + i;
            this.cbOpcodeTable[op] = {
                cycles: isHL(i) ? 16 : 8,
                handler: isHL(i)
                    ? () => this.cbProcesses.process_sra_mr()
                    : () => this.cbProcesses.process_sra_r8(r[i]),
            };
        }

        // ---------- SWAP (0x30..0x37)
        for (let i = 0; i < 8; i++) {
            const op = 0x30 + i;
            this.cbOpcodeTable[op] = {
                cycles: isHL(i) ? 16 : 8,
                handler: isHL(i)
                    ? () => this.cbProcesses.process_swap_mr()
                    : () => this.cbProcesses.process_swap_r8(r[i]),
            };
        }

        // ---------- SRL (0x38..0x3F)
        for (let i = 0; i < 8; i++) {
            const op = 0x38 + i;
            this.cbOpcodeTable[op] = {
                cycles: isHL(i) ? 16 : 8,
                handler: isHL(i)
                    ? () => this.cbProcesses.process_srl_mr()
                    : () => this.cbProcesses.process_srl_r8(r[i]),
            };
        }

        // ---------- BIT b,r (0x40..0x7F)  — 8 אופקודים לכל bit
        for (let bit = 0; bit < 8; bit++) {
            const base = 0x40 + bit * 0x08;
            for (let i = 0; i < 8; i++) {
                const op = base + i;
                this.cbOpcodeTable[op] = {
                    cycles: isHL(i) ? 12 : 8,           // (HL) = 12, אחרת 8
                    handler: isHL(i)
                        ? () => this.cbProcesses.process_bit_b_mr(bit)
                        : () => this.cbProcesses.process_bit_b_r8(bit, r[i]),
                };
            }
        }

        // ---------- RES b,r (0x80..0xBF)
        for (let bit = 0; bit < 8; bit++) {
            const base = 0x80 + bit * 0x08;
            for (let i = 0; i < 8; i++) {
                const op = base + i;
                this.cbOpcodeTable[op] = {
                    cycles: isHL(i) ? 16 : 8,
                    handler: isHL(i)
                        ? () => this.cbProcesses.process_res_b_mr(bit)
                        : () => this.cbProcesses.process_res_b_r8(bit, r[i]),
                };
            }
        }

        // ---------- SET b,r (0xC0..0xFF)
        for (let bit = 0; bit < 8; bit++) {
            const base = 0xC0 + bit * 0x08;
            for (let i = 0; i < 8; i++) {
                const op = base + i;
                this.cbOpcodeTable[op] = {
                    cycles: isHL(i) ? 16 : 8,
                    handler: isHL(i)
                        ? () => this.cbProcesses.process_set_b_mr(bit)
                        : () => this.cbProcesses.process_set_b_r8(bit, r[i]),
                };
            }
        }

    }


    public get(opcode: u8): CBInstruction {
        return this.cbOpcodeTable[opcode]
    }
}
