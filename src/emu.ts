import { delay } from "./common"
import { CPU } from "./cpu"

class Emu {
    cpu: CPU = new CPU()

    paused: boolean
    running: boolean
    ticks: number

    /**
     Emu components:
    |Cart|
    |CPU|
    |Address Bus|
    |PPU|
    |Timer|
     */

    constructor() {
        this.paused = false
        this.running = false
        this.ticks = 0
    }

    getContext() { return Emu.context }

    static context: Emu = new Emu()

    async emu_run(carthage: string): Promise<number> {


        while (true) {
            if (this.paused) {
                await delay(100)
                continue
            }

            if (!this.cpu.cpu_step) {
                console.log("cpu stopped")
                return -3
            }

            this.ticks++

        }

        return 0
    }
}