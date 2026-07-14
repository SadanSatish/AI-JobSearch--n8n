import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid input data',
      errors: err.errors
    });
    return;
  }

  // Unexpected errors
  logger.error('Unhandled Exception', { error: err.message, stack: err.stack, path: req.path });
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
};
