export type u8 = number;    // 0–255
export type u16 = number;   // 0–65535
export type u32 = number;
export type u64 = number;


/**
 * Checks if the n bits is turned on in a
 * @param a the checked value
 * @param n the n-th bit to check
 * @returns 
 */
export function BIT(a: number, n: number): boolean {
  return (a & (1 << n)) !== 0;
}

/**
 * Turn on or off the n-th bit
 * @param a 
 * @param n 
 * @param on 
 * @returns 
 */
export function BIT_SET(a: number, n: number, on: boolean): number {
  return on ? (a | (1 << n)) : (a & ~(1 << n));
}


/**
 * check if a is in between b and c 
 * @param a 
 * @param b 
 * @param c 
 * @returns 
 */
export function BETWEEN(a: number, b: number, c: number): boolean {
  return a >= b && a <= c;
}



/**
 * delay in milliseconds
 * @param ms 
 * @returns 
 */
export function delay(ms: u32): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
