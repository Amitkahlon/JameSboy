


import { Bus } from "@/bus";
import { u16, u8 } from "@/common";
import { CPU } from "@/cpu";
import { CondType } from "@/entities/instruction";
import { Regs, RegType } from "@/entities/regs";
import { IntUtils } from "@/utils/int_utils";


export class CallsJumpProcesses {

    constructor(private regs: Regs, private mem: Bus, private cpu: CPU) {

    }


    public process_call = (cond: CondType): boolean => {
        if (this.check_cond(cond)) {
            const addr = this.cpu.fetch16bit()
            this.regs.sp -= 2
            this.mem.write16(this.regs.sp, this.regs.pc)
            this.regs.pc = addr
        }

        return true
    }

    public process_jp = (cond: CondType): boolean => {
        if (this.check_cond(cond)) {
            const addr = this.cpu.fetch16bit()
            this.regs.pc = addr
        }

        return true
    }

    public process_jp_mr = (): boolean => {
        const addr = this.regs.hl
        this.regs.pc = addr;

        return true
    }




    public process_ret = (cond: CondType): boolean => {
        if (this.check_cond(cond)) {
            const returnAddr = this.mem.read16(this.regs.sp)
            this.regs.sp += 2

            this.regs.pc = returnAddr
        }

        return true
    }

    public process_reti = (): boolean => {
        console.log("Not Implemented Yet")
        return false
    }


    public process_jr = (cond: CondType): boolean => {
        if (!this.check_cond(cond)) return true

        const offsetRaw = this.cpu.fetch();
        const offset = IntUtils.toSigned(offsetRaw)
        this.regs.pc = IntUtils.wrapAddress16(this.regs.pc + offset)

        return true
    }

    public process_rst = (vector: number): boolean => {
        // Push current PC onto the stack (return address is the next instruction)
        const pc = this.regs.pc & 0xFFFF;
        this.regs.sp = (this.regs.sp - 2) & 0xFFFF;
        this.mem.write16(this.regs.sp, pc); // writes lo at [SP], hi at [SP+1]

        // Jump to the fixed vector
        this.regs.pc = vector & 0xFFFF;

        // Flags are unaffected by RST
        return true;
    };





    public check_cond(cond: CondType) {
        const zFlag = this.regs.Z
        const CFlag = this.regs.C

        switch (cond) {
            case "CT_NONE": return true
            case "CT_C": return CFlag
            case "CT_NC": return !CFlag
            case "CT_NZ": return !zFlag
            case "CT_Z": return zFlag
        }

        return false
    }







}