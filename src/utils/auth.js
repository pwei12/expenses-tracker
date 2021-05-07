import { setCookie } from 'nookies';
import sha from 'sha.js';
import {
  COOKIE_NAME,
  COOKIE_AGE,
  HASH_ALGO,
  HASH_DIGEST
} from '@/constants/auth';

const ALLOWED_PATH = '/';

export const setLoginCookie = (token, ctx) => {
  setCookie(ctx, COOKIE_NAME, token, {
    maxAge: COOKIE_AGE,
    path: ALLOWED_PATH
  });
};

export const hashPassword = password => {
  return sha(HASH_ALGO).update(password).digest(HASH_DIGEST);
};
