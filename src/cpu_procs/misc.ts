


import { Bus } from "@/bus";
import { u16, u8 } from "@/common";
import { CPU } from "@/cpu";
import { CBInstructionTable } from "@/entities/cbInstrutionTable";
import { InstructionTable } from "@/entities/instructionTable";
import { Regs, RegType } from "@/entities/regs";
import { IntUtils } from "@/utils/int_utils";
import { CBProcesses } from "./prefixCB";


export class MiscProcesses {

    private cbInstructionTable: CBInstructionTable

    constructor(private cpu: CPU, cbProcesses: CBProcesses) {
        this.cbInstructionTable = new CBInstructionTable(cbProcesses);
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
        const opcode = this.cpu.fetch();
        const ins = this.cbInstructionTable.get(opcode)

        return ins.handler()
    }



}