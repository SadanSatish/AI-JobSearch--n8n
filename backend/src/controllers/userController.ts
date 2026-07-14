import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { UserRepository } from '../repositories/userRepository';
import { AppError } from '../middlewares/errorHandler';

export class UserController {
  static async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) return next(new AppError('Unauthorized', 401));

      const user = await UserRepository.findById(userId);
      if (!user) return next(new AppError('User not found', 404));

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            is_verified: user.is_verified,
            created_at: user.created_at
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
