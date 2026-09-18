import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

// Pre-computed valid dummy bcrypt hash to equalize response latency and prevent user enumeration timing attacks
const DUMMY_BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if user already exists with normalized email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.',
        data: null,
      });
    }

    // 2. Create user (password is automatically hashed via Mongoose pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
    });

    // 3. Generate signed JWT token
    const token = generateToken(user._id);

    // 4. Return safe response (password hash is stripped by User model toJSON)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email and explicitly select password field for comparison
    const user = await User.findOne({ email }).select('+password');

    // 2. Perform constant-time password comparison to prevent timing enumeration
    const targetHash = user ? user.password : DUMMY_BCRYPT_HASH;
    const isMatch = await bcrypt.compare(password, targetHash);

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
        data: null,
      });
    }

    // 3. Generate signed JWT token
    const token = generateToken(user._id);

    // 4. Return token and safe user info
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently authenticated user's profile
 * @route   GET /api/auth/profile, GET /api/auth/me
 * @access  Private (Requires authMiddleware)
 */
export const getProfile = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};
