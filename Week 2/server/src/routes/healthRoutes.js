import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    API Health Check & Environment Status
 * @access  Public
 */
router.get('/health', (req, res) => {
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const dbState = mongoose.connection.readyState;
  const dbStatus = dbStatusMap[dbState] || 'Unknown';

  res.status(200).json({
    success: true,
    status: 200,
    message: 'BeeSkilled Week 2 Backend API is healthy and operational.',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      host: mongoose.connection.host || '127.0.0.1',
      name: mongoose.connection.name || 'beeskilled_week2',
    },
  });
});

export default router;
