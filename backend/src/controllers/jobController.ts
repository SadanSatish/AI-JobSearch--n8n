import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { query } from '../config/db';

export class JobController {
  static async getJobs(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.query;
      let sql = 'SELECT * FROM saved_jobs WHERE user_id = $1';
      const params: any[] = [req.user!.id];
      
      if (status) {
        sql += ' AND status = $2';
        params.push(status);
      }
      
      const result = await query(sql, params);
      res.status(200).json({ status: 'success', data: result.rows });
    } catch (error) {
      next(error);
    }
  }
}
