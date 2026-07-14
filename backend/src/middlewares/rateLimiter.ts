import rateLimit from 'express-rate-limit';
import { AppError } from './errorHandler';

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, 
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP, please try again in 15 minutes!', 429));
  }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login requests per hour
  standardHeaders: true, 
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many login attempts from this IP, please try again in an hour!', 429));
  }
});
