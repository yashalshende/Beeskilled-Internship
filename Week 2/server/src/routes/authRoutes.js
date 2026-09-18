import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../middleware/authValidation.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
router.post('/register', validateRegister, register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and obtain JWT token
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, getProfile);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile (alias for /profile)
 * @access  Private
 */
router.get('/me', authMiddleware, getProfile);

export default router;
