import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as any
  });
};

export const generateRefreshToken = (): string => {
  // Simple cryptographically secure random string could also be used (e.g. crypto.randomBytes)
  // For simplicity, we use jwt here with a different secret or no payload.
  // Actually, standard practice for refresh tokens:
  return require('crypto').randomBytes(40).toString('hex');
};
