import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

dotenv.config();

const TEST_PORT = 5098;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

// Color formatting for console test output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let server;
let validAuthToken;
let registeredUserId;
let passedCount = 0;
let totalTests = 0;

const assert = (condition, message) => {
  totalTests++;
  if (!condition) {
    console.error(`  ${colors.red}✗ FAIL:${colors.reset} ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedCount++;
  console.log(`  ${colors.green}✓ PASS:${colors.reset} ${message}`);
};

/**
 * Helper to make HTTP requests using native fetch
 */
const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const body = await response.json();
  return {
    status: response.status,
    headers: response.headers,
    body,
  };
};

/**
 * Run Auth Test Suite
 */
const runAuthTestSuite = async () => {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  BeeSkilled Week 2 Assignment 2: Auth REST API Tests ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

  try {
    // 1. Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beeskilled_week2';
    await mongoose.connect(mongoURI);
    console.log(`[Test Setup] Connected to MongoDB: ${mongoose.connection.name}`);

    // Clean up test users
    await User.deleteMany({ email: { $regex: /test\.user|auth\.test/ } });

    // 2. Start HTTP Test Server
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(TEST_PORT, resolve));
    console.log(`[Test Setup] Test server listening on ${BASE_URL}\n`);

    const testUser = {
      name: 'Yashal Shende',
      email: 'test.user@beeskilled.com',
      password: 'SecurePassword123!',
    };

    // -------------------------------------------------------------------------
    // Test 1: Successful Registration
    // -------------------------------------------------------------------------
    console.log(`${colors.yellow}Test 1: Successful Registration (POST /api/auth/register)${colors.reset}`);
    {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(testUser),
      });

      assert(res.status === 201, `Expected status 201 Created, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(res.body.message === 'User registered successfully', 'Response message matches');
      assert(Boolean(res.body.data && res.body.data.token), 'Response returns signed JWT token');
      assert(res.body.data.user.name === testUser.name, 'Returned user name matches');
      assert(res.body.data.user.email === testUser.email, 'Returned user email matches');
      assert(res.body.data.user.password === undefined, 'Password is NOT exposed in user object');
      assert(res.body.data.password === undefined, 'Password is NOT exposed in response root');
      assert(Boolean(res.body.data.user.id), 'User ID is present in response');

      validAuthToken = res.body.data.token;
      registeredUserId = res.body.data.user.id;

      // Verify directly in MongoDB that password was salted and hashed
      const storedUser = await User.findById(registeredUserId).select('+password');
      assert(storedUser.password !== testUser.password, 'Password in MongoDB is not plaintext');
      assert(storedUser.password.startsWith('$2'), 'Password hash uses bcrypt format ($2a / $2b)');
    }

    // -------------------------------------------------------------------------
    // Test 2: Duplicate Registration
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 2: Duplicate Registration rejection${colors.reset}`);
    {
      // Attempt registration with identical email (uppercase to test normalization)
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Another Name',
          email: 'TEST.USER@BEESKILLED.COM',
          password: 'AnotherPassword456!',
        }),
      });

      assert(res.status === 400, `Expected status 400 Bad Request, got ${res.status}`);
      assert(res.body.success === false, 'Response success should be false');
      assert(
        res.body.message === 'A user with this email address already exists.',
        'Clear error message rejecting duplicate email'
      );
    }

    // -------------------------------------------------------------------------
    // Test 3: Successful Login
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 3: Successful Login (POST /api/auth/login)${colors.reset}`);
    {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'TEST.USER@BEESKILLED.COM', // Verify email normalization on login
          password: testUser.password,
        }),
      });

      assert(res.status === 200, `Expected status 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(res.body.message === 'Login successful', 'Response message matches');
      assert(Boolean(res.body.data && res.body.data.token), 'Login returns new signed JWT token');
      assert(res.body.data.user.email === testUser.email, 'User email matches');
      assert(res.body.data.user.password === undefined, 'Password hash is NOT exposed in login response');

      // Update validAuthToken from successful login
      validAuthToken = res.body.data.token;
    }

    // -------------------------------------------------------------------------
    // Test 4: Wrong Password
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 4: Wrong Password rejection${colors.reset}`);
    {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: testUser.email,
          password: 'IncorrectPassword999!',
        }),
      });

      assert(res.status === 401, `Expected status 401 Unauthorized, got ${res.status}`);
      assert(res.body.success === false, 'Response success should be false');
      assert(res.body.message === 'Invalid email or password.', 'Generic error message prevents enumeration');
    }

    // -------------------------------------------------------------------------
    // Test 5: Unknown Email
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 5: Unknown Email rejection${colors.reset}`);
    {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'nonexistent.user@beeskilled.com',
          password: 'SomePassword123!',
        }),
      });

      assert(res.status === 401, `Expected status 401 Unauthorized, got ${res.status}`);
      assert(res.body.success === false, 'Response success should be false');
      assert(
        res.body.message === 'Invalid email or password.',
        'Generic error message matches wrong-password error'
      );
    }

    // -------------------------------------------------------------------------
    // Test 6: Malformed Requests
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 6: Malformed Requests validation${colors.reset}`);
    {
      // Missing fields on register
      const emptyBodyRes = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      assert(emptyBodyRes.status === 400, `Empty register body returns 400, got ${emptyBodyRes.status}`);
      assert(emptyBodyRes.body.success === false, 'Empty body success is false');

      // Invalid email format
      const invalidEmailRes = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Valid Name',
          email: 'not-a-valid-email',
          password: 'ValidPassword123!',
        }),
      });
      assert(invalidEmailRes.status === 400, `Invalid email returns 400, got ${invalidEmailRes.status}`);
      assert(invalidEmailRes.body.message === 'Please provide a valid email address.', 'Email format error message');

      // Password too short (< 6 chars)
      const shortPasswordRes = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Valid Name',
          email: 'auth.test.short@beeskilled.com',
          password: '123',
        }),
      });
      assert(shortPasswordRes.status === 400, `Short password returns 400, got ${shortPasswordRes.status}`);
      assert(
        shortPasswordRes.body.message === 'Password must be at least 6 characters long.',
        'Password length error message'
      );

      // Name too short (< 2 chars)
      const shortNameRes = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'A',
          email: 'auth.test.shortname@beeskilled.com',
          password: 'ValidPassword123!',
        }),
      });
      assert(shortNameRes.status === 400, `Short name returns 400, got ${shortNameRes.status}`);
    }

    // -------------------------------------------------------------------------
    // Test 7: Missing Token (Protected Route)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 7: Missing Token on Protected Route (GET /api/auth/profile)${colors.reset}`);
    {
      const res = await request('/api/auth/profile');

      assert(res.status === 401, `Missing token returns 401 Unauthorized, got ${res.status}`);
      assert(res.body.success === false, 'Response success should be false');
      assert(
        res.body.message === 'Access denied. No authentication token provided.',
        'Clear message indicating missing token'
      );
    }

    // -------------------------------------------------------------------------
    // Test 8: Invalid / Malformed Token
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 8: Invalid or Malformed Token${colors.reset}`);
    {
      // Malformed header (missing 'Bearer' prefix)
      const malformedHeaderRes = await request('/api/auth/profile', {
        headers: { Authorization: 'Basic dXNlcjpwYXNz' },
      });
      assert(malformedHeaderRes.status === 401, `Malformed header returns 401, got ${malformedHeaderRes.status}`);
      assert(malformedHeaderRes.body.message.includes('Malformed authorization header'), 'Explains Bearer format');

      // Tampered / garbage token
      const invalidTokenRes = await request('/api/auth/profile', {
        headers: { Authorization: 'Bearer this.is.a.completely.invalid.token' },
      });
      assert(invalidTokenRes.status === 401, `Invalid token returns 401, got ${invalidTokenRes.status}`);
      assert(
        invalidTokenRes.body.message === 'Invalid authentication token. Verification failed.',
        'Explains token verification failure'
      );
    }

    // -------------------------------------------------------------------------
    // Test 9: Expired Token
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 9: Expired Token rejection${colors.reset}`);
    {
      // Mint a token that expired 5 seconds ago
      const expiredToken = generateToken(registeredUserId, { expiresIn: '-5s' });

      const res = await request('/api/auth/profile', {
        headers: { Authorization: `Bearer ${expiredToken}` },
      });

      assert(res.status === 401, `Expired token returns 401 Unauthorized, got ${res.status}`);
      assert(res.body.success === false, 'Response success should be false');
      assert(
        res.body.message === 'Authentication token has expired. Please log in again.',
        'Clear message indicating token expiration'
      );
    }

    // -------------------------------------------------------------------------
    // Bonus Verification: Authenticated Profile Access with Valid Token
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Verification: Authenticated Profile Access with Valid Token${colors.reset}`);
    {
      const res = await request('/api/auth/profile', {
        headers: { Authorization: `Bearer ${validAuthToken}` },
      });

      assert(res.status === 200, `Valid token returns 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(res.body.data.user.id === registeredUserId, 'Profile user ID matches');
      assert(res.body.data.user.email === testUser.email, 'Profile user email matches');
      assert(res.body.data.user.password === undefined, 'Password is NOT exposed on profile');
    }

    // Summary
    console.log(`\n${colors.bold}${colors.green}======================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.green}  ✓ ALL ${totalTests} AUTH ASSERTIONS PASSED SUCCESSFULLY! (${passedCount}/${totalTests})${colors.reset}`);
    console.log(`${colors.bold}${colors.green}======================================================${colors.reset}\n`);

  } catch (err) {
    console.error(`\n${colors.bold}${colors.red}Auth Test Suite FAILED with error:${colors.reset}`, err);
    process.exitCode = 1;
  } finally {
    // Teardown
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.connection.close(false);
    console.log('[Test Teardown] Server closed and MongoDB disconnected.\n');
  }
};

runAuthTestSuite();
