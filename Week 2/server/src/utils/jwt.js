import jwt from 'jsonwebtoken';

/**
 * Generates a signed JSON Web Token with minimal user identity payload.
 *
 * @param {string} userId - The MongoDB user ID
 * @param {object} [customOptions={}] - Optional overrides (e.g. expiresIn for testing)
 * @returns {string} - Signed JWT token string
 */
export const generateToken = (userId, customOptions = {}) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing. Server security is compromised.');
  }

  const expiresIn = customOptions.expiresIn || process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    { id: userId },
    secret,
    {
      algorithm: 'HS256',
      expiresIn,
      ...customOptions,
    }
  );
};

/**
 * Verifies a JSON Web Token against JWT_SECRET.
 * Explicitly restricts algorithm to HS256 to prevent algorithm confusion attacks.
 *
 * @param {string} token - The JWT string to verify
 * @returns {object} - Decoded token payload
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is missing.');
  }

  return jwt.verify(token, secret, {
    algorithms: ['HS256'],
  });
};

export default {
  generateToken,
  verifyToken,
};
