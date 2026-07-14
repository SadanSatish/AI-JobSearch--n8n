import { Request, Response, NextFunction } from 'express';
import argon2 from 'argon2';
import crypto from 'crypto';
import { z } from 'zod';
import { UserRepository } from '../repositories/userRepository';
import { SessionRepository } from '../repositories/sessionRepository';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { AppError } from '../middlewares/errorHandler';
import { logger } from '../config/logger';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = registerSchema.parse(req.body);

      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        return next(new AppError('Email already in use', 400));
      }

      const passwordHash = await argon2.hash(password);
      const user = await UserRepository.create(email, passwordHash);

      logger.info('User registered', { userId: user.id });

      res.status(201).json({
        status: 'success',
        message: 'Registration successful',
        data: {
          user: { id: user.id, email: user.email, role: user.role }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(req.body);

      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return next(new AppError('Invalid email or password', 401));
      }

      const validPassword = await argon2.verify(user.password_hash, password);
      if (!validPassword) {
        return next(new AppError('Invalid email or password', 401));
      }

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken();
      const refreshTokenHash = await argon2.hash(refreshToken);

      // Store session
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await SessionRepository.create(user.id, refreshTokenHash, expiresAt, req.ip, req.headers['user-agent']);

      await UserRepository.updateLastLogin(user.id);

      // Set refresh token in HttpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      logger.info('User logged in', { userId: user.id });

      res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          user: { id: user.id, email: user.email, role: user.role }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // In a real app we'd get the user ID from the access token or refresh token cookie
      // For simplicity, we just clear the cookie. (If using access token, we clear all their sessions or just this one).
      res.clearCookie('refreshToken');
      res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }
}
