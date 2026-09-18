# BeeSkilled Internship — Week 2 Submission Documentation
## Backend Fundamentals, REST APIs, MongoDB & Authentication

---

### 👨‍💻 Candidate & Submission Information
- **Candidate Name:** Yashal Sharadrao Shende
- **Degree / Institute:** Master of Computer Applications (MCA), Ramdeobaba University, Nagpur
- **Email:** shendeyashal@gmail.com
- **LinkedIn:** [linkedin.com/in/yashal-shende-9072b22a5](https://linkedin.com/in/yashal-shende-9072b22a5)
- **GitHub Profile:** [@yashalshende](https://github.com/yashalshende)
- **Repository:** [Beeskilled-Internship](https://github.com/yashalshende/Beeskilled-Internship)
- **Program:** BeeSkilled Full Stack Web Development (MERN) Internship 2026
- **Submission:** Week 2 (Backend Foundation, Assignment 1, Assignment 2 & Mini Project)

---

## 📋 Executive Summary & Deliverables

Week 2 delivers an enterprise-grade backend architecture built with **Node.js (v24)**, **Express.js**, **MongoDB**, and **Mongoose**. All endpoints strictly adhere to REST conventions, standardized JSON response envelopes, cryptographic password hashing with **bcrypt**, stateless **JWT** authentication, fine-grained cross-user authorization barriers, and defensive security measures.

### 🌟 Deliverables Summary:
1. **Express & MongoDB Backend Foundation:** Modular MVC architecture, robust Mongoose connection pooling with reconnection handling, CORS, Helmet security headers, rate limiting, and centralized error handling.
2. **Assignment 1 — To-Do List REST API:** Complete CRUD endpoints (`POST`, `GET`, `GET :id`, `PUT`, `DELETE`), Mongoose Task model, input validation, 24-character hexadecimal ObjectId verification, and query filtering/pagination.
3. **Assignment 2 — User Authentication API:** Secure registration, duplicate email rejection, bcrypt password hashing (10 salt rounds), login authentication with constant-time comparison (timing attack defense), RFC 7519 signed JWT tokens with 7-day expiration, and JWT verification middleware.
4. **Mini Project — Notes App Backend:** User-scoped notes with database reference to User model, compound indexing (`{ user: 1, createdAt: -1 }`), full CRUD functionality, and strict cross-user authorization barriers (accessing another user's note yields HTTP **`403 Forbidden`**).
5. **Quality Assurance & Testing:** 
   - **4 Automated Test Suites** (175 assertions, 100% pass rate)
   - **Postman / Newman Test Suite** (14 requests, 30 assertions, 0 failures)
   - **Live QA Evaluator** (39/39 criteria passed, Compliance Score: **100/100**)
   - **Interactive Browser Visual Test Runner** (16/16 visual tests passed, 100% pass rate)

---

## 🏛️ Project Architecture

```
Week 2/
├── README.md                                 # Week 2 Curriculum overview
├── SUBMISSION_DOCUMENTATION.md               # Master submission document (this file)
├── test_evidence_visual_suite.png            # Visual verification test evidence (100% pass)
├── postman/                                  # Postman Collection & Environment
│   ├── BeeSkilled_Week2_API.postman_collection.json
│   └── BeeSkilled_Week2_Env.postman_environment.json
└── server/                                   # Unified Express + MongoDB Backend
    ├── package.json                          # Scripts & dependencies
    ├── package-lock.json
    ├── .env.example                          # Sanitized environment template
    ├── .gitignore                            # Protected secrets (.env) & node_modules
    ├── README.md                             # Comprehensive technical guide
    └── src/
        ├── app.js                            # Express app, middlewares, CORS & Helmet
        ├── server.js                         # Bootstrap & graceful process termination
        ├── config/
        │   └── db.js                         # Mongoose MongoDB connection & lifecycle events
        ├── controllers/
        │   ├── authController.js             # Register, Login, Profile controllers
        │   ├── noteController.js             # User-scoped Notes CRUD & authorization
        │   └── taskController.js             # To-Do Tasks CRUD, filtering & pagination
        ├── middleware/
        │   ├── authMiddleware.js             # JWT Bearer token extraction & verification
        │   ├── authValidation.js             # Auth input sanitization & validation
        │   ├── errorMiddleware.js            # 404 handler & centralized error handler
        │   ├── noteValidation.js             # Note validation rules
        │   ├── taskValidation.js             # Task validation rules
        │   └── validateObjectId.js           # 24-character hexadecimal ObjectId guard
        ├── models/
        │   ├── Note.js                       # Note schema with User reference & indexes
        │   ├── Task.js                       # Task schema with title, completed & timestamps
        │   └── User.js                       # User schema with bcrypt hashing & select:false
        ├── routes/
        │   ├── authRoutes.js                 # /api/auth endpoints
        │   ├── healthRoutes.js               # /api/health endpoint
        │   ├── noteRoutes.js                 # /api/notes endpoints
        │   └── taskRoutes.js                 # /api/tasks endpoints
        ├── tests/
        │   ├── auth.test.js                  # 48 authentication assertions
        │   ├── note.test.js                  # 54 notes & authorization assertions
        │   ├── task.test.js                  # 49 task CRUD assertions
        │   ├── security.test.js              # 24 security hardening assertions
        │   ├── qa_evaluator.js               # 39-criteria live compliance evaluator
        │   └── visual_test.html              # Interactive browser visual test harness
        └── utils/
            ├── jwt.js                        # JWT signing & verification utilities
            └── sanitize.js                   # ReDoS & regex injection defense sanitizer
```

---

## 📡 Complete REST API Endpoint Specification

### 1. Foundation & Health Check
| Method | Endpoint | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `GET` | `/api/health` | Service health status, database connection, uptime & memory | No | `200`, `500` |

### 2. Assignment 1: To-Do List REST API
| Method | Endpoint | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/tasks` | Create task (validates required `title`) | No | `201`, `400`, `500` |
| `GET` | `/api/tasks` | Get all tasks (supports `?completed=`, `?search=`, `?page=`, `?limit=`, `?sort=`) | No | `200`, `500` |
| `GET` | `/api/tasks/:id` | Get single task by 24-character ObjectId | No | `200`, `400`, `404`, `500` |
| `PUT` | `/api/tasks/:id` | Update task title, description, or completed state | No | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/tasks/:id` | Permanently remove task by ID | No | `200`, `400`, `404`, `500` |

### 3. Assignment 2: User Authentication API
| Method | Endpoint | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/auth/register` | Register new user (hashes password with bcrypt, issues JWT) | No | `201`, `400`, `500` |
| `POST` | `/api/auth/login` | Login user, verify password with bcrypt, issue JWT | No | `200`, `400`, `401`, `500` |
| `GET` | `/api/auth/profile` | Retrieve authenticated user profile | Yes (`Bearer <token>`) | `200`, `401`, `500` |
| `GET` | `/api/auth/me` | Alias for authenticated user profile | Yes (`Bearer <token>`) | `200`, `401`, `500` |

### 4. Mini Project: Notes App Backend (User-Scoped & Isolated)
| Method | Endpoint | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/notes` | Create user-scoped note (`title`, `content`) | Yes (`Bearer <token>`) | `201`, `400`, `401`, `500` |
| `GET` | `/api/notes` | List only notes belonging to authenticated user | Yes (`Bearer <token>`) | `200`, `401`, `500` |
| `GET` | `/api/notes/:id` | Get single note (enforces strict user ownership) | Yes (`Bearer <token>`) | `200`, `400`, `401`, `403`, `404`, `500` |
| `PUT` | `/api/notes/:id` | Update note (enforces strict user ownership) | Yes (`Bearer <token>`) | `200`, `400`, `401`, `403`, `404`, `500` |
| `DELETE` | `/api/notes/:id` | Delete note (enforces strict user ownership) | Yes (`Bearer <token>`) | `200`, `400`, `401`, `403`, `404`, `500` |

---

## 🛡️ Enterprise Security & Hardening Features

- **Standardized Response Envelope:** Every single API response conforms to:
  ```json
  {
    "success": true,
    "message": "Descriptive status message",
    "data": { ... }
  }
  ```
- **Bcrypt Hash Protection:** Salt rounds set to 10; password length capped at 72 bytes to prevent bcrypt CPU exhaustion DoS; password hash excluded by default (`select: false`).
- **Timing Attack Defense:** Login controller performs a simulated bcrypt hash comparison on non-existent emails to ensure constant-time response latency, defeating email enumeration attacks.
- **Cross-User Authorization Defense:** Any user attempting to read, update, or delete a note belonging to another user receives HTTP **`403 Forbidden`** with `success: false`.
- **ReDoS Regular Expression Defense:** All user search inputs are sanitized through an `escapeRegex` utility prior to Mongoose query execution.
- **Rate Limiting:** Authentication routes are protected by `express-rate-limit` (100 requests per 15-minute window).
- **Security Headers & Fingerprinting:** `helmet` sets `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and removes `X-Powered-By`.

---

## 🧪 Comprehensive Verification & Test Results

### 1. Automated Native Test Suites (`npm test`)
Zero external testing framework dependencies; runs cleanly on Node.js:
- **Assignment 1 Suite (`src/tests/task.test.js`):** **49 / 49 Passed (100%)**
- **Assignment 2 Suite (`src/tests/auth.test.js`):** **48 / 48 Passed (100%)**
- **Mini Project Suite (`src/tests/note.test.js`):** **54 / 54 Passed (100%)**
- **Security Audit Suite (`src/tests/security.test.js`):** **24 / 24 Passed (100%)**
- **Total Assertions:** **175 / 175 Passed (100% Success Rate)**

### 2. Postman / Newman Test Suite (`npm run test:postman`)
- **Requests Executed:** 14 / 14 Passed
- **Assertions Evaluated:** 30 / 30 Passed
- **Failures:** 0

### 3. Live Internship QA Evaluator (`npm run test:qa`)
- **Total Strict Criteria Evaluated:** 39
- **Criteria Passed:** 39 / 39
- **Compliance Score:** **100 / 100**

### 4. Interactive Visual Test Suite (`src/tests/visual_test.html`)
- **Visual Tests:** 16 / 16 Passed
- **Pass Rate:** **100%**
- **Average Latency:** < 15ms per endpoint

---

## ⚡ Quick Start: How Evaluators Can Run the Project

1. **Prerequisites:** Node.js (v18+) and MongoDB installed and running locally on port 27017.
2. **Install Dependencies:**
   ```bash
   cd "Week 2/server"
   npm install
   ```
3. **Configure Environment:**
   ```bash
   cp .env.example .env
   ```
4. **Start Server:**
   ```bash
   npm run dev
   # Server listens on http://localhost:5000
   ```
5. **Run All Tests:**
   ```bash
   npm test               # Run all 175 unit/integration assertions
   npm run test:qa        # Run 39-criteria live compliance evaluator
   npm run test:postman   # Run 14-request Newman Postman test suite
   ```
6. **Open Visual Test Harness in Browser:**
   Open `Week 2/server/src/tests/visual_test.html` in any browser while the server is running.
