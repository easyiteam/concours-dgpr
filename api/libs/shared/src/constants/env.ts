import { config } from 'dotenv';

config();

export const Env = {
  app: {
    port: process.env.APP_PORT,
  },
  openApi: {
    title: process.env.O_API_TITLE,
    description: process.env.O_API_DESCRIPTION,
    version: process.env.O_API_VERSION,
    baseUrl: process.env.O_API_BASE_URL,
  },
  email: {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  auth: {
    tokenSecret: process.env.AUTH_TOKEN_SECRET,
    tokenExpiration: +process.env.AUTH_TOKEN_EXPIRATION,
  },
  front: {
    baseUrl: process.env.FRONT_OFFICE_URL,
  },
  mode: process.env.APP_MODE,
};
