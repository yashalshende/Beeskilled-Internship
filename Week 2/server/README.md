# Week 2 Backend Server Architecture

**BeeSkilled Full Stack Web Development (MERN) Internship — Week 2 Foundation**

---

## 📌 Architecture Overview
This server provides the backend foundation for Week 2, built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**. It features an MVC architecture with centralized error handling, environment configuration, CORS, and an integrated health check endpoint.

```
Week 2/server/
├── package.json
├── .env.example
├── README.md
└── src/
    ├── config/
    │   └── db.js                 <-- Mongoose MongoDB connection
    ├── controllers/              <-- Business logic handlers
    ├── middleware/
    │   └── errorMiddleware.js    <-- Centralized error & 404 handlers
    ├── models/                   <-- Mongoose data schemas
    ├── routes/
    │   └── healthRoutes.js       <-- Health check route
    ├── utils/                    <-- Helper functions & tokens
    ├── app.js                    <-- Express application configuration
    └── server.js                 <-- HTTP server bootstrap & graceful shutdown
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd "Week 2/server"
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and verify parameters:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/beeskilled_week2
JWT_SECRET=beeskilled_mern_internship_super_secure_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
```

### 3. Start Development Server
```bash
npm run dev
# Or for production:
npm start
```

---

## 🔍 Health Check Endpoint
- **URL:** `http://localhost:5000/api/health`
- **Method:** `GET`
- **Sample Response:**
```json
{
  "success": true,
  "status": 200,
  "message": "BeeSkilled Week 2 Backend API is healthy and operational.",
  "timestamp": "2026-09-15T18:00:00.000Z",
  "uptime": "12 seconds",
  "environment": "development",
  "database": {
    "status": "Connected",
    "host": "127.0.0.1",
    "name": "beeskilled_week2"
  }
}
```
