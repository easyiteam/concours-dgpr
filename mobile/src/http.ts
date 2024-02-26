import { SERVER_URL } from './environment';
import { Storage } from '@capacitor/storage';

const storageKey = '__auth_token__';
export class Auth {
  static token = '';

  static async setToken(token: string) {
    await Storage.set({ key: storageKey, value: token });
    Auth.token = token;
  }

  static async headers() {
    if (!Auth.token) {
      const data = await Storage.get({ key: storageKey });
      if (!data.value) return undefined;
      Auth.token = data.value;
    }
    console.log(Auth.token, 'token');
    return { headers: { Authorization: `Bearer ${Auth.token}` } };
  }
}

const jsonify = (
  method: string,
  body: any,
  headers?: Record<string, string>,
) => {
  console.log(headers, 'headers');
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ? { ...headers } : {}),
    },
    body: JSON.stringify(body),
  };
};

const http = {
  get: async (route: string) =>
    await fetch(SERVER_URL + route, await Auth.headers()).then((r) => r.json()),
  post: async (route: string, data: any) =>
    await fetch(
      SERVER_URL + route,
      jsonify('POST', data, (await Auth.headers())?.headers),
    ).then((r) => r.json()),
  put: async (route: string, data: any) =>
    await fetch(
      SERVER_URL + route,
      jsonify('PUT', data, (await Auth.headers())?.headers),
    ).then((r) => r.json()),
  patch: async (route: string, data: any) =>
    await fetch(
      SERVER_URL + route,
      jsonify('PATCH', data, (await Auth.headers())?.headers),
    ).then((r) => r.json()),
  delete: async (route: string) =>
    await fetch(SERVER_URL + route, {
      method: 'DELETE',
      ...(await Auth.headers()),
    }).then((r) => r.json()),
};

export default http;
