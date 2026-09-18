/**
 * Centralized Error & 404 Handling Middleware
 */

/**
 * Handle requests to non-existent endpoints (404 Not Found)
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource not found: ${req.method} ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Centralized Application Error Handler
 * Formats errors uniformly across all Express routes
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = 'Internal Server Error';

  // Log error internally for server-side diagnosis
  console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  // Handle Mongoose Invalid ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ID format: '${err.value}'.`;
  }
  // Handle Mongoose Schema Validation Error
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    const validationErrors = Object.values(err.errors).map((e) => e.message);
    message = `Validation Error: ${validationErrors.join(', ')}`;
  }
  // Handle MongoDB Duplicate Key Error (Code 11000)
  else if (err.code === 11000) {
    statusCode = 400;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate value entered for ${duplicatedField}. Must be unique.`;
  }
  // Handle JWT Malformed Token Error
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  }
  // Handle JWT Expired Token Error
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }
  // Handle JSON parse errors in request body
  else if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload in request body.';
  }
  // Catch-all for MongoDB / Mongoose connection or operational failures
  else if (
    err.name === 'MongoServerSelectionError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongooseError' ||
    err.name === 'MongoTopologyClosedError' ||
    err.name === 'MongooseServerSelectionError'
  ) {
    statusCode = 500;
    message = 'Database service encountered an error. Please try again later.';
  }
  // General custom/application errors
  else if (err.message && statusCode !== 500) {
    message = err.message;
  } else {
    // 500 errors should never expose raw database or internal exception messages
    statusCode = 500;
    message = 'An internal server error occurred while processing your request.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

export default { notFound, errorHandler };
