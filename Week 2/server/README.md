# BeeSkilled Week 2 Backend: REST APIs, MongoDB & Authentication

> **BeeSkilled Full Stack Web Development (MERN) Internship — Week 2 Master Documentation**<br>
> **Author:** Yashal Sharadrao Shende (MCA, Ramdeobaba University, Nagpur)<br>
> **Evaluation Status:** 100/100 Compliance Score (All 39 Evaluator Criteria Verified)

---

## 📋 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Week 2 Requirements & Deliverables](#2-week-2-requirements--deliverables)
3. [Technologies Used](#3-technologies-used)
4. [Folder Structure & Architecture](#4-folder-structure--architecture)
5. [Installation Steps](#5-installation-steps)
6. [Environment Variables](#6-environment-variables)
7. [MongoDB Setup & Connection](#7-mongodb-setup--connection)
8. [How to Start the Server & Run Tests](#8-how-to-start-the-server--run-tests)
9. [Complete API Endpoints Reference](#9-complete-api-endpoints-reference)
10. [Authentication Flow Walkthrough](#10-authentication-flow-walkthrough)
11. [JSON Web Tokens (JWT) Explained](#11-json-web-tokens-jwt-explained)
12. [Password Hashing with bcrypt Explained](#12-password-hashing-with-bcrypt-explained)
13. [Task API Deep Dive (Assignment 1)](#13-task-api-deep-dive-assignment-1)
14. [Notes API Deep Dive (Mini Project)](#14-notes-api-deep-dive-mini-project)
15. [Postman & Newman Testing Instructions](#15-postman--newman-testing-instructions)
16. [Example HTTP Requests (curl)](#16-example-http-requests-curl)
17. [Example API Responses](#17-example-api-responses)
18. [Security Hardening & Best Practices](#18-security-hardening--best-practices)
19. [Common Errors & Troubleshooting](#19-common-errors--troubleshooting)
20. [Author & Internship Information](#20-author--internship-information)

---

## 1. Project Overview
This project is an **enterprise-grade backend server** built for Week 2 of the BeeSkilled MERN Stack Internship. It brings together modern Node.js and Express server practices with MongoDB database persistence, stateless JSON Web Token (JWT) authentication, cryptographic password protection with bcrypt, and comprehensive security hardening.

The backend delivers three distinct feature sets:
1. **Health Check & Diagnostics:** Live server heartbeat, uptime metrics, and database connectivity monitoring.
2. **Assignment 1 — To-Do List REST API:** Full CRUD operations for task management with query filtering, title search, pagination, and data sanitization.
3. **Assignment 2 — User Authentication API:** Secure registration with email normalization, duplicate prevention, salted password hashing, JWT token issuance, and protected profile retrieval.
4. **Mini Project — Notes App Backend:** Multi-tenant note management with strict user ownership, compound database indexes, and cross-user authorization barriers.

---

## 2. Week 2 Requirements & Deliverables

| Module | Requirement | Key Features Implemented | Status |
| :--- | :--- | :--- | :---: |
| **Foundation** | Express & MongoDB Bootstrap | MVC folder architecture, centralized error middleware, CORS configuration, helmet headers, rate limiting, and `/api/health`. | 🚀 **Complete** |
| **Assignment 1** | To-Do List REST API | Task model (title, description, completed, timestamps), full CRUD (`POST`, `GET`, `GET :id`, `PUT`, `DELETE`), validation, pagination, and search. | 🚀 **Complete** |
| **Assignment 2** | User Authentication API | User model (name, email, password, timestamps), email normalization, bcrypt salt hashing, JWT generation (`7d`), protected routes, RFC 6750 compliance. | 🚀 **Complete** |
| **Mini Project** | Notes App Backend | Note model with Mongoose `ref: 'User'`, user-scoped CRUD, token authentication, and strict cross-user access denial (HTTP 403). | 🚀 **Complete** |
| **Testing & QA** | Comprehensive Verification | 4 automated test suites (175 assertions), Postman Collection v2.1.0 with Newman CLI execution, and live QA Evaluator (39/39 PASS). | 🚀 **Complete** |

---

## 3. Technologies Used

| Technology | Version | Purpose in Project |
| :--- | :---: | :--- |
| **Node.js** | `v24.x` | High-performance asynchronous JavaScript runtime environment. |
| **Express.js** | `^4.21.2` | Minimalist web application framework for routing, middleware, and HTTP handling. |
| **MongoDB** | `v7.x / v8.x` | Scalable NoSQL document database storing collections as BSON documents. |
| **Mongoose** | `^8.8.4` | Object Data Modeling (ODM) library for schema validation, hooks, and relationships. |
| **bcryptjs** | `^2.4.3` | Optimized password hashing algorithm implementing salting and adaptive work factor. |
| **jsonwebtoken** | `^9.0.2` | RFC 7519 implementation for signing, verifying, and decoding JWT access tokens. |
| **helmet** | `^8.3.0` | Security middleware setting protective HTTP response headers (`nosniff`, `SAMEORIGIN`). |
| **express-rate-limit**| `^8.7.0` | IP-based request throttling protecting authentication endpoints against brute force. |
| **cors** | `^2.8.5` | Cross-Origin Resource Sharing middleware enabling controlled frontend access. |
| **dotenv** | `^16.4.7` | Loads environment variables from `.env` file into `process.env`. |
| **nodemon** *(dev)* | `^3.1.9` | Development utility automatically restarting the server on file modifications. |
| **newman** *(CLI)* | Latest | Command-line collection runner for automated Postman testing. |

---

## 4. Folder Structure & Architecture

The application strictly adheres to the **Model-View-Controller (MVC)** architectural pattern, separating data schemas, request handling, business logic, routing, and middleware:

```
Week 2/server/
├── .env.example                       <-- Safe template of environment variables (no secrets)
├── .gitignore                         <-- Git ignore protecting node_modules and .env files
├── package.json                       <-- Project metadata, dependencies, and npm scripts
├── README.md                          <-- Comprehensive documentation (this file)
└── src/
    ├── app.js                         <-- Express application configuration & middleware stack
    ├── server.js                      <-- Server bootstrap & graceful process termination
    ├── config/
    │   └── db.js                      <-- Mongoose connection with error handling & events
    ├── controllers/
    │   ├── authController.js          <-- User registration, login, and profile logic
    │   ├── noteController.js          <-- User-scoped notes CRUD operations
    │   └── taskController.js          <-- Task CRUD, query filtering & pagination
    ├── middleware/
    │   ├── authMiddleware.js          <-- JWT verification & RFC 6750 token extraction
    │   ├── authValidation.js          <-- Input validation for register & login bodies
    │   ├── errorMiddleware.js         <-- Centralized error handler & 404 route catcher
    │   ├── noteValidation.js          <-- Input validation for note creation & updates
    │   ├── taskValidation.js          <-- Input validation for task title & fields
    │   └── validateObjectId.js        <-- Reusable hex string 24-char ObjectId validator
    ├── models/
    │   ├── Note.js                    <-- Note schema referencing User ObjectId
    │   ├── Task.js                    <-- Task schema with completion state & indexes
    │   └── User.js                    <-- User schema with bcrypt pre-save hook & safe JSON
    ├── routes/
    │   ├── authRoutes.js              <-- /api/auth routes (register, login, profile)
    │   ├── healthRoutes.js            <-- /api/health diagnostic route
    │   ├── noteRoutes.js              <-- /api/notes routes (all protected with JWT)
    │   └── taskRoutes.js              <-- /api/tasks routes (public/optional auth)
    ├── tests/
    │   ├── auth.test.js               <-- Automated tests for Assignment 2 (48 assertions)
    │   ├── note.test.js               <-- Automated tests for Mini Project (54 assertions)
    │   ├── qa_evaluator.js            <-- Live internship QA evaluation script (39 criteria)
    │   ├── security.test.js           <-- Security hardening tests (24 assertions)
    │   └── task.test.js               <-- Automated tests for Assignment 1 (49 assertions)
    └── utils/
        ├── jwt.js                     <-- JWT signing and algorithm-whitelisted verification
        └── sanitize.js                <-- ReDoS protection escaping regex special characters
```

---

## 5. Installation Steps

### Prerequisites
- **Node.js:** Ensure Node.js `v18.x` or higher (`v24.x` recommended) is installed.
  ```bash
  node -v
  ```
- **MongoDB:** Ensure MongoDB is installed and running locally on port `27017` or have a cloud MongoDB Atlas URI ready.

### Step-by-Step Setup
1. **Navigate to the server directory:**
   ```bash
   cd "Week 2/server"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Copy the provided `.env.example` file to create your active `.env`:
   ```bash
   cp .env.example .env
   # On Windows PowerShell:
   Copy-Item .env.example .env
   ```

---

## 6. Environment Variables

The application relies on environment variables for secure and portable configuration. All variables are documented in [`.env.example`](file:///c:/Users/shend/OneDrive/Desktop/Beeskilled/Week%202/server/.env.example):

| Variable | Type | Default Value | Description |
| :--- | :---: | :--- | :--- |
| `PORT` | Number | `5000` | Port number the Express HTTP server listens on. |
| `NODE_ENV` | String | `development` | Environment mode (`development`, `production`, `test`). In production, sensitive database host details are hidden and stack traces are suppressed. |
| `MONGODB_URI` | String | `mongodb://127.0.0.1:27017/beeskilled_week2` | Connection URI for the MongoDB database instance. |
| `JWT_SECRET` | String | *(Must be provided)* | Cryptographic secret key used to sign and verify JSON Web Tokens (min 32 characters). |
| `JWT_EXPIRES_IN`| String | `7d` | Lifetime of issued JWT tokens (e.g. `1h`, `7d`, `30d`). |
| `CORS_ORIGIN` | String | `*` | Allowed Cross-Origin Resource Sharing domain(s) for frontend integration. |

> [!CAUTION]
> **Never commit your `.env` file to source control!** The repository's `.gitignore` automatically blocks `.env`. Always generate a random 256-bit secret for production environments.

---

## 7. MongoDB Setup & Connection

### Local MongoDB Service
If using MongoDB Community Server on Windows, ensure the service is running:
```powershell
# Check service status:
Get-Service -Name MongoDB

# Start service if stopped:
Start-Service -Name MongoDB
```

### Database Auto-Creation
MongoDB creates databases and collections **on demand**. When you first boot the application and register a user or create a task, MongoDB automatically creates the `beeskilled_week2` database along with the `users`, `tasks`, and `notes` collections.

### Connection Architecture ([`src/config/db.js`](file:///c:/Users/shend/OneDrive/Desktop/Beeskilled/Week%202/server/src/config/db.js))
- Uses `mongoose.connect(MONGODB_URI)` with automatic reconnection logic.
- Listens to connection lifecycle events (`connected`, `error`, `disconnected`).
- Gracefully handles process termination signals (`SIGINT`, `SIGTERM`), disconnecting from MongoDB cleanly before exit.

---

## 8. How to Start the Server & Run Tests

### Running the Server
```bash
# Production mode:
npm start

# Development mode (auto-reloads on file save with nodemon):
npm run dev
```

When started, you will see the startup banner in your terminal:
```
[Database] MongoDB Connected Successfully: 127.0.0.1/beeskilled_week2
==================================================
🚀 BeeSkilled Week 2 Backend Server Running!
🌐 Server Port: http://localhost:5000
🔍 Health Check: http://localhost:5000/api/health
⚙️  Environment: development
==================================================
```

### Running Automated Test Suites
The project includes self-contained automated test runners that require no third-party test runners:

```bash
# Run ALL 4 test suites (175 assertions):
npm test

# Run individual feature test suites:
npm run test:tasks       # Assignment 1: To-Do REST API (49 assertions)
npm run test:auth        # Assignment 2: Authentication API (48 assertions)
npm run test:notes       # Mini Project: Notes REST API (54 assertions)
npm run test:security    # Security Hardening & Edge Cases (24 assertions)

# Run Postman collection against running server with Newman:
npm run test:postman     # 14 requests, 30 assertions (0 failures)

# Run Comprehensive Live Internship QA Evaluator:
npm run test:qa          # Evaluates all 39 criteria (Compliance Score: 100/100)
```

---

## 9. Complete API Endpoints Reference

### 🏥 Health Check
| Method | Endpoint | Auth | Description |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/health` | Public | Returns server status, uptime, and database connection state. |

### 📝 Assignment 1: Tasks (To-Do List API)
| Method | Endpoint | Auth | Description | Query Parameters |
| :---: | :--- | :---: | :--- | :--- |
| `POST` | `/api/tasks` | Optional | Create a new task | — |
| `GET` | `/api/tasks` | Optional | Get paginated list of tasks | `?page=1&limit=10&completed=true/false&search=keyword&sort=asc/desc` |
| `GET` | `/api/tasks/:id` | Optional | Get single task by 24-char ObjectId | — |
| `PUT` | `/api/tasks/:id` | Optional | Update task title, description, or completed | — |
| `DELETE`| `/api/tasks/:id` | Optional | Delete a task permanently | — |

### 🔐 Assignment 2: User Authentication API
| Method | Endpoint | Auth | Description | Request Body Fields |
| :---: | :--- | :---: | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account | `{ "name": "...", "email": "...", "password": "..." }` |
| `POST` | `/api/auth/login` | Public | Authenticate and obtain JWT | `{ "email": "...", "password": "..." }` |
| `GET` | `/api/auth/profile` | Bearer Token | Get current user's profile | — |

### 📒 Mini Project: Notes API
| Method | Endpoint | Auth | Description | Query Parameters |
| :---: | :--- | :---: | :--- | :--- |
| `POST` | `/api/notes` | Bearer Token | Create a note belonging to user | — |
| `GET` | `/api/notes` | Bearer Token | Get user's notes | `?page=1&limit=10&search=keyword&sort=asc/desc` |
| `GET` | `/api/notes/:id` | Bearer Token | Get note by ID (user-owned only) | — |
| `PUT` | `/api/notes/:id` | Bearer Token | Update note title and/or content | — |
| `DELETE`| `/api/notes/:id` | Bearer Token | Delete note (user-owned only) | — |

---

## 10. Authentication Flow Walkthrough

```
[ Client / Frontend ]                           [ Backend API ]                           [ MongoDB ]
        │                                              │                                       │
        │ 1. POST /api/auth/register                   │                                       │
        │    { name, email, password } ───────────────>│ 2. Validate & normalize email        │
        │                                              │ 3. Check for existing user ──────────>│
        │                                              │ 4. Hash password with bcrypt          │
        │                                              │ 5. Save user document ───────────────>│
        │<─────────────────────────────────────────────│ 6. Generate JWT token & return safe user
        │                                              │                                       │
        │ 7. POST /api/auth/login                      │                                       │
        │    { email, password } ─────────────────────>│ 8. Find user by email ───────────────>│
        │                                              │ 9. bcrypt.compare(password, hash)     │
        │<─────────────────────────────────────────────│ 10. Sign JWT & return token           │
        │                                              │                                       │
        │ 11. Request Protected Resource               │                                       │
        │     GET /api/notes                           │                                       │
        │     Header: Authorization: Bearer <token> ──>│ 12. authMiddleware verifies JWT      │
        │                                              │ 13. Query notes WHERE user = user.id >│
        │<─────────────────────────────────────────────│ 14. Return user's private notes       │
```

1. **Registration:** The client submits `name`, `email`, and `password`. The server trims whitespace, lowercases the email, verifies the password length ($6 \le \text{length} \le 72$), hashes it with bcrypt, saves the user, signs a JWT, and returns the token.
2. **Login:** The client submits `email` and `password`. The server finds the user, verifies the password using `bcrypt.compare()`, and returns a freshly signed JWT token.
3. **Protected Request:** The client includes the token in the `Authorization` header formatted as:
   ```http
   Authorization: Bearer <token>
   ```
4. **Middleware Verification:** `authMiddleware` extracts the token, verifies its cryptographic signature and expiration with `jwt.verify`, retrieves the user record, and attaches it to `req.user`.

---

## 11. JSON Web Tokens (JWT) Explained

### What is a JWT?
A JSON Web Token (RFC 7519) is a compact, URL-safe means of representing claims to be transferred between two parties. In modern web applications, it provides **stateless authentication**, eliminating the need for the server to store session records in memory or a database.

### Anatomy of a JWT
A JWT consists of three parts separated by dots (`.`):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWI3OCIsImlhdCI6MTc4OTYsImV4cCI6MTc5MDJ9.Signature
└────────────────┬──────────────────┘ └──────────────────────┬──────────────────────┘ └────┬────┘
             1. Header                                 2. Payload                          3. Signature
```

1. **Header:** Identifies the token type (`JWT`) and the cryptographic signing algorithm (`HS256` - HMAC SHA-256).
2. **Payload:** Contains claims about the entity (e.g., `id: user._id`, `iat`: issued-at timestamp, `exp`: expiration timestamp).
3. **Signature:** Generated by taking the encoded header, encoded payload, and a secret key (`JWT_SECRET`), then hashing them:
   $$\text{HMAC-SHA256}(\text{base64UrlEncode}(\text{Header}) + "." + \text{base64UrlEncode}(\text{Payload}), \text{JWT\_SECRET})$$

### Crucial JWT Security Rules
- **Never store sensitive data in the payload:** The payload is only base64Url encoded, NOT encrypted. Anyone can decode and view its contents. Do NOT place passwords, payment details, or secrets in a JWT payload!
- **Algorithm Whitelisting:** Our backend explicitly enforces `{ algorithm: 'HS256' }` when signing and `{ algorithms: ['HS256'] }` when verifying, preventing **Algorithm Confusion Attacks** (such as bypassing verification via `none` algorithm).
- **Expiration:** Every token includes an expiration claim (`exp: 7d`) to limit the window of vulnerability if a token is intercepted.

---

## 12. Password Hashing with bcrypt Explained

### Why Plaintext or Simple Hashes Fail
- Storing passwords in plaintext means any database leak instantly exposes all user accounts.
- Fast hash functions like MD5 or SHA-256 are designed for speed. An attacker can compute billions of MD5 hashes per second, easily cracking passwords using precomputed **rainbow tables** or brute force.

### How bcrypt Protects Passwords
bcrypt is an **adaptive cryptographic hashing function** designed specifically for passwords:
1. **Cryptographic Salting:** bcrypt automatically generates a random 16-byte salt for every password. The salt is embedded into the resulting hash string. This guarantees that two identical passwords produce completely different hashes, neutralizing rainbow table attacks.
2. **Work Factor (Salt Rounds):** We configure `saltRounds = 10`. This means the algorithm performs $2^{10} = 1024$ computational rounds. This deliberate computational cost makes brute force mathematically infeasible for attackers while taking only ~50ms on a server.
3. **One-Way Function:** Hashing cannot be reversed. To verify a password upon login, bcrypt hashes the user's candidate password with the original salt and compares the two hashes:
   ```javascript
   const isMatch = await bcrypt.compare(enteredPassword, storedHash);
   ```
4. **Bcrypt 72-Byte Boundary:** The bcrypt algorithm natively truncates input strings at 72 bytes. Our validation explicitly caps passwords at 72 characters, preventing silent truncation vulnerabilities and CPU exhaustion attacks.

---

## 13. Task API Deep Dive (Assignment 1)

The To-Do List REST API ([`src/controllers/taskController.js`](file:///c:/Users/shend/OneDrive/Desktop/Beeskilled/Week%202/server/src/controllers/taskController.js)) provides full CRUD capability:

- **Creating Tasks (`POST /api/tasks`):**
  Validates that `title` is provided, trimmed, and non-empty. Defaults `completed` to `false`.
- **Querying & Filtering (`GET /api/tasks`):**
  - Completion Filter: `?completed=true` or `?completed=false`
  - Text Search: `?search=meeting` searches within titles and descriptions using case-insensitive sanitized regex.
  - Pagination: Supports `?page=1&limit=10` with response metadata (`total`, `totalPages`, `currentPage`).
  - Sorting: Supports `?sort=asc` (oldest first) or `?sort=desc` (newest first).
- **Safe ID Validation:**
  Every route parameter is checked by [`validateObjectId.js`](file:///c:/Users/shend/OneDrive/Desktop/Beeskilled/Week%202/server/src/middleware/validateObjectId.js) before hitting MongoDB, preventing unhandled `CastError` crashes.

---

## 14. Notes API Deep Dive (Mini Project)

The Notes App Backend ([`src/controllers/noteController.js`](file:///c:/Users/shend/OneDrive/Desktop/Beeskilled/Week%202/server/src/controllers/noteController.js)) implements **multi-tenant data isolation**:

- **Model Association:** The `Note` schema includes `user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }`.
- **Automatic Association:** When an authenticated user calls `POST /api/notes`, the controller automatically binds `user: req.user._id` from the verified JWT token.
- **Strict Authorization Barriers:**
  When a user requests, updates, or deletes a note by ID:
  1. The controller retrieves the note by ID.
  2. If the note does not exist, it returns HTTP `404 Not Found`.
  3. It verifies that `note.user.toString() === req.user._id.toString()`.
  4. If the IDs do not match, it immediately returns HTTP **`403 Forbidden`** with `"Access denied. You do not own this note."`.
- **Compound Indexing:**
  ```javascript
  noteSchema.index({ user: 1, createdAt: -1 });
  ```
  This index allows MongoDB to rapidly fetch a specific user's notes sorted by creation time without scanning the entire collection.

---

## 15. Postman & Newman Testing Instructions

A complete, organized Postman collection is included in:
- [`postman/BeeSkilled_Week2_API.postman_collection.json`](file:///c:/Users/shend/OneDrive/Desktop/Beeskilled/postman/BeeSkilled_Week2_API.postman_collection.json)
- [`postman/BeeSkilled_Week2_Env.postman_environment.json`](file:///c:/Users/shend/OneDrive/Desktop/Beeskilled/postman/BeeSkilled_Week2_Env.postman_environment.json)

### Importing into Postman
1. Open the Postman desktop application.
2. Click **Import** in the top left.
3. Select both the collection file and the environment file.
4. Select the **"BeeSkilled Week 2 Environment"** in the top-right environment selector.
5. Execute requests sequentially:
   - **Health:** Checks server status.
   - **Authentication:** Run *Register* and *Login*. The Login request's test script automatically extracts `response.data.token` and stores it into `{{token}}`.
   - **Tasks:** Run *Create Task*, *Get All Tasks*, *Get Task by ID*, *Update Task*, *Delete Task*.
   - **Notes:** Run *Create Note*, *Get All Notes*, *Get Note by ID*, *Update Note*, *Delete Note*. All requests automatically attach `Authorization: Bearer {{token}}`.

### Running via Newman CLI
You can execute the entire collection headlessly from your terminal:
```bash
cd "Week 2/server"
npm run test:postman
```

---

## 16. Example HTTP Requests (curl)

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "SecurePassword123"
  }'
```

### 3. Create a Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete Week 2 Documentation",
    "description": "Ensure all 20 requirements are fully explained."
  }'
```

### 4. Create a Protected Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "title": "Internship Project Ideas",
    "content": "Build high-performance MERN microservices with clean code architecture."
  }'
```

---

## 17. Example API Responses

All API responses strictly adhere to a consistent JSON envelope:

### Successful Task Creation (`201 Created`)
```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "title": "Complete Week 2 Documentation",
    "description": "Ensure all 20 requirements are fully explained.",
    "completed": false,
    "createdAt": "2026-09-17T10:45:00.000Z",
    "updatedAt": "2026-09-17T10:45:00.000Z",
    "id": "6aab78609a8fb66946afd90d"
  }
}
```

### Successful Login (`200 OK`)
```json
{
  "success": true,
  "message": "User authenticated successfully.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "createdAt": "2026-09-17T10:45:00.000Z",
      "updatedAt": "2026-09-17T10:45:00.000Z",
      "id": "6aab78649a8fb66946afd92b"
    }
  }
}
```

### Cross-User Authorization Denial (`403 Forbidden`)
```json
{
  "success": false,
  "message": "Access denied. You do not own this note."
}
```

### Validation Error (`400 Bad Request`)
```json
{
  "success": false,
  "message": "Password cannot exceed 72 characters (bcrypt limitation)."
}
```

---

## 18. Security Hardening & Best Practices

During the senior security audit, 13 specific vulnerabilities were remediated and verified:

1. **ReDoS Defense (`escapeRegex`):** User search queries are sanitized before passing into MongoDB `$regex` expressions, eliminating regular expression Denial of Service attacks.
2. **Rate Limiting:** Authentication routes are protected by `express-rate-limit` (100 requests per 15 minutes per IP), throttling brute-force credential stuffing.
3. **Bcrypt DoS Protection:** Passwords $> 72$ characters are rejected with HTTP 400, preventing expensive CPU hashing loops and silent credential truncation.
4. **Server Fingerprint Removal:** `app.disable('x-powered-by')` and Helmet prevent attackers from identifying the underlying server framework.
5. **Security Headers (Helmet):** Enforces `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and CSP defaults.
6. **Timing Attack Elimination:** Constant-time dummy hash comparison is executed when a user email is not found, ensuring uniform response times and stopping user enumeration.
7. **JWT Algorithm Pinning:** Enforces `HS256` explicitly on signing and verification, blocking algorithm substitution attacks.
8. **RFC 6750 Token Handling:** Malformed token user IDs return HTTP `401 Unauthorized` instead of exposing internal Mongoose CastError exceptions.
9. **Environment Configuration:** Live secrets were sanitized from documentation and example configs; `.env` is blocked by `.gitignore`.
10. **Reconnaissance Masking:** In production mode, database hostname and database name are replaced with `[PROTECTED]` on `/api/health`.
11. **Crash Resilience:** Graceful shutdown listeners (`unhandledRejection`, `uncaughtException`) ensure database connections close safely before process termination.
12. **Atomic Deletion:** Note deletion uses atomic `deleteOne()` instead of secondary find-and-delete lookups.
13. **Centralized ObjectId Validator:** Extracted reusable middleware preventing code duplication.

---

## 19. Common Errors & Troubleshooting

| Error | Root Cause | Beginner-Friendly Solution |
| :--- | :--- | :--- |
| `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB service is not running locally. | Open PowerShell as Administrator and run `Start-Service -Name MongoDB`, or verify your `MONGODB_URI` in `.env`. |
| `EADDRINUSE: address already in use :::5000` | Another process is already running on port 5000. | Change `PORT=5001` in your `.env` file, or stop the existing process using `Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess`. |
| `401 Unauthorized: No authentication token provided` | Missing `Authorization` header on protected route. | Ensure your request includes header: `Authorization: Bearer <your_token>`. In Postman, ensure the login request was executed first. |
| `403 Forbidden: Access denied. You do not own this note.` | Authenticated user is trying to access another user's note. | This is an intentional security barrier. You can only view, edit, or delete notes created by your own account. |
| `400 Bad Request: Invalid ID format` | The route parameter is not a 24-character hex string. | Ensure you are passing a valid MongoDB ObjectId (e.g. `6aab78609a8fb66946afd90d`), not arbitrary text like `123` or `undefined`. |

---

## 20. Author & Internship Information

- **Intern Name:** Yashal Sharadrao Shende
- **Degree:** Master of Computer Applications (MCA)
- **Institution:** Ramdeobaba University, Nagpur
- **Program:** BeeSkilled Full Stack Web Development (MERN) Internship
- **GitHub:** [@yashalshende](https://github.com/yashalshende)
- **LinkedIn:** [yashal-shende](https://linkedin.com/in/yashal-shende-9072b22a5)
- **Repository:** [Beeskilled-Internship](https://github.com/yashalshende/Beeskilled-Internship)
- **Evaluation Status:** **100/100 Compliance Score** verified via `npm run test:qa`
