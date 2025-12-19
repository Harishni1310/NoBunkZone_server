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

// Connect to database
connectDb().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

// ✅ Single CORS setup
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:3000', 
  'https://nobunkzoneharishni.netlify.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});