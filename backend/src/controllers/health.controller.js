import { env } from '../config/env.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getHealth = (req, res) => {
  return ApiResponse.success(res, {
    statusCode: 200,
    message: 'CareMate API is operational',
    data: {
      environment: env.NODE_ENV,
    },
  });
};
