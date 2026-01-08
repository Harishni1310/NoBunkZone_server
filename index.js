import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './Routes/AuthRoutes.js';
import studentRoutes from './Routes/StudentRoutes.js';
import teacherRoutes from './Routes/TeacherRoutes.js';
import connectDb from "./Db/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Connect to DB
connectDb();

// --- Middlewares ---
// CORS Configuration for Production
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:3000', 
  'https://slamportal.netlify.app',  // ✅ Your actual Netlify URL
  'https://nobunkzoneharishni.netlify.app',  // Keep backup URL
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
}));
// Manual OPTIONS handler for additional preflight support
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(express.json());

// Debug middleware to log requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// --- Routes ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// ✅ Mount routes correctly
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});