import dotenv from 'dotenv';
import { RecursiveKeyOf } from '../types/util.type';
dotenv.config();

const appConfig = {
  port: process.env.PORT || '5000',

  auth: {
    accessToken: {
      secret: process.env.AUTH_JWT_ACCESS_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRE,
    },

    refreshToken: {
      secret: process.env.AUTH_JWT_REFRESH_TOKEN_KEY,
      algorithm: 'HS256',
      expiresTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRE,
    },
  },

  redis: {
    standAlone: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
  },
};

export default appConfig;
export type AppConfig = Record<RecursiveKeyOf<typeof appConfig>, string>;
