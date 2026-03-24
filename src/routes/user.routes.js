import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { registerUser, loginUser, getCurrentUser } from "../controllers/user.controller.js";

const router = Router();
router.get(
  "/admin-test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
  }
);

// Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
// Protected Route
router.get("/me", authMiddleware, getCurrentUser);

export default router;