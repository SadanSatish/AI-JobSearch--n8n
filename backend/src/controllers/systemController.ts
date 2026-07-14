import { Request, Response } from 'express';
import { query } from '../config/db';

export class SystemController {
  static async getHealth(req: Request, res: Response) {
    let dbStatus = 'disconnected';
    try {
      await query('SELECT 1');
      dbStatus = 'connected';
    } catch (e) {
      dbStatus = 'error';
    }

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      services: {
        api: 'connected',
        database: dbStatus
      }
    });
  }

  static getVersion(req: Request, res: Response) {
    res.status(200).json({
      status: 'success',
      data: {
        version: '1.0.0',
        environment: process.env.NODE_ENV
      }
    });
  }
}
