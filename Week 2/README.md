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
| **Assignment 1** | **To-Do List REST API** | Full CRUD endpoints (`POST`, `GET`, `PUT`, `DELETE`), Task Model, Postman suite | ⏳ Upcoming |
| **Assignment 2** | **User Authentication API** | Register, Login, bcrypt password hashing, JWT generation, protected profile | ⏳ Upcoming |
| **Mini Project** | **Notes App Backend** | User-scoped notes CRUD, JWT-protected routes, category filters, Postman tests | ⏳ Upcoming |

---

## 🚀 Running the Server

```bash
cd "Week 2/server"
npm install
npm run dev
# Server runs at: http://localhost:5000
# Health Check: http://localhost:5000/api/health
```
