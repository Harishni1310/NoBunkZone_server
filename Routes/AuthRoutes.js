import express from "express";
import { login, register } from "../Controller/AuthController.js";
import User from "../Model/UserModel.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/test", async (req, res) => {
  try {
    const users = await User.findOne();
    res.json({ msg: "Database connected", userCount: users ? 1 : 0 });
  } catch (error) {
    res.status(500).json({ msg: "Database error", error: error.message });
  }
});

export default router;
