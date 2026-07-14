import { Pool } from 'pg';
import { config } from './env';
import { logger } from './logger';

export const dbPool = new Pool({
  host: config.DB_POSTGRESDB_HOST,
  port: parseInt(config.DB_POSTGRESDB_PORT, 10),
  database: config.DB_POSTGRESDB_DATABASE,
  user: config.DB_POSTGRESDB_USER,
  password: config.DB_POSTGRESDB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: config.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

dbPool.on('error', (err) => {
  logger.error('Unexpected error on idle DB client', { error: err.message });
  process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await dbPool.query(text, params);
  const duration = Date.now() - start;
  logger.debug('Executed query', { text, duration, rows: res.rowCount });
  return res;
};
