import express from "express";
import jwt from "jsonwebtoken";
import {
  getProfile,
  myAttendance,
  applyLeave,
  myLeaves
} from "../Controller/StudentController.js";

const router = express.Router();

const protectStudent = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "student")
      return res.status(403).json({ msg: "Access denied" });

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

router.get("/profile", protectStudent, getProfile);
router.get("/attendance", protectStudent, myAttendance);
router.post("/leave", protectStudent, applyLeave);
router.get("/leaves", protectStudent, myLeaves);

export default router;
