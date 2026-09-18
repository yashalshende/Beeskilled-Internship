# Week 2 - Backend Fundamentals, REST APIs, MongoDB & Authentication

Welcome to **Week 2** of the BeeSkilled Full Stack Web Development (MERN) Internship.

**Candidate:** Yashal Sharadrao Shende  
**Focus:** Node.js, Express.js, MongoDB, Mongoose, REST API Design, JWT Authentication & bcrypt  

---

## 📂 Week 2 Architecture

The backend foundation is housed in [`server/`](./server):

```
Week 2/
├── README.md                          <-- Week 2 overview (this file)
└── server/                            <-- Unified Express + MongoDB backend
    ├── package.json
    ├── .env.example
    ├── README.md
    └── src/
        ├── config/                    <-- Database connection
        ├── controllers/               <-- Route controllers
        ├── middleware/                <-- Centralized error & auth middleware
        ├── models/                    <-- Mongoose schemas
        ├── routes/                    <-- API route definitions
        ├── utils/                     <-- Helper utilities
        ├── app.js                     <-- Express app setup
        └── server.js                  <-- Server startup & graceful exit
```

---

## 📅 Week 2 Curriculum Roadmap

| Milestone | Topic | Key Deliverables | Status |
| :--- | :--- | :--- | :---: |
| **Foundation** | **Express & MongoDB Setup** | MVC structure, MongoDB connection, CORS, Centralized Error Handling, `/api/health` | 🚀 **Completed** |
| **Assignment 1** | **To-Do List REST API** | Full CRUD endpoints (`POST`, `GET`, `PUT`, `DELETE`), Task Model, Validation & Automated Tests | 🚀 **Completed** |
| **Assignment 2** | **User Authentication API** | Register, Login, bcrypt password hashing, JWT generation, protected profile | 🚀 **Completed** |
| **Mini Project** | **Notes App Backend** | User-scoped notes CRUD, JWT-protected routes, ownership authorization, 10-step test flow | 🚀 **Completed** |

---

## 🛠️ Assignment 1: To-Do List REST API Endpoints

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/tasks` | Create a new task (validates required `title`) | `201`, `400`, `500` |
| `GET` | `/api/tasks` | Get all tasks (supports `?completed=true/false`, `?search=...`, `?sort=asc/desc`) | `200`, `500` |
| `GET` | `/api/tasks/:id` | Get a single task by ID | `200`, `400`, `404`, `500` |
| `PUT` | `/api/tasks/:id` | Update task title, description, or completed status | `200`, `400`, `404`, `500` |
| `DELETE` | `/api/tasks/:id` | Delete task by ID | `200`, `400`, `404`, `500` |

---

## 🔐 Assignment 2: User Authentication API Endpoints

| Method | Endpoint | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/auth/register` | Register user (`name`, `email`, `password`), hashes with bcryptjs | No | `201`, `400`, `500` |
| `POST` | `/api/auth/login` | Login user, verify bcrypt password, issue signed JWT | No | `200`, `400`, `401`, `500` |
| `GET` | `/api/auth/profile` | Retrieve authenticated user profile | Yes (`Bearer <token>`) | `200`, `401`, `500` |
| `GET` | `/api/auth/me` | Alias for authenticated user profile | Yes (`Bearer <token>`) | `200`, `401`, `500` |

---

## 📓 Mini Project: Notes App Backend Endpoints

| Method | Endpoint | Description | Auth Required | Status Codes |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/api/notes` | Create a new user-scoped note (`title`, `content`) | Yes (`Bearer <token>`) | `201`, `400`, `401`, `500` |
| `GET` | `/api/notes` | List only notes owned by authenticated user | Yes (`Bearer <token>`) | `200`, `401`, `500` |
| `GET` | `/api/notes/:id` | Get single note by ID (enforces ownership) | Yes (`Bearer <token>`) | `200`, `400`, `401`, `403`, `404`, `500` |
| `PUT` | `/api/notes/:id` | Update note by ID (enforces ownership) | Yes (`Bearer <token>`) | `200`, `400`, `401`, `403`, `404`, `500` |
| `DELETE` | `/api/notes/:id` | Delete note by ID (enforces ownership) | Yes (`Bearer <token>`) | `200`, `400`, `401`, `403`, `404`, `500` |

---

## 🚀 Running the Server & Tests

```bash
cd "Week 2/server"
npm install

# Start development server
npm run dev
# Server runs at: http://localhost:5000
# Health Check: http://localhost:5000/api/health
# Tasks API:    http://localhost:5000/api/tasks
# Auth API:     http://localhost:5000/api/auth
# Notes API:    http://localhost:5000/api/notes

# Run all 4 test suites (49 Task + 48 Auth + 54 Notes + 24 Security = 175 total assertions)
npm test

# Or run individual test suites:
npm run test:tasks       # Assignment 1: To-Do REST API (49 assertions)
npm run test:auth        # Assignment 2: Authentication API (48 assertions)
npm run test:notes       # Mini Project: Notes REST API (54 assertions)
npm run test:security    # Security Hardening & Edge Cases (24 assertions)
npm run test:postman     # Newman Postman Runner (14 requests, 30 assertions)
npm run test:qa          # Live Internship QA Evaluator (39/39 PASS, 100/100 score)

For full architectural documentation, security details, and API design, see:
👉 [Week 2 Server Master Documentation](./server/README.md)
```
