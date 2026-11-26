import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import healthRoutes from './routes/health.routes.js';
import { notFoundMiddleware } from './middleware/notFound.middleware.js';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware.js';

const app = express();

// Global middleware
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', healthRoutes);

// 404 handler for undefined routes
app.use(notFoundMiddleware);

// Centralized error handler
app.use(errorHandlerMiddleware);

export default app;
