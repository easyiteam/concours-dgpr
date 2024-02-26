export function prefixWithZero(value: number) {
  if (value < 10) return '0' + value;
  return value + '';
}

export function getTwoDigitMonth() {
  const date = new Date();
  return prefixWithZero(date.getMonth() + 1);
}

export function getTwoDigitYear() {
  return new Date()
    .getFullYear()
    .toString()
    .split('')
    .reverse()
    .slice(0, 2)
    .reverse()
    .join('');
}

export function toDate(value: string) {
  const date = new Date(value);
  return `${date.getDate()}/${prefixWithZero(
    date.getMonth() + 1,
  )}/${date.getFullYear()}`;
}
