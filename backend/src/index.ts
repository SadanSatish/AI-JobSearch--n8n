import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { globalLimiter } from './middlewares/rateLimiter';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import systemRoutes from './routes/systemRoutes';
import aiRoutes from './routes/aiRoutes';
import agentRoutes from './routes/agentRoutes';
import jobRoutes from './routes/jobRoutes';

const app = express();

// Security and utility middlewares
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'test') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(globalLimiter);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/health', systemRoutes); // Legacy fallback

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global Error Handler
app.use(errorHandler);

const port = config.PORT;

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Backend API running on port ${port} in ${config.NODE_ENV} mode`);
  });
}

export default app;
