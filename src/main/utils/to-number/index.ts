export const toNumber = (num: unknown): number =>
  isNaN(Number(num)) || Number(num) === 0 ? -1 : Number(num);
