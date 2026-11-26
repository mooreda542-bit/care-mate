import { env } from '../config/env.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Centralized error handling middleware
export const errorHandlerMiddleware = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected server error occurred';

  // Log server errors internally without exposing stack traces to clients in production
  if (statusCode >= 500) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  const responsePayload = {
    statusCode,
    message,
  };

  // Provide stack trace only in development environment
  if (env.NODE_ENV === 'development' && err.stack) {
    responsePayload.errors = { stack: err.stack };
  }

  return ApiResponse.error(res, responsePayload);
};
