import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import connectDB from './config/db.js';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// -----------------------------------------------------------------------------
// Start Server with Database Connection
// -----------------------------------------------------------------------------
const startServer = async () => {
  try {
    // 1. Establish MongoDB Connection
    await connectDB();

    // 2. Start HTTP Listener
    const server = app.listen(PORT, () => {
      console.log(`\n==================================================`);
      console.log(`🚀 BeeSkilled Week 2 Backend Server Running!`);
      console.log(`🌐 Server Port: http://localhost:${PORT}`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`⚙️  Environment: ${NODE_ENV}`);
      console.log(`==================================================\n`);
    });

    // Graceful shutdown handling
    const handleShutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Initiating graceful shutdown...`);
      server.close(async () => {
        console.log('[Server] HTTP server closed.');
        try {
          await mongoose.connection.close(false);
          console.log('[Database] MongoDB connection closed.');
          process.exit(0);
        } catch (err) {
          console.error('[Database] Error during MongoDB disconnection:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  } catch (error) {
    console.error(`[Server] Fatal Error during server bootstrap: ${error.message}`);
    process.exit(1);
  }
};

startServer();
