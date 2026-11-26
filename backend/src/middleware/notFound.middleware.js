import { ApiResponse } from '../utils/ApiResponse.js';

export const notFoundMiddleware = (req, res) => {
  return ApiResponse.error(res, {
    statusCode: 404,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
};
