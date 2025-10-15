import { Bus } from "./bus"
import { delay } from "./common"
import { CPU } from "./cpu"

export class Emu {
    cpu: CPU = new CPU(new Bus())

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



    public async insertCart(romFile: File) {
        await this.cpu.insertCart(romFile)
    }

    static context: Emu = new Emu()

    async emu_run(): Promise<number> {
        while (true) {
            await delay(1000)

            if (this.paused) {
                await delay(100)
                continue
            }

            if (!this.cpu.cpu_step()) {
                console.log("cpu stopped")
                return -3
            }

            this.ticks++

        }

        return 0
    }

    addCycles(cycles: number) {
        console.log("not implemented");
    }
}