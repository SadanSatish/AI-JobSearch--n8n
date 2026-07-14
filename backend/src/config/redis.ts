import Redis from 'ioredis';
import { config } from './env';
import { logger } from './logger';

let redisClient = null;
try {
  if (config.REDIS_URL && config.REDIS_URL.trim() !== '') {
    redisClient = new Redis(config.REDIS_URL);
  }
} catch (error) {
  logger.warn('Failed to parse REDIS_URL', { error });
}

export const redis = redisClient;

if (redis) {
  redis.on('connect', () => {
    logger.info('Connected to Redis');
  });

  redis.on('error', (err) => {
    logger.error('Redis connection error', { error: err.message });
  });
} else {
  logger.warn('REDIS_URL not provided, caching will be disabled');
}
