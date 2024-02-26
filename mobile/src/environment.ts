const mode = 'dev';

const server_url = {
  dev: 'http://localhost:7020/',
  prod: 'https://api-concours.dgefc.bj/',
};

export const SERVER_URL = server_url[mode];

export function prefixWithZero(value: number) {
  if (value < 10) return '0' + value;
  return value + '';
}

export function formatDate(date: string) {
  const _date = new Date(date);
  return `${prefixWithZero(_date.getDate())}/${prefixWithZero(
    _date.getMonth() + 1,
  )}/${_date.getFullYear()}`;
}
