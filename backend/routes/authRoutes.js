// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/register — Register new user
router.post("/register", registerUser);

// POST /api/auth/login — Login existing user
router.post("/login", loginUser);

export default router;
