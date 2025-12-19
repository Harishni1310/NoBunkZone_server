import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./Routes/AuthRoutes.js";
import studentRoutes from "./Routes/StudentRoutes.js";
import teacherRoutes from "./Routes/TeacherRoutes.js";
import connectDb from "./Db/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// DB connection
connectDb();

// ✅ MIDDLEWARES
app.use(express.json());

// ✅ CORS CONFIGURATION (FIXED)
app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "http://localhost:3000",
      "https://nobunkzoneharishni.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// ROUTES
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// SERVER
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
