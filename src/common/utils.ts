import { PaginationReqDto } from './dtos/pagination.dto';

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

export const chunk = <T>(input: T[], size: number): T[][] => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
};

/**
 * @param time delay time, in miliseconds
 */
export const sleep = (time: number) => {
  return new Promise<void>((res) => {
    setTimeout(() => {
      res();
    }, time);
  });
};

export const getOffsetAndCount = ({ limit, page }: PaginationReqDto) => {
  const offset = (page - 1) * limit;
  const count = limit;

  return { offset, count };
};
