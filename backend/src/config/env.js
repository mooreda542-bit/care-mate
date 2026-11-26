import dotenv from 'dotenv';

// Load environment variables from .env if present
dotenv.config();

const portNumber = parseInt(process.env.PORT, 10);

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: !isNaN(portNumber) && portNumber > 0 ? portNumber : 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
