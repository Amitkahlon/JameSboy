import { describe, it, expect } from 'vitest';
import { Emu } from '@/emu';

describe.skip('Integration Tests', () => {
    it('should run cpu_instrs.gb and capture output', async () => {
        const emu = new Emu(() => {});
        let output = '';
        
        // Access the bus to hook serial output
        // We cast to any because mem is private in CPU usually, 
        // but we need access for this integration test hook.
        const bus = (emu.cpu as any).mem;
        bus.onSerialWrite = (byte: number) => {
            output += String.fromCharCode(byte);
        };

        try {
            // Ensure cpu_instrs.gb is in public/roms/
            await emu.insertCart('cpu_instrs');
        } catch (e) {
            console.warn('cpu_instrs.gb not found, skipping integration test.');
            return;
        }

        console.log('Starting cpu_instrs execution...');
        
        // Run for a set number of instructions or until completion.
        // Blargg's tests can take millions of cycles.
        const LIMIT = 15_000_000; 
        
        for (let i = 0; i < LIMIT; i++) {
            if (!emu.cpu.cpu_step()) break;
            
            // Check for "Passed" or "Failed" in output to stop early
            if (output.includes("Passed")) break;
            if (output.includes("Failed")) break;
        }

        console.log('Serial Output:\n', output);
        
        expect(output).toContain("Passed");
    }, 60000); // Increased timeout for long running test
});