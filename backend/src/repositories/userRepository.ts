import { query } from '../config/db';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export class UserRepository {
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(email: string, passwordHash: string): Promise<User> {
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
      [email, passwordHash]
    );
    return result.rows[0];
  }

  static async updateLastLogin(id: string): Promise<void> {
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [id]);
  }
}
