import { Bus } from "./bus"
import { delay, u8 } from "./common"
import { CPU } from "./cpu"
import { InstructionTable } from "./entities/instructionTable"
import { Regs } from "./entities/regs"

export class Emu {
    cpu: CPU = new CPU(new Bus(this), this)

    paused: boolean
    running: boolean
    ticks: number
    nextStepClicked: boolean
    public terminated = false


    /**
     Emu components:
    |Cart|
    |CPU|
    |Address Bus|
    |PPU|
    |Timer|
     */

    constructor(private updateUI: (regs: Regs) => void) {
        this.paused = false
        this.running = false
        this.ticks = 0
    }



    public async insertCart(romFile: File) {
        await this.cpu.insertCart(romFile)

        this.updateUI(this.cpu.regs)
    }


    async emu_run(): Promise<void> {
        while (true) {
            if (this.terminated) {
                return
            }
            await delay(100)

            if (this.paused) {
                await delay(100)
                continue
            }

            if (!this.cpu.cpu_step()) {
                console.log("~~cpu stopped~~")
                return
            }

            this.ticks++

            this.updateUI(this.cpu.regs)
        }

    }


    async emu_run_step(): Promise<void> {
        if (!this.cpu.cpu_step()) {
            console.log("~~cpu stopped~~")
            return
        }

        this.ticks++

        this.updateUI(this.cpu.regs)
        return
    }



}