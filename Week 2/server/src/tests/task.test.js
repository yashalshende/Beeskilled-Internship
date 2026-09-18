import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app.js';
import Task from '../models/Task.js';

dotenv.config();

const TEST_PORT = 5099;
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
let createdTaskId;
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
 * Run Test Suite
 */
const runTestSuite = async () => {
  console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}  BeeSkilled Week 2 Assignment 1: To-Do REST API Tests ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

  try {
    // 1. Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/beeskilled_week2';
    await mongoose.connect(mongoURI);
    console.log(`[Test Setup] Connected to MongoDB: ${mongoose.connection.name}`);

    // Clean up test tasks created during previous runs if any
    await Task.deleteMany({ title: { $regex: /\[Test\]/ } });

    // 2. Start HTTP Test Server
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(TEST_PORT, resolve));
    console.log(`[Test Setup] Test server listening on ${BASE_URL}\n`);

    // -------------------------------------------------------------------------
    // Test 1: Create Task (POST /api/tasks)
    // -------------------------------------------------------------------------
    console.log(`${colors.yellow}Test 1: Create task (POST /api/tasks)${colors.reset}`);
    {
      const payload = {
        title: '[Test] Complete Week 2 Assignment 1',
        description: 'Build complete REST API with Mongoose, validation and testing',
      };

      const res = await request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      assert(res.status === 201, `Expected status 201 Created, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(res.body.message === 'Task created successfully', 'Response message matches');
      assert(res.body.data && res.body.data.id, 'Response data contains task ID');
      assert(res.body.data.title === payload.title, 'Title matches payload');
      assert(res.body.data.description === payload.description, 'Description matches payload');
      assert(res.body.data.completed === false, 'Default completed status is false');
      assert(Boolean(res.body.data.createdAt), 'Task contains createdAt timestamp');
      assert(Boolean(res.body.data.updatedAt), 'Task contains updatedAt timestamp');

      createdTaskId = res.body.data.id;
    }

    // -------------------------------------------------------------------------
    // Test 2: Get All Tasks (GET /api/tasks)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 2: Get all tasks (GET /api/tasks)${colors.reset}`);
    {
      const res = await request('/api/tasks');

      assert(res.status === 200, `Expected status 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(Array.isArray(res.body.data), 'Response data is an array of tasks');
      assert(typeof res.body.count === 'number', 'Response contains count property');
      assert(res.body.data.length >= 1, 'Task list contains at least 1 task');

      const found = res.body.data.some((task) => task.id === createdTaskId);
      assert(found, 'Created task is present in the list');
    }

    // -------------------------------------------------------------------------
    // Test 3: Get One Task (GET /api/tasks/:id)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 3: Get one task (GET /api/tasks/:id)${colors.reset}`);
    {
      const res = await request(`/api/tasks/${createdTaskId}`);

      assert(res.status === 200, `Expected status 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(res.body.data.id === createdTaskId, 'Retrieved task ID matches requested ID');
      assert(res.body.data.title === '[Test] Complete Week 2 Assignment 1', 'Title matches');
    }

    // -------------------------------------------------------------------------
    // Test 4: Update Task (PUT /api/tasks/:id)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 4: Update task (PUT /api/tasks/:id)${colors.reset}`);
    {
      const updatePayload = {
        title: '[Test] Complete Week 2 Assignment 1 - Updated',
        description: 'Verified with all 8 tests passing',
        completed: true,
      };

      const res = await request(`/api/tasks/${createdTaskId}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });

      assert(res.status === 200, `Expected status 200 OK, got ${res.status}`);
      assert(res.body.success === true, 'Response success should be true');
      assert(res.body.data.title === updatePayload.title, 'Updated title matches');
      assert(res.body.data.description === updatePayload.description, 'Updated description matches');
      assert(res.body.data.completed === true, 'Completed flag updated to true');
    }

    // -------------------------------------------------------------------------
    // Test 5: Delete Task (DELETE /api/tasks/:id)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 5: Delete task (DELETE /api/tasks/:id)${colors.reset}`);
    {
      const deleteRes = await request(`/api/tasks/${createdTaskId}`, {
        method: 'DELETE',
      });

      assert(deleteRes.status === 200, `Expected status 200 OK on delete, got ${deleteRes.status}`);
      assert(deleteRes.body.success === true, 'Delete response success should be true');
      assert(deleteRes.body.message === 'Task deleted successfully', 'Delete message matches');

      // Verify that the task no longer exists (404 Not Found)
      const verifyRes = await request(`/api/tasks/${createdTaskId}`);
      assert(verifyRes.status === 404, `Expected status 404 for deleted task, got ${verifyRes.status}`);
      assert(verifyRes.body.success === false, '404 response success is false');
      assert(verifyRes.body.data === null, '404 response data is null');
    }

    // -------------------------------------------------------------------------
    // Test 6: Invalid ID Handling (400 Bad Request)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 6: Invalid ID validation (GET/PUT/DELETE with bad ID)${colors.reset}`);
    {
      const invalidId = 'not-a-valid-mongo-id';

      // Test GET with invalid ID
      const getRes = await request(`/api/tasks/${invalidId}`);
      assert(getRes.status === 400, `GET invalid ID should return 400, got ${getRes.status}`);
      assert(getRes.body.success === false, 'GET invalid ID success should be false');
      assert(getRes.body.message.includes('Invalid Task ID format'), 'Error message clarifies invalid ID format');

      // Test PUT with invalid ID
      const putRes = await request(`/api/tasks/${invalidId}`, {
        method: 'PUT',
        body: JSON.stringify({ title: 'New title' }),
      });
      assert(putRes.status === 400, `PUT invalid ID should return 400, got ${putRes.status}`);
      assert(putRes.body.success === false, 'PUT invalid ID success should be false');

      // Test DELETE with invalid ID
      const delRes = await request(`/api/tasks/${invalidId}`, {
        method: 'DELETE',
      });
      assert(delRes.status === 400, `DELETE invalid ID should return 400, got ${delRes.status}`);
      assert(delRes.body.success === false, 'DELETE invalid ID success should be false');
    }

    // -------------------------------------------------------------------------
    // Test 7: Missing Title Validation (400 Bad Request)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 7: Missing or invalid title validation (POST /api/tasks)${colors.reset}`);
    {
      // Missing title key
      const missingTitleRes = await request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ description: 'No title provided' }),
      });
      assert(missingTitleRes.status === 400, `Missing title returns 400, got ${missingTitleRes.status}`);
      assert(missingTitleRes.body.success === false, 'Missing title success should be false');
      assert(missingTitleRes.body.message === 'Task title is required.', 'Correct error message for missing title');

      // Empty / whitespace title
      const emptyTitleRes = await request('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ title: '   ', description: 'Whitespace only' }),
      });
      assert(emptyTitleRes.status === 400, `Whitespace title returns 400, got ${emptyTitleRes.status}`);
      assert(emptyTitleRes.body.success === false, 'Empty title success should be false');
      assert(
        emptyTitleRes.body.message === 'Task title must be a non-empty string.',
        'Correct error message for whitespace title'
      );
    }

    // -------------------------------------------------------------------------
    // Test 8: MongoDB Failure Handling (500 without raw DB leak)
    // -------------------------------------------------------------------------
    console.log(`\n${colors.yellow}Test 8: MongoDB failure handling & error sanitization${colors.reset}`);
    {
      // Mock Task.find to simulate an internal database query failure
      const originalFind = Task.find;
      Task.find = () => {
        const error = new Error('MongoServerSelectionError: connection timed out');
        error.name = 'MongoServerSelectionError';
        return {
          sort: () => Promise.reject(error),
        };
      };

      try {
        const res = await request('/api/tasks');

        assert(res.status === 500, `Expected status 500 on database failure, got ${res.status}`);
        assert(res.body.success === false, 'Failure response success should be false');
        assert(
          res.body.message === 'Database service encountered an error. Please try again later.' ||
            res.body.message === 'An internal server error occurred while processing your request.',
          'Database error is cleanly masked with client-safe message'
        );
        assert(res.body.stack === undefined, 'Raw error stack trace is NOT exposed to client');
        assert(res.body.data === null, 'Error response data is null');
        assert(!JSON.stringify(res.body).includes('MongoServerSelectionError'), 'No raw MongoDB driver errors leaked');
      } finally {
        // Restore Task.find
        Task.find = originalFind;
      }
    }

    // Summary
    console.log(`\n${colors.bold}${colors.green}====================================================${colors.reset}`);
    console.log(`${colors.bold}${colors.green}  ✓ ALL ${totalTests} ASSERTIONS PASSED SUCCESSFULLY! (${passedCount}/${totalTests})${colors.reset}`);
    console.log(`${colors.bold}${colors.green}====================================================${colors.reset}\n`);

  } catch (err) {
    console.error(`\n${colors.bold}${colors.red}Test Suite FAILED with error:${colors.reset}`, err);
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

runTestSuite();
