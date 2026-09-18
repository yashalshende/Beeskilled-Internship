import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import healthRoutes from './routes/healthRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Initialize Express application
const app = express();

// Security: Disable X-Powered-By header to prevent fingerprinting
app.disable('x-powered-by');

// -----------------------------------------------------------------------------
// Core Security & Request Middlewares
// -----------------------------------------------------------------------------

// Set HTTP security headers via Helmet
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS) with configurable origin
const corsOrigin = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*';
app.use(cors({
  origin: corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Content-Type-Options', 'X-Frame-Options'],
}));

// Body parsing middlewares
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate Limiter for Authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  skip: () => process.env.NODE_ENV === 'test', // Bypass in test suite to avoid false positive 429s
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
    data: null,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// -----------------------------------------------------------------------------
// Root & Health Check Routes
// -----------------------------------------------------------------------------

// Welcome / API Documentation route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to BeeSkilled Week 2 Backend API (MERN)',
    author: 'Yashal Sharadrao Shende',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health',
      tasks: {
        create: 'POST /api/tasks',
        getAll: 'GET /api/tasks',
        getById: 'GET /api/tasks/:id',
        update: 'PUT /api/tasks/:id',
        delete: 'DELETE /api/tasks/:id',
      },
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile (Bearer token required)',
      },
      notes: {
        create: 'POST /api/notes (Bearer token required)',
        getAll: 'GET /api/notes (Bearer token required)',
        getById: 'GET /api/notes/:id (Bearer token required)',
        update: 'PUT /api/notes/:id (Bearer token required)',
        delete: 'DELETE /api/notes/:id (Bearer token required)',
      },
    },
  });
});

// Mount Health Check & Application Routes
app.use('/api', healthRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/notes', noteRoutes);

// -----------------------------------------------------------------------------
// Error Handling Middlewares
// -----------------------------------------------------------------------------

// 404 handler for unknown routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;
