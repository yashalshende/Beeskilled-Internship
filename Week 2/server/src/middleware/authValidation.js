const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates request payload for User Registration (POST /api/auth/register)
 */
export const validateRegister = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. JSON object expected.',
      data: null,
    });
  }

  let { name, email, password } = req.body;

  // Validate Name
  if (name === undefined || name === null) {
    return res.status(400).json({
      success: false,
      message: 'Name is required.',
      data: null,
    });
  }

  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long.',
      data: null,
    });
  }

  if (name.trim().length > 50) {
    return res.status(400).json({
      success: false,
      message: 'Name cannot exceed 50 characters.',
      data: null,
    });
  }

  // Validate Email
  if (email === undefined || email === null) {
    return res.status(400).json({
      success: false,
      message: 'Email is required.',
      data: null,
    });
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
      data: null,
    });
  }

  // Validate Password
  if (password === undefined || password === null) {
    return res.status(400).json({
      success: false,
      message: 'Password is required.',
      data: null,
    });
  }

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
      data: null,
    });
  }

  if (password.length > 72) {
    return res.status(400).json({
      success: false,
      message: 'Password cannot exceed 72 characters (bcrypt limit).',
      data: null,
    });
  }

  // Normalize inputs
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();

  next();
};

/**
 * Validates request payload for User Login (POST /api/auth/login)
 */
export const validateLogin = (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request body. JSON object expected.',
      data: null,
    });
  }

  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Email is required.',
      data: null,
    });
  }

  if (!EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address.',
      data: null,
    });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Password is required.',
      data: null,
    });
  }

  if (password.length > 72) {
    return res.status(400).json({
      success: false,
      message: 'Password cannot exceed 72 characters.',
      data: null,
    });
  }

  // Normalize email
  req.body.email = email.trim().toLowerCase();

  next();
};
