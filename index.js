import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './Routes/AuthRoutes.js'
import studentRoutes from './Routes/StudentRoutes.js'
import teacherRoutes from './Routes/TeacherRoutes.js'
import connectDb from "./Db/db.js";

dotenv.config();

const PORT = (process.env.PORT || 5000)
const app = express()

connectDb();

//middlewares
// Configure allowed origins. Add your deployed frontend URL or set CLIENT_URL in env.
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:3000',
  'https://nobunkzoneharishni.netlify.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())

//routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});
app.use('/api/auth', authRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/teacher', teacherRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

app.listen(PORT ,() => {
    console.log(`app is listening on port ${PORT}`)
})


