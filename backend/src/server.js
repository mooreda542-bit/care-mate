import app from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`[CareMate Server] Running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
  console.log(`[CareMate Server] Health check available at http://localhost:${env.PORT}/api/health`);
});

// Graceful shutdown handling
let isShuttingDown = false;

const handleGracefulShutdown = (signal) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`[CareMate Server] ${signal} signal received. Closing HTTP server...`);
  server.close(() => {
    console.log('[CareMate Server] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('[CareMate Server] Unhandled Promise Rejection:', reason);
});
