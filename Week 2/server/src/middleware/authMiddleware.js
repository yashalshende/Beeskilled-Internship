import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

/**
 * Middleware to protect routes and verify JWT Bearer tokens.
 * Extracts user ID from token payload, retrieves safe user info, and attaches to req.user.
 */
export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check for presence of Authorization header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No authentication token provided.',
        data: null,
      });
    }

    // 2. Validate "Bearer <token>" structure
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: "Malformed authorization header. Expected format: 'Bearer <token>'.",
        data: null,
      });
    }

    const token = parts[1];

    // 3. Verify token signature and expiration
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Authentication token has expired. Please log in again.',
          data: null,
        });
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token. Verification failed.',
        data: null,
      });
    }

    // 4. Extract user ID and validate format
    if (
      !decoded ||
      !decoded.id ||
      typeof decoded.id !== 'string' ||
      !/^[0-9a-fA-F]{24}$/.test(decoded.id)
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token. Malformed user identity.',
        data: null,
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. User no longer exists.',
        data: null,
      });
    }

    // 5. Attach user document to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Optional Authentication Middleware
 * If an Authorization header is provided, verifies token and attaches req.user.
 * If absent, gracefully continues as unauthenticated (guest) request.
 */
export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  // If token is provided, delegate to authMiddleware
  return authMiddleware(req, res, next);
};

export default authMiddleware;
