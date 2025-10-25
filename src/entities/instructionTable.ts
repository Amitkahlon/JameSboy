import { u8 } from "@/common";
import { CondType, Instruction, InType } from "./instruction";
import { CPU } from "@/cpu";
import { CBProcesses } from "@/cpu_procs/prefixCB";
import { ArithmeticProcesses } from "@/cpu_procs/arithmetic";
import { CallsJumpProcesses } from "@/cpu_procs/calls";
import { LoadProcesses } from "@/cpu_procs/lsm";
import { MiscProcesses } from "@/cpu_procs/misc";


export class InstructionTable {

    private opcodeTable: Instruction[] = Array.from({ length: 0x100 }, (_, i) => (null));
    private cbProcesses: CBProcesses;
    private miscProcesses: MiscProcesses;
    private loadProcesses: LoadProcesses;
    private callsJumpProcesses: CallsJumpProcesses;
    private arithmeticProcesses: ArithmeticProcesses;




    constructor(private cpu: CPU) {
        // 0x00–0x0F
        this.opcodeTable[0x00] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() };
        this.opcodeTable[0x01] = { type: "IN_LD", cycles: 12, handler: () => this.loadProcesses.process_ld_16r_d16("bc") };
        this.opcodeTable[0x02] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("bc", "a") };
        this.opcodeTable[0x03] = { type: "IN_INC", cycles: 8, handler: () => this.arithmeticProcesses.process_inc_r16("bc") };
        this.opcodeTable[0x04] = { type: "IN_INC", cycles: 4, handler: () => this.arithmeticProcesses.process_inc_r8("b") };
        this.opcodeTable[0x05] = { type: "IN_DEC", cycles: 4, handler: () => this.arithmeticProcesses.process_dec_r8("b") };
        this.opcodeTable[0x06] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_d8("b") };
        this.opcodeTable[0x07] = { type: "IN_RLCA", cycles: 4, handler: () => this.arithmeticProcesses.process_RLCA() };
        this.opcodeTable[0x08] = { type: "IN_LD", cycles: 20, handler: () => this.loadProcesses.process_ld_a16_sp() };
        this.opcodeTable[0x09] = { type: "IN_ADD", cycles: 8, handler: () => this.arithmeticProcesses.process_add_16r_16r("hl", "bc") };
        this.opcodeTable[0x0A] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("a", "bc") };
        this.opcodeTable[0x0B] = { type: "IN_DEC", cycles: 8, handler: () => this.arithmeticProcesses.process_dec_r16("bc") };
        this.opcodeTable[0x0C] = { type: "IN_INC", cycles: 4, handler: () => this.arithmeticProcesses.process_inc_r8("c") };
        this.opcodeTable[0x0D] = { type: "IN_DEC", cycles: 4, handler: () => this.arithmeticProcesses.process_dec_r8("c") };
        this.opcodeTable[0x0E] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_d8("c") };
        this.opcodeTable[0x0F] = { type: "IN_RRCA", cycles: 4, handler: () => this.arithmeticProcesses.process_rrca() };

        // 0x10–0x1F
        this.opcodeTable[0x10] = { type: "IN_STOP", cycles: 4, handler: () => this.miscProcesses.process_stop() };
        this.opcodeTable[0x11] = { type: "IN_LD", cycles: 12, handler: () => this.loadProcesses.process_ld_16r_d16("de") };
        this.opcodeTable[0x12] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("de", "a") };
        this.opcodeTable[0x13] = { type: "IN_INC", cycles: 8, handler: () => this.arithmeticProcesses.process_inc_r16("de") };
        this.opcodeTable[0x14] = { type: "IN_INC", cycles: 4, handler: () => this.arithmeticProcesses.process_inc_r8("d") };
        this.opcodeTable[0x15] = { type: "IN_DEC", cycles: 4, handler: () => this.arithmeticProcesses.process_dec_r8("d") };
        this.opcodeTable[0x16] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_d8("d") };
        this.opcodeTable[0x17] = { type: "IN_RLA", cycles: 4, handler: () => this.arithmeticProcesses.process_RLA() };
        this.opcodeTable[0x18] = { type: "IN_JR", cycles: 12, handler: () => this.callsJumpProcesses.process_jr("CT_NONE") };
        this.opcodeTable[0x19] = { type: "IN_ADD", cycles: 8, handler: () => this.arithmeticProcesses.process_add_16r_16r("hl", "de") };
        this.opcodeTable[0x1A] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("a", "de") };
        this.opcodeTable[0x1B] = { type: "IN_DEC", cycles: 8, handler: () => this.arithmeticProcesses.process_dec_r16("de") };
        this.opcodeTable[0x1C] = { type: "IN_INC", cycles: 4, handler: () => this.arithmeticProcesses.process_inc_r8("e") };
        this.opcodeTable[0x1D] = { type: "IN_DEC", cycles: 4, handler: () => this.arithmeticProcesses.process_dec_r8("e") };
        this.opcodeTable[0x1E] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_d8("e") };
        this.opcodeTable[0x1F] = { type: "IN_RRA", cycles: 4, handler: () => this.arithmeticProcesses.process_RRA() };

        // 0x20–0x2F
        this.opcodeTable[0x20] = { type: "IN_JR", cycles: 12, handler: () => this.callsJumpProcesses.process_jr("CT_NZ") };
        this.opcodeTable[0x21] = { type: "IN_LD", cycles: 12, handler: () => this.loadProcesses.process_ld_16r_d16("hl") };
        this.opcodeTable[0x22] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_hl_ra(true) };   // (HL+)=A
        this.opcodeTable[0x23] = { type: "IN_INC", cycles: 8, handler: () => this.arithmeticProcesses.process_inc_r16("hl") };
        this.opcodeTable[0x24] = { type: "IN_INC", cycles: 4, handler: () => this.arithmeticProcesses.process_inc_r8("h") };
        this.opcodeTable[0x25] = { type: "IN_DEC", cycles: 4, handler: () => this.arithmeticProcesses.process_dec_r8("h") };
        this.opcodeTable[0x26] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_d8("h") };
        this.opcodeTable[0x27] = { type: "IN_DAA", cycles: 4, handler: () => this.arithmeticProcesses.process_DAA() };
        this.opcodeTable[0x28] = { type: "IN_JR", cycles: 12, handler: () => this.callsJumpProcesses.process_jr("CT_Z") };
        this.opcodeTable[0x29] = { type: "IN_ADD", cycles: 8, handler: () => this.arithmeticProcesses.process_add_16r_16r("hl", "hl") };
        this.opcodeTable[0x2A] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_ra_hl(true) };    // A=(HL+)
        this.opcodeTable[0x2B] = { type: "IN_DEC", cycles: 8, handler: () => this.arithmeticProcesses.process_dec_r16("hl") };
        this.opcodeTable[0x2C] = { type: "IN_INC", cycles: 4, handler: () => this.arithmeticProcesses.process_inc_r8("l") };
        this.opcodeTable[0x2D] = { type: "IN_DEC", cycles: 4, handler: () => this.arithmeticProcesses.process_dec_r8("l") };
        this.opcodeTable[0x2E] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_d8("l") };
        this.opcodeTable[0x2F] = { type: "IN_CPL", cycles: 4, handler: () => this.arithmeticProcesses.process_CPL() };

        // 0x30–0x3F
        this.opcodeTable[0x30] = { type: "IN_JR", cycles: 12, handler: () => this.callsJumpProcesses.process_jr("CT_NC") };
        this.opcodeTable[0x31] = { type: "IN_LD", cycles: 12, handler: () => this.loadProcesses.process_ld_16r_d16("sp") };
        this.opcodeTable[0x32] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_hl_ra(false) };  // (HL-)=A
        this.opcodeTable[0x33] = { type: "IN_INC", cycles: 8, handler: () => this.arithmeticProcesses.process_inc_r16("sp") };
        this.opcodeTable[0x34] = { type: "IN_INC", cycles: 12, handler: () => this.arithmeticProcesses.process_inc_mr() };
        this.opcodeTable[0x35] = { type: "IN_DEC", cycles: 12, handler: () => this.arithmeticProcesses.process_dec_mr() };
        this.opcodeTable[0x36] = { type: "IN_LD", cycles: 12, handler: () => this.loadProcesses.process_ld_hl_d8() }; // TODO: if you named it differently
        this.opcodeTable[0x37] = { type: "IN_SCF", cycles: 4, handler: () => this.arithmeticProcesses.process_SCF() };
        this.opcodeTable[0x38] = { type: "IN_JR", cycles: 12, handler: () => this.callsJumpProcesses.process_jr("CT_C") };
        this.opcodeTable[0x39] = { type: "IN_ADD", cycles: 8, handler: () => this.arithmeticProcesses.process_add_16r_16r("hl", "sp") };
        this.opcodeTable[0x3A] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_ra_hl(false) };  // A=(HL-)
        this.opcodeTable[0x3B] = { type: "IN_DEC", cycles: 8, handler: () => this.arithmeticProcesses.process_dec_r16("sp") };
        this.opcodeTable[0x3C] = { type: "IN_INC", cycles: 4, handler: () => this.arithmeticProcesses.process_inc_r8("a") };
        this.opcodeTable[0x3D] = { type: "IN_DEC", cycles: 4, handler: () => this.arithmeticProcesses.process_dec_r8("a") };
        this.opcodeTable[0x3E] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_d8("a") };
        this.opcodeTable[0x3F] = { type: "IN_CCF", cycles: 4, handler: () => this.arithmeticProcesses.process_CCF() };

        // 0x40–0x4F
        this.opcodeTable[0x40] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("b", "b") };
        this.opcodeTable[0x41] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("b", "c") };
        this.opcodeTable[0x42] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("b", "d") };
        this.opcodeTable[0x43] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("b", "e") };
        this.opcodeTable[0x44] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("b", "h") };
        this.opcodeTable[0x45] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("b", "l") };
        this.opcodeTable[0x46] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("b", "hl") };
        this.opcodeTable[0x47] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("b", "a") };
        this.opcodeTable[0x48] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("c", "b") };
        this.opcodeTable[0x49] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("c", "c") };
        this.opcodeTable[0x4A] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("c", "d") };
        this.opcodeTable[0x4B] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("c", "e") };
        this.opcodeTable[0x4C] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("c", "h") };
        this.opcodeTable[0x4D] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("c", "l") };
        this.opcodeTable[0x4E] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("c", "hl") };
        this.opcodeTable[0x4F] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("c", "a") };

        // 0x50–0x5F
        this.opcodeTable[0x50] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("d", "b") };
        this.opcodeTable[0x51] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("d", "c") };
        this.opcodeTable[0x52] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("d", "d") };
        this.opcodeTable[0x53] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("d", "e") };
        this.opcodeTable[0x54] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("d", "h") };
        this.opcodeTable[0x55] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("d", "l") };
        this.opcodeTable[0x56] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("d", "hl") };
        this.opcodeTable[0x57] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("d", "a") };
        this.opcodeTable[0x58] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("e", "b") };
        this.opcodeTable[0x59] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("e", "c") };
        this.opcodeTable[0x5A] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("e", "d") };
        this.opcodeTable[0x5B] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("e", "e") };
        this.opcodeTable[0x5C] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("e", "h") };
        this.opcodeTable[0x5D] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("e", "l") };
        this.opcodeTable[0x5E] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("e", "hl") };
        this.opcodeTable[0x5F] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("e", "a") };

        // 0x60–0x6F
        this.opcodeTable[0x60] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("h", "b") };
        this.opcodeTable[0x61] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("h", "c") };
        this.opcodeTable[0x62] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("h", "d") };
        this.opcodeTable[0x63] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("h", "e") };
        this.opcodeTable[0x64] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("h", "h") };
        this.opcodeTable[0x65] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("h", "l") };
        this.opcodeTable[0x66] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("h", "hl") };
        this.opcodeTable[0x67] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("h", "a") };
        this.opcodeTable[0x68] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("l", "b") };
        this.opcodeTable[0x69] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("l", "c") };
        this.opcodeTable[0x6A] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("l", "d") };
        this.opcodeTable[0x6B] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("l", "e") };
        this.opcodeTable[0x6C] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("l", "h") };
        this.opcodeTable[0x6D] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("l", "l") };
        this.opcodeTable[0x6E] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("l", "hl") };
        this.opcodeTable[0x6F] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("l", "a") };

        // 0x70–0x7F
        this.opcodeTable[0x70] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("hl", "b") };
        this.opcodeTable[0x71] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("hl", "c") };
        this.opcodeTable[0x72] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("hl", "d") };
        this.opcodeTable[0x73] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("hl", "e") };
        this.opcodeTable[0x74] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("hl", "h") };
        this.opcodeTable[0x75] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("hl", "l") };
        this.opcodeTable[0x76] = { type: "IN_HALT", cycles: 4, handler: () => this.miscProcesses.process_halt() };
        this.opcodeTable[0x77] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mr_r8("hl", "a") };
        this.opcodeTable[0x78] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("a", "b") };
        this.opcodeTable[0x79] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("a", "c") };
        this.opcodeTable[0x7A] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("a", "d") };
        this.opcodeTable[0x7B] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("a", "e") };
        this.opcodeTable[0x7C] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("a", "h") };
        this.opcodeTable[0x7D] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("a", "l") };
        this.opcodeTable[0x7E] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r8_mr("a", "hl") };
        this.opcodeTable[0x7F] = { type: "IN_LD", cycles: 4, handler: () => this.loadProcesses.process_ld_r8_r8("a", "a") };

        // 0x80–0x8F (ADD/ADC)
        this.opcodeTable[0x80] = { type: "IN_ADD", cycles: 4, handler: () => this.arithmeticProcesses.process_add_8r_8r("a", "b") };
        this.opcodeTable[0x81] = { type: "IN_ADD", cycles: 4, handler: () => this.arithmeticProcesses.process_add_8r_8r("a", "c") };
        this.opcodeTable[0x82] = { type: "IN_ADD", cycles: 4, handler: () => this.arithmeticProcesses.process_add_8r_8r("a", "d") };
        this.opcodeTable[0x83] = { type: "IN_ADD", cycles: 4, handler: () => this.arithmeticProcesses.process_add_8r_8r("a", "e") };
        this.opcodeTable[0x84] = { type: "IN_ADD", cycles: 4, handler: () => this.arithmeticProcesses.process_add_8r_8r("a", "h") };
        this.opcodeTable[0x85] = { type: "IN_ADD", cycles: 4, handler: () => this.arithmeticProcesses.process_add_8r_8r("a", "l") };
        this.opcodeTable[0x86] = { type: "IN_ADD", cycles: 8, handler: () => this.arithmeticProcesses.process_add_r8_mr() };
        this.opcodeTable[0x87] = { type: "IN_ADD", cycles: 4, handler: () => this.arithmeticProcesses.process_add_8r_8r("a", "a") };
        this.opcodeTable[0x88] = { type: "IN_ADC", cycles: 4, handler: () => this.arithmeticProcesses.process_abc_8r_8r("a", "b") };
        this.opcodeTable[0x89] = { type: "IN_ADC", cycles: 4, handler: () => this.arithmeticProcesses.process_abc_8r_8r("a", "c") };
        this.opcodeTable[0x8A] = { type: "IN_ADC", cycles: 4, handler: () => this.arithmeticProcesses.process_abc_8r_8r("a", "d") };
        this.opcodeTable[0x8B] = { type: "IN_ADC", cycles: 4, handler: () => this.arithmeticProcesses.process_abc_8r_8r("a", "e") };
        this.opcodeTable[0x8C] = { type: "IN_ADC", cycles: 4, handler: () => this.arithmeticProcesses.process_abc_8r_8r("a", "h") };
        this.opcodeTable[0x8D] = { type: "IN_ADC", cycles: 4, handler: () => this.arithmeticProcesses.process_abc_8r_8r("a", "l") };
        this.opcodeTable[0x8E] = { type: "IN_ADC", cycles: 8, handler: () => this.arithmeticProcesses.process_abc_ra_mr() };
        this.opcodeTable[0x8F] = { type: "IN_ADC", cycles: 4, handler: () => this.arithmeticProcesses.process_abc_8r_8r("a", "a") };

        // 0x90–0x9F (SUB/SBC)
        this.opcodeTable[0x90] = { type: "IN_SUB", cycles: 4, handler: () => this.arithmeticProcesses.process_sub_8r("b") };
        this.opcodeTable[0x91] = { type: "IN_SUB", cycles: 4, handler: () => this.arithmeticProcesses.process_sub_8r("c") };
        this.opcodeTable[0x92] = { type: "IN_SUB", cycles: 4, handler: () => this.arithmeticProcesses.process_sub_8r("d") };
        this.opcodeTable[0x93] = { type: "IN_SUB", cycles: 4, handler: () => this.arithmeticProcesses.process_sub_8r("e") };
        this.opcodeTable[0x94] = { type: "IN_SUB", cycles: 4, handler: () => this.arithmeticProcesses.process_sub_8r("h") };
        this.opcodeTable[0x95] = { type: "IN_SUB", cycles: 4, handler: () => this.arithmeticProcesses.process_sub_8r("l") };
        this.opcodeTable[0x96] = { type: "IN_SUB", cycles: 8, handler: () => this.arithmeticProcesses.process_sub_r8_mr() };
        this.opcodeTable[0x97] = { type: "IN_SUB", cycles: 4, handler: () => this.arithmeticProcesses.process_sub_8r("a") };
        this.opcodeTable[0x98] = { type: "IN_SBC", cycles: 4, handler: () => this.arithmeticProcesses.process_sbc_8r_8r("a", "b") };
        this.opcodeTable[0x99] = { type: "IN_SBC", cycles: 4, handler: () => this.arithmeticProcesses.process_sbc_8r_8r("a", "c") };
        this.opcodeTable[0x9A] = { type: "IN_SBC", cycles: 4, handler: () => this.arithmeticProcesses.process_sbc_8r_8r("a", "d") };
        this.opcodeTable[0x9B] = { type: "IN_SBC", cycles: 4, handler: () => this.arithmeticProcesses.process_sbc_8r_8r("a", "e") };
        this.opcodeTable[0x9C] = { type: "IN_SBC", cycles: 4, handler: () => this.arithmeticProcesses.process_sbc_8r_8r("a", "h") };
        this.opcodeTable[0x9D] = { type: "IN_SBC", cycles: 4, handler: () => this.arithmeticProcesses.process_sbc_8r_8r("a", "l") };
        this.opcodeTable[0x9E] = { type: "IN_SBC", cycles: 8, handler: () => this.arithmeticProcesses.process_sbc_ra_mr() };
        this.opcodeTable[0x9F] = { type: "IN_SBC", cycles: 4, handler: () => this.arithmeticProcesses.process_sbc_8r_8r("a", "a") };

        // 0xA0–0xAF (AND/XOR)
        this.opcodeTable[0xA0] = { type: "IN_AND", cycles: 4, handler: () => this.arithmeticProcesses.process_and_r8("b") };
        this.opcodeTable[0xA1] = { type: "IN_AND", cycles: 4, handler: () => this.arithmeticProcesses.process_and_r8("c") };
        this.opcodeTable[0xA2] = { type: "IN_AND", cycles: 4, handler: () => this.arithmeticProcesses.process_and_r8("d") };
        this.opcodeTable[0xA3] = { type: "IN_AND", cycles: 4, handler: () => this.arithmeticProcesses.process_and_r8("e") };
        this.opcodeTable[0xA4] = { type: "IN_AND", cycles: 4, handler: () => this.arithmeticProcesses.process_and_r8("h") };
        this.opcodeTable[0xA5] = { type: "IN_AND", cycles: 4, handler: () => this.arithmeticProcesses.process_and_r8("l") };
        this.opcodeTable[0xA6] = { type: "IN_AND", cycles: 8, handler: () => this.arithmeticProcesses.process_and_hl() };
        this.opcodeTable[0xA7] = { type: "IN_AND", cycles: 4, handler: () => this.arithmeticProcesses.process_and_r8("a") };
        this.opcodeTable[0xA8] = { type: "IN_XOR", cycles: 4, handler: () => this.arithmeticProcesses.process_xor_r8("b") };
        this.opcodeTable[0xA9] = { type: "IN_XOR", cycles: 4, handler: () => this.arithmeticProcesses.process_xor_r8("c") };
        this.opcodeTable[0xAA] = { type: "IN_XOR", cycles: 4, handler: () => this.arithmeticProcesses.process_xor_r8("d") };
        this.opcodeTable[0xAB] = { type: "IN_XOR", cycles: 4, handler: () => this.arithmeticProcesses.process_xor_r8("e") };
        this.opcodeTable[0xAC] = { type: "IN_XOR", cycles: 4, handler: () => this.arithmeticProcesses.process_xor_r8("h") };
        this.opcodeTable[0xAD] = { type: "IN_XOR", cycles: 4, handler: () => this.arithmeticProcesses.process_xor_r8("l") };
        this.opcodeTable[0xAE] = { type: "IN_XOR", cycles: 8, handler: () => this.arithmeticProcesses.process_xor_hl() };
        this.opcodeTable[0xAF] = { type: "IN_XOR", cycles: 4, handler: () => this.arithmeticProcesses.process_xor_r8("a") };

        // 0xB0–0xBF (OR/CP)
        this.opcodeTable[0xB0] = { type: "IN_OR", cycles: 4, handler: () => this.arithmeticProcesses.process_or_r8("b") };
        this.opcodeTable[0xB1] = { type: "IN_OR", cycles: 4, handler: () => this.arithmeticProcesses.process_or_r8("c") };
        this.opcodeTable[0xB2] = { type: "IN_OR", cycles: 4, handler: () => this.arithmeticProcesses.process_or_r8("d") };
        this.opcodeTable[0xB3] = { type: "IN_OR", cycles: 4, handler: () => this.arithmeticProcesses.process_or_r8("e") };
        this.opcodeTable[0xB4] = { type: "IN_OR", cycles: 4, handler: () => this.arithmeticProcesses.process_or_r8("h") };
        this.opcodeTable[0xB5] = { type: "IN_OR", cycles: 4, handler: () => this.arithmeticProcesses.process_or_r8("l") };
        this.opcodeTable[0xB6] = { type: "IN_OR", cycles: 8, handler: () => this.arithmeticProcesses.process_or_hl() };
        this.opcodeTable[0xB7] = { type: "IN_OR", cycles: 4, handler: () => this.arithmeticProcesses.process_or_r8("a") };
        this.opcodeTable[0xB8] = { type: "IN_CP", cycles: 4, handler: () => this.arithmeticProcesses.process_cp_r8("b") };
        this.opcodeTable[0xB9] = { type: "IN_CP", cycles: 4, handler: () => this.arithmeticProcesses.process_cp_r8("c") };
        this.opcodeTable[0xBA] = { type: "IN_CP", cycles: 4, handler: () => this.arithmeticProcesses.process_cp_r8("d") };
        this.opcodeTable[0xBB] = { type: "IN_CP", cycles: 4, handler: () => this.arithmeticProcesses.process_cp_r8("e") };
        this.opcodeTable[0xBC] = { type: "IN_CP", cycles: 4, handler: () => this.arithmeticProcesses.process_cp_r8("h") };
        this.opcodeTable[0xBD] = { type: "IN_CP", cycles: 4, handler: () => this.arithmeticProcesses.process_cp_r8("l") };
        this.opcodeTable[0xBE] = { type: "IN_CP", cycles: 8, handler: () => this.arithmeticProcesses.process_cp_hl() };
        this.opcodeTable[0xBF] = { type: "IN_CP", cycles: 4, handler: () => this.arithmeticProcesses.process_cp_r8("a") };

        // 0xC0–0xCF
        this.opcodeTable[0xC0] = { type: "IN_RET", cycles: 20, handler: () => this.callsJumpProcesses.process_ret("CT_NZ") };
        this.opcodeTable[0xC1] = { type: "IN_POP", cycles: 12, handler: () => this.loadProcesses.process_pop_r16("bc") };
        this.opcodeTable[0xC2] = { type: "IN_JP", cycles: 16, handler: () => this.callsJumpProcesses.process_jp("CT_NZ") };
        this.opcodeTable[0xC3] = { type: "IN_JP", cycles: 16, handler: () => this.callsJumpProcesses.process_jp("CT_NONE") };
        this.opcodeTable[0xC4] = { type: "IN_CALL", cycles: 24, handler: () => this.callsJumpProcesses.process_call("CT_NZ") };
        this.opcodeTable[0xC5] = { type: "IN_PUSH", cycles: 16, handler: () => this.loadProcesses.process_push_r16("bc") };
        this.opcodeTable[0xC6] = { type: "IN_ADD", cycles: 8, handler: () => this.arithmeticProcesses.process_add_d8("a") };
        this.opcodeTable[0xC7] = { type: "IN_RST", cycles: 16, handler: () => this.callsJumpProcesses.process_rst(0x00) };
        this.opcodeTable[0xC8] = { type: "IN_RET", cycles: 20, handler: () => this.callsJumpProcesses.process_ret("CT_Z") };
        this.opcodeTable[0xC9] = { type: "IN_RET", cycles: 16, handler: () => this.callsJumpProcesses.process_ret("CT_NONE") };
        this.opcodeTable[0xCA] = { type: "IN_JP", cycles: 16, handler: () => this.callsJumpProcesses.process_jp("CT_Z") };
        this.opcodeTable[0xCB] = { type: "IN_CB", cycles: 4, handler: () => this.miscProcesses.process_prefixCB() };
        this.opcodeTable[0xCC] = { type: "IN_CALL", cycles: 24, handler: () => this.callsJumpProcesses.process_call("CT_Z") };
        this.opcodeTable[0xCD] = { type: "IN_CALL", cycles: 24, handler: () => this.callsJumpProcesses.process_call("CT_NONE") };
        this.opcodeTable[0xCE] = { type: "IN_ADC", cycles: 8, handler: () => this.arithmeticProcesses.process_abc_d8() };
        this.opcodeTable[0xCF] = { type: "IN_RST", cycles: 16, handler: () => this.callsJumpProcesses.process_rst(0x08) };

        // 0xD0–0xDF
        this.opcodeTable[0xD0] = { type: "IN_RET", cycles: 20, handler: () => this.callsJumpProcesses.process_ret("CT_NC") };
        this.opcodeTable[0xD1] = { type: "IN_POP", cycles: 12, handler: () => this.loadProcesses.process_pop_r16("de") };
        this.opcodeTable[0xD2] = { type: "IN_JP", cycles: 16, handler: () => this.callsJumpProcesses.process_jp("CT_NC") };
        this.opcodeTable[0xD3] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xD4] = { type: "IN_CALL", cycles: 24, handler: () => this.callsJumpProcesses.process_call("CT_NC") };
        this.opcodeTable[0xD5] = { type: "IN_PUSH", cycles: 16, handler: () => this.loadProcesses.process_push_r16("de") };
        this.opcodeTable[0xD6] = { type: "IN_SUB", cycles: 8, handler: () => this.arithmeticProcesses.process_sub_d8() };
        this.opcodeTable[0xD7] = { type: "IN_RST", cycles: 16, handler: () => this.callsJumpProcesses.process_rst(0x10) };
        this.opcodeTable[0xD8] = { type: "IN_RET", cycles: 20, handler: () => this.callsJumpProcesses.process_ret("CT_C") };
        this.opcodeTable[0xD9] = { type: "IN_RETI", cycles: 16, handler: () => this.callsJumpProcesses.process_reti() };
        this.opcodeTable[0xDA] = { type: "IN_JP", cycles: 16, handler: () => this.callsJumpProcesses.process_jp("CT_C") };
        this.opcodeTable[0xDB] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xDC] = { type: "IN_CALL", cycles: 24, handler: () => this.callsJumpProcesses.process_call("CT_C") };
        this.opcodeTable[0xDD] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xDE] = { type: "IN_SBC", cycles: 8, handler: () => this.arithmeticProcesses.process_sbc_d8() };
        this.opcodeTable[0xDF] = { type: "IN_RST", cycles: 16, handler: () => this.callsJumpProcesses.process_rst(0x18) };

        // 0xE0–0xEF
        this.opcodeTable[0xE0] = { type: "IN_LD", cycles: 12, handler: () => this.loadProcesses.process_ldh_a8_ra() }; // (a8)=A
        this.opcodeTable[0xE1] = { type: "IN_POP", cycles: 12, handler: () => this.loadProcesses.process_pop_r16("hl") };
        this.opcodeTable[0xE2] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_mrc_ra() };   // (C)=A
        this.opcodeTable[0xE3] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xE4] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xE5] = { type: "IN_PUSH", cycles: 16, handler: () => this.loadProcesses.process_push_r16("hl") };
        this.opcodeTable[0xE6] = { type: "IN_AND", cycles: 8, handler: () => this.arithmeticProcesses.process_and_d8() };
        this.opcodeTable[0xE7] = { type: "IN_RST", cycles: 16, handler: () => this.callsJumpProcesses.process_rst(0x20) };
        this.opcodeTable[0xE8] = { type: "IN_ADD", cycles: 16, handler: () => this.arithmeticProcesses.process_add_sp_sd8() }; // ADD SP,r8
        this.opcodeTable[0xE9] = { type: "IN_JP", cycles: 4, handler: () => this.callsJumpProcesses.process_jp_mr() };     // JP (HL)
        this.opcodeTable[0xEA] = { type: "IN_LD", cycles: 16, handler: () => this.loadProcesses.process_ld_a16_ra() };      // (a16)=A
        this.opcodeTable[0xEB] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xEC] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xED] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xEE] = { type: "IN_XOR", cycles: 8, handler: () => this.arithmeticProcesses.process_xor_d8() };
        this.opcodeTable[0xEF] = { type: "IN_RST", cycles: 16, handler: () => this.callsJumpProcesses.process_rst(0x28) };

        // 0xF0–0xFF
        this.opcodeTable[0xF0] = { type: "IN_LD", cycles: 12, handler: () => this.loadProcesses.process_ldh_ra_a8() }; // A=(a8)
        this.opcodeTable[0xF1] = { type: "IN_POP", cycles: 12, handler: () => this.loadProcesses.process_pop_r16("af") };
        this.opcodeTable[0xF2] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_ra_mrc() };    // A=(C)
        this.opcodeTable[0xF3] = { type: "IN_DI", cycles: 4, handler: () => this.miscProcesses.process_di() };
        this.opcodeTable[0xF4] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xF5] = { type: "IN_PUSH", cycles: 16, handler: () => this.loadProcesses.process_push_r16("af") };
        this.opcodeTable[0xF6] = { type: "IN_OR", cycles: 8, handler: () => this.arithmeticProcesses.process_or_d8() };
        this.opcodeTable[0xF7] = { type: "IN_RST", cycles: 16, handler: () => this.callsJumpProcesses.process_rst(0x30) };
        this.opcodeTable[0xF8] = { type: "IN_LD", cycles: 12, handler: () => this.loadProcesses.process_ld_HL_SPR() };     // HL=SP+r8
        this.opcodeTable[0xF9] = { type: "IN_LD", cycles: 8, handler: () => this.loadProcesses.process_ld_r16_r16("sp", "hl") }; // SP=HL
        this.opcodeTable[0xFA] = { type: "IN_LD", cycles: 16, handler: () => this.loadProcesses.process_ld_ra_a16() };     // A=(a16)
        this.opcodeTable[0xFB] = { type: "IN_EI", cycles: 4, handler: () => this.miscProcesses.process_ei() };
        this.opcodeTable[0xFC] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xFD] = { type: "IN_NOP", cycles: 4, handler: () => this.miscProcesses.process_nop() }; // invalid
        this.opcodeTable[0xFE] = { type: "IN_CP", cycles: 8, handler: () => this.arithmeticProcesses.process_cp_d8() };
        this.opcodeTable[0xFF] = { type: "IN_RST", cycles: 16, handler: () => this.callsJumpProcesses.process_rst(0x38) };


    }

    get(opcode: u8): Instruction {
        return this.opcodeTable[opcode]
    }
}

