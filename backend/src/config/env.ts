import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load from root .env
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  
  DB_POSTGRESDB_HOST: z.string(),
  DB_POSTGRESDB_PORT: z.string().default('5432'),
  DB_POSTGRESDB_DATABASE: z.string(),
  DB_POSTGRESDB_USER: z.string(),
  DB_POSTGRESDB_PASSWORD: z.string(),

  JWT_SECRET: z.string().default('fallback_secret_do_not_use_in_prod'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  N8N_WEBHOOK_URL: z.string().default('http://localhost:5678'),
  
  STORAGE_PROVIDER: z.enum(['local', 's3', 'r2']).default('local'),
  S3_ENDPOINT: z.string().optional(),
  S3_REGION: z.string().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY_ID: z.string().optional(),
  S3_SECRET_ACCESS_KEY: z.string().optional(),

  OPENROUTER_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  QDRANT_URL: z.string().optional(),
  QDRANT_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}

export const config = parsedEnv.data;
