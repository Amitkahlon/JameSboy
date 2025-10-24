


import { Bus } from "@/bus";
import { u16, u8 } from "@/common";
import { CPU } from "@/cpu";
import { Regs, RegType } from "@/entities/regs";
import { IntUtils } from "@/utils/int_utils";


class MiscProcesses {

    constructor(private regs: Regs, private mem: Bus, private cpu: CPU) {

    }


    public process_nop = (): boolean => {
        return true;
    }

    public process_stop = (): boolean => {
        return false;
    }

    public process_halt = (): boolean => {
        return false
    }

    public process_di = (): boolean => {
        this.cpu.ime = false
        return true
    }

    public process_ei = (): boolean => {
        this.cpu.ime = true
        return true
    }


    public process_prefixCB = (): boolean => {
        const opcode = this.cpu.fetch8bit();
        



        return true
    }



}