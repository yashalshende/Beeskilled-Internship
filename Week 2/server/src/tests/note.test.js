import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import User from '../models/User.js';
import Note from '../models/Note.js';

dotenv.config();

const TEST_PORT = 5097;
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
let userAToken;
let userAId;
let userBToken;
let userBId;
let noteAId;
let noteA2Id;

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
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const body = await response.json();
  return {
    status: response.status,
    headers: response.headers,
    body,
  };
};

/**
 * Run Notes Test Suite
 */
const runNotesTestSuite = async () => {
  console.log(`\n${colors.bold}${colors.cyan}======================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  BeeSkilled Week 2 Mini Project: Notes REST API Tests ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================${colors.reset}\n`);

  try {
    // 1. Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beeskilled_week2';
    await mongoose.connect(mongoURI);
    console.log(`[Test Setup] Connected to MongoDB: ${mongoose.connection.name}`);

    // Clean up test users and notes
    await User.deleteMany({ email: { $regex: /notes\.test/ } });
    await Note.deleteMany({ title: { $regex: /\[Test\]/ } });

    // 2. Start HTTP Test Server
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(TEST_PORT, resolve));
    console.log(`[Test Setup] Test server listening on ${BASE_URL}\n`);

    const userACredentials = {
      name: 'User Alpha',
      email: 'notes.test.alpha@beeskilled.com',
      password: 'AlphaPassword123!',
    };

    const userBCredentials = {
      name: 'User Beta',
      email: 'notes.test.beta@beeskilled.com',
      password: 'BetaPassword123!',
    };

    // -------------------------------------------------------------------------
    // Step 1: Register User A
    // -------------------------------------------------------------------------
    console.log(`${colors.yellow}Step 1: Register User A (POST /api/auth/register)${colors.reset}`);
    {
      const res = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userACredentials),
      });

      assert(res.status === 201, `Expected status 201 Created, got ${res.status}`);
      assert(res.body.success === true, 'Registration success should be true');
      assert(Boolean(res.body.data.token), 'Registration returns a token');
      assert(res.body.data.user.email === userACredentials.email, 'User A email matches');

      userAId = res.body.data.user.id;
    }

    // -------------------------------------------------------------------------
    // Step 2 & 3: Login User A & Receive JWT
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Steps 2 & 3: Login User A & Receive JWT (POST /api/auth/login)${colors.reset}`);
    {
      const res = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: userACredentials.email,
          password: userACredentials.password,
        }),
      });

      assert(res.status === 200, `Expected status 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Login success should be true');
      assert(Boolean(res.body.data.token), 'Step 3: Successfully received valid JWT');

      userAToken = res.body.data.token;
    }

    // -------------------------------------------------------------------------
    // Step 4: Create Note using Bearer token
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Step 4: Create note using Bearer token (POST /api/notes)${colors.reset}`);
    {
      const notePayload = {
        title: '[Test] Architecture Design Notes',
        content: 'Building secure MERN micro-services with JWT and Mongoose.',
      };

      const res = await request('/api/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userAToken}` },
        body: JSON.stringify(notePayload),
      });

      assert(res.status === 201, `Expected status 201 Created, got ${res.status}`);
      assert(res.body.success === true, 'Note creation success should be true');
      assert(res.body.data.title === notePayload.title, 'Note title matches');
      assert(res.body.data.content === notePayload.content, 'Note content matches');
      assert(res.body.data.user === userAId, 'Note correctly references User A ID');
      assert(Boolean(res.body.data.createdAt), 'Note includes createdAt timestamp');
      assert(Boolean(res.body.data.id), 'Note includes unique ID');

      noteAId = res.body.data.id;
    }

    // -------------------------------------------------------------------------
    // Step 5: Get User's Notes
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Step 5: Get user's notes (GET /api/notes)${colors.reset}`);
    {
      const res = await request('/api/notes', {
        headers: { Authorization: `Bearer ${userAToken}` },
      });

      assert(res.status === 200, `Expected status 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(Array.isArray(res.body.data), 'Notes data is an array');
      assert(res.body.count >= 1, 'Count reflects user notes');

      const found = res.body.data.some((n) => n.id === noteAId);
      assert(found, "User A's created note is present in their notes list");
    }

    // -------------------------------------------------------------------------
    // Step 6: Get Single Note
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Step 6: Get single note (GET /api/notes/:id)${colors.reset}`);
    {
      const res = await request(`/api/notes/${noteAId}`, {
        headers: { Authorization: `Bearer ${userAToken}` },
      });

      assert(res.status === 200, `Expected status 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(res.body.data.id === noteAId, 'Retrieved note ID matches');
      assert(res.body.data.title === '[Test] Architecture Design Notes', 'Note title matches');
    }

    // -------------------------------------------------------------------------
    // Step 7: Update Note
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Step 7: Update note (PUT /api/notes/:id)${colors.reset}`);
    {
      const updatePayload = {
        title: '[Test] Architecture Design Notes - Finalized',
        content: 'Added MongoDB connection pooling and indexing strategies.',
      };

      const res = await request(`/api/notes/${noteAId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userAToken}` },
        body: JSON.stringify(updatePayload),
      });

      assert(res.status === 200, `Expected status 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Update response success should be true');
      assert(res.body.data.title === updatePayload.title, 'Updated title matches');
      assert(res.body.data.content === updatePayload.content, 'Updated content matches');
    }

    // -------------------------------------------------------------------------
    // Step 8: Delete Note
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Step 8: Delete note (DELETE /api/notes/:id)${colors.reset}`);
    {
      const res = await request(`/api/notes/${noteAId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userAToken}` },
      });

      assert(res.status === 200, `Expected status 200 OK on delete, got ${res.status}`);
      assert(res.body.success === true, 'Delete success should be true');
      assert(res.body.message === 'Note deleted successfully', 'Delete message matches');

      // Verify note is gone
      const verifyRes = await request(`/api/notes/${noteAId}`, {
        headers: { Authorization: `Bearer ${userAToken}` },
      });
      assert(verifyRes.status === 404, `Subsequent GET returns 404 Not Found, got ${verifyRes.status}`);
      assert(verifyRes.body.success === false, '404 success is false');
    }

    // -------------------------------------------------------------------------
    // Step 9: Try Accessing Another User's Note (Cross-User Isolation)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Step 9: Cross-User Isolation Enforcement (User B accessing User A's note)${colors.reset}`);
    {
      // 1. User A creates a new private note (Note A2)
      const resA2 = await request('/api/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userAToken}` },
        body: JSON.stringify({
          title: '[Test] User A Confidential Strategy',
          content: 'Top secret internal documentation for User A.',
        }),
      });
      noteA2Id = resA2.body.data.id;
      assert(Boolean(noteA2Id), "User A created confidential note A2");

      // 2. Register & Login User B
      const regB = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userBCredentials),
      });
      userBId = regB.body.data.user.id;
      userBToken = regB.body.data.token;
      assert(Boolean(userBToken), 'User B registered and authenticated');

      // 3. User B tries GET /api/notes/:noteA2Id -> Expect 403 Forbidden
      const unauthorizedGet = await request(`/api/notes/${noteA2Id}`, {
        headers: { Authorization: `Bearer ${userBToken}` },
      });
      assert(unauthorizedGet.status === 403, `User B GET User A's note rejected with 403 Forbidden, got ${unauthorizedGet.status}`);
      assert(unauthorizedGet.body.success === false, 'Unauthorized GET success should be false');
      assert(
        unauthorizedGet.body.message.includes('Access denied'),
        'Message explains access denial for other user note'
      );

      // 4. User B tries PUT /api/notes/:noteA2Id -> Expect 403 Forbidden
      const unauthorizedPut = await request(`/api/notes/${noteA2Id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${userBToken}` },
        body: JSON.stringify({ title: 'Hacked by User B' }),
      });
      assert(unauthorizedPut.status === 403, `User B PUT User A's note rejected with 403 Forbidden, got ${unauthorizedPut.status}`);
      assert(unauthorizedPut.body.success === false, 'Unauthorized PUT success should be false');

      // 5. User B tries DELETE /api/notes/:noteA2Id -> Expect 403 Forbidden
      const unauthorizedDel = await request(`/api/notes/${noteA2Id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${userBToken}` },
      });
      assert(unauthorizedDel.status === 403, `User B DELETE User A's note rejected with 403 Forbidden, got ${unauthorizedDel.status}`);
      assert(unauthorizedDel.body.success === false, 'Unauthorized DELETE success should be false');

      // 6. User B calls GET /api/notes -> Expect User A's note is NOT included
      const userBList = await request('/api/notes', {
        headers: { Authorization: `Bearer ${userBToken}` },
      });
      assert(userBList.status === 200, 'User B can list their own notes');
      const containsUserANote = userBList.body.data.some((n) => n.id === noteA2Id);
      assert(!containsUserANote, "User B list strictly excludes User A's note");
    }

    // -------------------------------------------------------------------------
    // Step 10: Try Accessing Notes Without JWT
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Step 10: Unauthenticated Access Rejection (No JWT)${colors.reset}`);
    {
      // GET /api/notes without token
      const resGetList = await request('/api/notes');
      assert(resGetList.status === 401, `GET /api/notes without token returns 401, got ${resGetList.status}`);
      assert(resGetList.body.success === false, 'Unauthenticated GET success is false');

      // POST /api/notes without token
      const resPost = await request('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ title: 'Unauthorized', content: 'No token' }),
      });
      assert(resPost.status === 401, `POST /api/notes without token returns 401, got ${resPost.status}`);

      // GET /api/notes/:id without token
      const resGetOne = await request(`/api/notes/${noteA2Id}`);
      assert(resGetOne.status === 401, `GET /api/notes/:id without token returns 401, got ${resGetOne.status}`);

      // PUT /api/notes/:id without token
      const resPut = await request(`/api/notes/${noteA2Id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: 'New title' }),
      });
      assert(resPut.status === 401, `PUT /api/notes/:id without token returns 401, got ${resPut.status}`);

      // DELETE /api/notes/:id without token
      const resDel = await request(`/api/notes/${noteA2Id}`, {
        method: 'DELETE',
      });
      assert(resDel.status === 401, `DELETE /api/notes/:id without token returns 401, got ${resDel.status}`);
    }

    // -------------------------------------------------------------------------
    // Additional Validation Tests (Invalid ID, Missing Fields)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Validation Edge Cases: Invalid ID & Missing Fields${colors.reset}`);
    {
      // Invalid ObjectId format
      const invalidIdRes = await request('/api/notes/invalid-note-id', {
        headers: { Authorization: `Bearer ${userAToken}` },
      });
      assert(invalidIdRes.status === 400, `Invalid ID returns 400, got ${invalidIdRes.status}`);
      assert(invalidIdRes.body.message.includes('Invalid Note ID format'), 'Error message clarifies invalid ID');

      // Missing title
      const missingTitleRes = await request('/api/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userAToken}` },
        body: JSON.stringify({ content: 'Only content' }),
      });
      assert(missingTitleRes.status === 400, `Missing title returns 400, got ${missingTitleRes.status}`);

      // Missing content
      const missingContentRes = await request('/api/notes', {
        method: 'POST',
        headers: { Authorization: `Bearer ${userAToken}` },
        body: JSON.stringify({ title: 'Only title' }),
      });
      assert(missingContentRes.status === 400, `Missing content returns 400, got ${missingContentRes.status}`);

      // Non-existent note (valid ObjectId)
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const notFoundRes = await request(`/api/notes/${nonExistentId}`, {
        headers: { Authorization: `Bearer ${userAToken}` },
      });
      assert(notFoundRes.status === 404, `Non-existent note returns 404, got ${notFoundRes.status}`);
    }

    // Summary
    console.log(`\n${colors.bold}${colors.green}======================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.green}  ✓ ALL ${totalTests} NOTES ASSERTIONS PASSED SUCCESSFULLY! (${passedCount}/${totalTests})${colors.reset}`);
    console.log(`${colors.bold}${colors.green}======================================================${colors.reset}\n`);

  } catch (err) {
    console.error(`\n${colors.bold}${colors.red}Notes Test Suite FAILED with error:${colors.reset}`, err);
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

runNotesTestSuite();
