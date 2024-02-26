import axios from 'axios';

const urls = {
  test: 'https://api-douane-test.defense.bj',
  prod: 'https://api-concours.douanes.gouv.bj',
};

const mode: 'test' | 'prod' = 'prod';

export const api = axios.create({
  baseURL: urls[mode],
});

export function setApiToken(token: string) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
