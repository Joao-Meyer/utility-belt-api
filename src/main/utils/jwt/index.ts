import type { UserTokenInput } from '@domain/token';
import { env } from '@main/config/env';
import { sign } from 'jsonwebtoken';

export const removeBearer = (accessToken: string): string | null => {
  const [Bearer, hash] = accessToken.split(' ');

  if (Bearer === 'Bearer') return hash;

  return null;
};

export const incrementBearer = (token: string): string => `Bearer ${token}`;

interface generateTokenOutput {
  accessToken: string;
}

export const generateToken = (data: UserTokenInput): generateTokenOutput => {
  const { EXPIRES_IN, SECRET } = env.JWT;

  return { accessToken: sign(data, SECRET, { expiresIn: EXPIRES_IN }) };
};
