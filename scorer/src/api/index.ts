import axios from 'axios';

const urls = {
  test: 'http://localhost:7020',
  prod: 'https://api-concours.dgefc.bj',
};

const mode: 'test' | 'prod' = 'prod';

export const api = axios.create({
  baseURL: urls[mode],
});

export function setApiToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
