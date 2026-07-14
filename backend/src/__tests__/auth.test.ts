import request from 'supertest';
import app from '../index';
import { UserRepository } from '../repositories/userRepository';
import argon2 from 'argon2';

jest.mock('../repositories/userRepository');
jest.mock('../repositories/sessionRepository');
jest.mock('../config/db', () => ({
  query: jest.fn(),
  dbPool: { on: jest.fn() }
}));

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
      (UserRepository.create as jest.Mock).mockResolvedValue({
        id: 'test-uuid',
        email: 'test@example.com',
        role: 'user'
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should fail if email is already in use', async () => {
      (UserRepository.findByEmail as jest.Mock).mockResolvedValue({ id: 'existing' });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Email already in use');
    });
  });
});
