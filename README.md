# BeeSkilled Full Stack Web Development (MERN) Internship

Welcome to the official repository for my **BeeSkilled Full Stack Web Development (MERN)** Internship program.

## 👨‍💻 Candidate Information
- **Name:** Yashal Sharadrao Shende
- **Education:** Master of Computer Applications (MCA), Ramdeobaba University, Nagpur
- **GitHub:** [@yashalshende](https://github.com/yashalshende)
- **LinkedIn:** [yashal-shende](https://linkedin.com/in/yashal-shende-9072b22a5)
- **Email:** shendeyashal@gmail.com
- **Internship Program:** BeeSkilled MERN Stack Internship 2026

---

## 📅 Internship Curriculum Roadmap

| Week | Focus Area | Deliverables | Status | Directory |
| :--- | :--- | :--- | :---: | :--- |
| **Week 1** | **Frontend Fundamentals & React Basics** | Personal Portfolio, React Component Practice, React Blog UI | 🚀 **Completed** | [`Week 1/`](./Week%201) |
| **Week 2** | **Backend Fundamentals, REST APIs, MongoDB & Authentication** | To-Do REST API, Auth API (bcrypt + JWT), Notes Backend, Postman Suite, Security Hardening | 🚀 **Completed** | [`Week 2/`](./Week%202) |
| **Week 3** | **Full Stack Integration & State Management** | React + Express API Integration, Context API / Redux, Dynamic Dashboard | ⏳ Upcoming | [`Week 3/`](./Week%203) |
| **Week 4** | **Full MERN Capstone Project** | Full MERN Deployment, Advanced Security, Cloud Storage & Testing | ⏳ Upcoming | [`Week 4/`](./Week%204) |

---

## 📂 Week 1 Overview: Frontend Engineering & React UI

Week 1 focused on modern semantic frontend markup, responsive design principles, component-driven UI architecture, and dynamic React state management:

1. **[`Assignment 1 - Personal Portfolio`](./Week%201/Assignment%201%20-%20Personal%20Portfolio/)** — Responsive personal portfolio built with semantic HTML5, modern CSS3 (Flexbox/Grid), and interactive JavaScript with client-side form validation.
2. **[`Assignment 2 - React Component Practice`](./Week%201/Assignment%202%20-%20React%20Component%20Practice/)** — Modular reusable React components (`Header`, `Footer`, `Card`, `Button`, `Form`) demonstrating props, state, events, and dynamic rendering.
3. **[`Mini Project - React Blog UI`](./Week%201/Mini%20Project%20-%20React%20Blog%20UI/)** — Dynamic React blog engine consuming `posts.json`, featuring combined real-time search, category filters, and interactive empty states.

---

## 📂 Week 2 Overview: REST APIs, MongoDB & Authentication

Week 2 established the core backend architecture using **Node.js (v24)**, **Express.js**, **MongoDB**, and **Mongoose**. All endpoints strictly conform to REST conventions, standardized JSON envelopes, stateless JWT authentication, and cryptographic password hashing with bcrypt.

Detailed documentation is available in [`Week 2/server/README.md`](./Week%202/server/README.md).

### 🚀 Week 2 Modules Implemented

```
Week 2/server/
├── package.json                       <-- Dependencies & test scripts
├── .env.example                       <-- Safe configuration template
├── README.md                          <-- Comprehensive master backend guide
└── src/
    ├── app.js                         <-- Express application configuration & middleware
    ├── server.js                      <-- Server bootstrap & graceful process termination
    ├── config/db.js                   <-- Mongoose MongoDB connection & event handlers
    ├── controllers/                   <-- MVC controllers (Tasks, Auth, Notes)
    ├── middleware/                    <-- Auth, error handling, input validation, ObjectId checks
    ├── models/                        <-- Mongoose schemas (Task, User, Note)
    ├── routes/                        <-- Express route routers (/api/health, /tasks, /auth, /notes)
    ├── tests/                         <-- 4 test suites + Live QA Evaluator (100/100 score)
    └── utils/                         <-- JWT signing/verification & ReDoS regex sanitizer
```

#### 1. Assignment 1: To-Do List REST API
- **Task Model:** Schema containing `title`, `description`, `completed`, and timestamps (`createdAt`, `updatedAt`).
- **Complete CRUD Endpoints:**
  - `POST /api/tasks` — Create task with validated non-empty title.
  - `GET /api/tasks` — List tasks with pagination (`?page=&limit=`), search (`?search=`), completion filtering (`?completed=`), and sorting (`?sort=`).
  - `GET /api/tasks/:id` — Retrieve task by 24-character ObjectId.
  - `PUT /api/tasks/:id` — Update title, description, or completion state.
  - `DELETE /api/tasks/:id` — Permanently remove task.
- **Validation & Safety:** Hexadecimal ObjectId validation prevents database crashes.

#### 2. Assignment 2: User Authentication API
- **User Model:** Schema with `name`, normalized `email`, hashed `password` (`select: false`), and timestamps.
- **Endpoints:**
  - `POST /api/auth/register` — Validates input, prevents duplicate emails, hashes password via bcrypt (10 salt rounds), and issues JWT.
  - `POST /api/auth/login` — Verifies credentials with constant-time comparison (timing attack defense) and returns JWT token.
  - `GET /api/auth/profile` — Protected endpoint returning user details via `Authorization: Bearer <token>`.
- **Stateless JWT Security:** Enforces `HS256` algorithm pinning and automatic expiration (`7d`).

#### 3. Mini Project: Notes App Backend
- **Note Model:** References `User` model using Mongoose ObjectId (`ref: 'User'`).
- **User Ownership & Isolation:** All routes (`POST`, `GET`, `GET :id`, `PUT`, `DELETE` on `/api/notes`) require valid JWT. Users can only access and modify their own notes; attempting to access another user's note returns HTTP **`403 Forbidden`**.
- **Optimized Indexing:** Compound index `{ user: 1, createdAt: -1 }` guarantees rapid query performance.

---

## 🧪 Comprehensive Verification & QA Evaluation

### 1. Test Coverage Summary
All tests run with zero external test framework dependencies:

```bash
cd "Week 2/server"
npm test
```

- **Tasks Test Suite (`src/tests/task.test.js`):** 49/49 assertions passed
- **Auth Test Suite (`src/tests/auth.test.js`):** 48/48 assertions passed
- **Notes Test Suite (`src/tests/note.test.js`):** 54/54 assertions passed
- **Security Hardening Suite (`src/tests/security.test.js`):** 24/24 assertions passed
- **Grand Total:** **175 / 175 Assertions Passed (100% Success)**

### 2. Postman Collection & Newman
- **Collection:** [`postman/BeeSkilled_Week2_API.postman_collection.json`](./postman/BeeSkilled_Week2_API.postman_collection.json)
- **Environment:** [`postman/BeeSkilled_Week2_Env.postman_environment.json`](./postman/BeeSkilled_Week2_Env.postman_environment.json)
- **Newman Verification:** 14 requests executed, 30 assertions passed, 0 failures.
  ```bash
  npm run test:postman
  ```

### 3. Live Internship QA Evaluation
- **Live QA Script:** [`Week 2/server/src/tests/qa_evaluator.js`](./Week%202/server/src/tests/qa_evaluator.js)
- **Execution:**
  ```bash
  npm run test:qa
  ```
- **Official QA Result:** **39 / 39 Evaluator Criteria Passed (Compliance Score: 100 / 100)**.

---

## 🛡️ Key Security Features Implemented
- **ReDoS Mitigation:** Input sanitization (`escapeRegex`) prevents catastrophic regular expression backtracking.
- **Bcrypt DoS Protection:** Password length restricted to 72 characters, matching bcrypt's algorithmic limit and preventing CPU exhaustion.
- **Timing Attack Defense:** Non-existent emails trigger dummy bcrypt comparisons to equalize response latencies.
- **Rate Limiting:** `express-rate-limit` prevents brute-force credential stuffing on `/api/auth`.
- **Security Headers:** `helmet` sets restrictive HTTP response headers and suppresses `X-Powered-By`.
- **Environment Isolation:** Zero hardcoded secrets; `.env` is protected by `.gitignore`.

---

## ⚡ Quick Start: Running Week 2 Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yashalshende/Beeskilled-Internship.git
   cd Beeskilled-Internship/"Week 2/server"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

4. **Start MongoDB and run server:**
   ```bash
   npm run dev
   ```
   Server will listen on `http://localhost:5000`. Health check is available at `http://localhost:5000/api/health`.
