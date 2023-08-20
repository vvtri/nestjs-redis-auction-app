/**
 * Generate random number in range, inclusive min, exclusive max
 */
export function genRandomNumber(min: number, max: number, isDecimal?: boolean) {
  let result = Math.random() * (max - min) + min;
  if (!isDecimal) result = Math.floor(result);
  return result;
}

/**
 * @param amount amount number to generate
 * @param min lower limit
 * @param max upper limit
 * @returns list of random unique numbers
 */

export function isNullOrUndefined(obj: any) {
  if (typeof obj === 'undefined' || obj === null) return true;
  return false;
}
