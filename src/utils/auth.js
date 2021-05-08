import sha from 'sha.js';
import { HASH_ALGO, HASH_DIGEST } from '@/constants/auth';

export const hashPassword = password => {
  return sha(HASH_ALGO).update(password).digest(HASH_DIGEST);
};
