
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import UsersRouter from './routers/Users.js';
import AttendanceRouter from './routers/Attendance.js';
import { connectDB } from './utils/db.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ====== Rate Limiting Middleware ======
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: "Too many requests from this IP, please try again later."
});

// Apply rate limiter to all requests
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
// const db = process.env.MONGO_URI || 'mongodb://localhost:27017/face';
connectDB()


// Routes
app.use('/api/users', UsersRouter);
app.use('/api/attendance', AttendanceRouter);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => 
  console.log(`🚀 Server started on port ${PORT}`)
);
