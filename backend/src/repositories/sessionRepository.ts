import { query } from '../config/db';

export interface Session {
  id: string;
  user_id: string;
  refresh_token_hash: string;
  ip_address?: string;
  user_agent?: string;
  expires_at: Date;
}

export class SessionRepository {
  static async create(
    userId: string, 
    refreshTokenHash: string, 
    expiresAt: Date, 
    ipAddress?: string, 
    userAgent?: string
  ): Promise<Session> {
    const result = await query(
      `INSERT INTO sessions (user_id, refresh_token_hash, expires_at, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, refreshTokenHash, expiresAt, ipAddress, userAgent]
    );
    return result.rows[0];
  }

  static async deleteByUserId(userId: string): Promise<void> {
    await query('DELETE FROM sessions WHERE user_id = $1', [userId]);
  }

  static async findByHash(hash: string): Promise<Session | null> {
    const result = await query('SELECT * FROM sessions WHERE refresh_token_hash = $1', [hash]);
    return result.rows[0] || null;
  }
}
