import express from "express";
import jwt from "jsonwebtoken";
import {
  addStudent,
  markAttendance,
  getLeaves,
  updateLeave,
  getStudents,
  updateStudent,
  deleteStudent,
  getAttendance,
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
} from "../Controller/TeacherController.js";

const router = express.Router();

const protectTeacher = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin" && decoded.role !== "teacher")
      return res.status(403).json({ msg: "Access denied" });

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

router.get("/students", protectTeacher, getStudents);
router.post("/student", protectTeacher, addStudent);
router.put("/student/:id", protectTeacher, updateStudent);
router.delete("/student/:id", protectTeacher, deleteStudent);

router.get("/attendance", protectTeacher, getAttendance);
router.post("/attendance", protectTeacher, markAttendance);

router.get("/leaves", protectTeacher, getLeaves);
router.put("/leave/:id", protectTeacher, updateLeave);

router.get("/todos", protectTeacher, getTodos);
router.post("/todo", protectTeacher, addTodo);
router.put("/todo/:id", protectTeacher, updateTodo);
router.delete("/todo/:id", protectTeacher, deleteTodo);

export default router;
