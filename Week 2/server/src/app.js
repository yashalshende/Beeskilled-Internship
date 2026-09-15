import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/healthRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Initialize Express application
const app = express();

// -----------------------------------------------------------------------------
// Core Middlewares
// -----------------------------------------------------------------------------

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
      todos: 'Assignment 1 (Upcoming)',
      auth: 'Assignment 2 (Upcoming)',
      notes: 'Mini Project (Upcoming)',
    },
  });
});

// Mount Health Check
app.use('/api', healthRoutes);

// -----------------------------------------------------------------------------
// Error Handling Middlewares
// -----------------------------------------------------------------------------

// 404 handler for unknown routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

export default app;
