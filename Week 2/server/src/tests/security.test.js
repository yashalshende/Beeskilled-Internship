import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import User from '../models/User.js';
import Note from '../models/Note.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const TEST_PORT = 5096;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let server;
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

const request = async (path, options = {}) => {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    // If response has no JSON body
  }

  return {
    status: response.status,
    headers: response.headers,
    body,
  };
};

const runSecurityAuditTests = async () => {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  BeeSkilled Week 2 Security Hardening Verification    ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beeskilled_week2';
    await mongoose.connect(mongoURI);

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(TEST_PORT, resolve));
    console.log(`[Test Setup] Test server listening on ${BASE_URL}\n`);

    // -------------------------------------------------------------------------
    // Security Test 1: Helmet & Server Fingerprinting Headers
    // -------------------------------------------------------------------------
    console.log(`${colors.yellow}Security Test 1: Helmet Security Headers & Fingerprint Removal${colors.reset}`);
    {
      const res = await request('/api/health');
      assert(res.status === 200, 'Health endpoint responds 200 OK');
      assert(res.headers.get('x-powered-by') === null, 'X-Powered-By header is completely disabled');
      assert(res.headers.get('x-content-type-options') === 'nosniff', 'X-Content-Type-Options is nosniff');
      assert(Boolean(res.headers.get('x-frame-options')), 'X-Frame-Options clickjacking protection is set');
    }

    // -------------------------------------------------------------------------
    // Security Test 2: Bcrypt DoS Protection (> 72 char password rejection)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Security Test 2: Bcrypt DoS Protection (> 72 characters)${colors.reset}`);
    {
      const longPassword = 'A'.repeat(73);
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Security Test User',
          email: 'sec.user.longpass@beeskilled.com',
          password: longPassword,
        }),
      });

      assert(res.status === 400, `Excessive password length rejected with 400, got ${res.status}`);
      assert(res.body.success === false, 'Response success is false');
      assert(res.body.message.includes('72 characters'), 'Explains 72 character limit');
    }

    // -------------------------------------------------------------------------
    // Security Test 3: ReDoS & Regex Injection Resistance in Search Queries
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Security Test 3: ReDoS / Regex Injection Defense${colors.reset}`);
    {
      // Malicious regex pattern designed for catastrophic backtracking: (a+)+$
      const redosPayload = '(a+)+$';
      const startTime = Date.now();

      const res = await request(`/api/tasks?search=${encodeURIComponent(redosPayload)}`);
      const elapsedMs = Date.now() - startTime;

      assert(res.status === 200, `ReDoS payload handled cleanly without crashing, status ${res.status}`);
      assert(res.body.success === true, 'Response success is true');
      assert(elapsedMs < 500, `Query completed safely in ${elapsedMs}ms without CPU lockup`);
    }

    // -------------------------------------------------------------------------
    // Security Test 4: Malformed Token ID Handling (401 instead of 400 CastError)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Security Test 4: Malformed Token Payload User ID Handling${colors.reset}`);
    {
      // Token signed with malformed non-hex ID
      const malformedToken = jwt.sign(
        { id: 'not-a-valid-24-char-objectid' },
        process.env.JWT_SECRET,
        { algorithm: 'HS256', expiresIn: '1h' }
      );

      const res = await request('/api/notes', {
        headers: { Authorization: `Bearer ${malformedToken}` },
      });

      assert(res.status === 401, `Malformed token user ID returns 401 Unauthorized, got ${res.status}`);
      assert(res.body.success === false, 'Response success is false');
      assert(res.body.message.includes('Malformed user identity'), 'Clear auth failure message');
    }

    // -------------------------------------------------------------------------
    // Security Test 5: Verify Password Hashes Are NEVER Exposed
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Security Test 5: Password Hash Non-Disclosure${colors.reset}`);
    {
      const userPayload = {
        name: 'Hash Protection Check',
        email: 'hash.check@beeskilled.com',
        password: 'Password123!',
      };

      // 1. Register
      const regRes = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userPayload),
      });
      assert(regRes.status === 201, 'Registration succeeded');
      assert(regRes.body.data.user.password === undefined, 'Password absent from registration user object');
      assert(!JSON.stringify(regRes.body).includes('$2'), 'No bcrypt hash found in registration response body');

      // 2. Login
      const loginRes = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: userPayload.email,
          password: userPayload.password,
        }),
      });
      assert(loginRes.status === 200, 'Login succeeded');
      assert(loginRes.body.data.user.password === undefined, 'Password absent from login user object');
      assert(!JSON.stringify(loginRes.body).includes('$2'), 'No bcrypt hash found in login response body');

      // 3. Profile
      const token = loginRes.body.data.token;
      const profileRes = await request('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      assert(profileRes.status === 200, 'Profile succeeded');
      assert(profileRes.body.data.user.password === undefined, 'Password absent from profile user object');
      assert(!JSON.stringify(profileRes.body).includes('$2'), 'No bcrypt hash found in profile response body');

      // Clean up
      await User.deleteOne({ email: userPayload.email });
    }

    // -------------------------------------------------------------------------
    // Security Test 6: Cross-User Note Authorization & Unauthorized Rejections
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Security Test 6: Cross-User Authorization Verification${colors.reset}`);
    {
      // Create user 1 & user 2
      const u1 = await User.create({
        name: 'U1',
        email: 'u1.sec@beeskilled.com',
        password: 'Password123!',
      });
      const u2 = await User.create({
        name: 'U2',
        email: 'u2.sec@beeskilled.com',
        password: 'Password123!',
      });

      const token1 = jwt.sign({ id: u1._id.toString() }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
      const token2 = jwt.sign({ id: u2._id.toString() }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });

      // U1 creates note
      const noteRes = await request('/api/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token1}` },
        body: JSON.stringify({ title: 'U1 Secret Note', content: 'Secret Content' }),
      });
      const noteId = noteRes.body.data.id;

      // U2 attempts access -> 403 Forbidden
      const u2Get = await request(`/api/notes/${noteId}`, {
        headers: { Authorization: `Bearer ${token2}` },
      });
      assert(u2Get.status === 403, `U2 access to U1 note returns 403 Forbidden, got ${u2Get.status}`);

      // Unauthenticated access -> 401 Unauthorized
      const noAuthGet = await request(`/api/notes/${noteId}`);
      assert(noAuthGet.status === 401, `No auth token returns 401 Unauthorized, got ${noAuthGet.status}`);

      // Clean up
      await Note.deleteOne({ _id: noteId });
      await User.deleteMany({ _id: { $in: [u1._id, u2._id] } });
    }

    // Summary
    console.log(`\n${colors.bold}${colors.green}======================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.green}  ✓ ALL ${totalTests} SECURITY AUDIT ASSERTIONS PASSED! (${passedCount}/${totalTests})${colors.reset}`);
    console.log(`${colors.bold}${colors.green}======================================================${colors.reset}\n`);

  } catch (err) {
    console.error(`\n${colors.bold}${colors.red}Security Test Suite FAILED with error:${colors.reset}`, err);
    process.exitCode = 1;
  } finally {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
    await mongoose.connection.close(false);
  }
};

runSecurityAuditTests();
