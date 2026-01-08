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
app.use(cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:3000',
    'https://nobunkzoneharishni.netlify.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

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