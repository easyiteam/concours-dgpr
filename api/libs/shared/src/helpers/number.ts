import { customAlphabet } from 'nanoid';

export function prefixWithZeros(value: number) {
  if (value < 10) return '000' + value;
  if (value < 100) return '00' + value;
  if (value < 1000) return '0' + value;
  return value + '';
}

export function randomNumber(size: number) {
  return customAlphabet('1234567890', size)();
}
