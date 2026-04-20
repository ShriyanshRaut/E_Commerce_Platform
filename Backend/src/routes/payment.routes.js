import { Router } from "express";
import {
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔥 create order
router.post("/create-order", protect, createRazorpayOrder);

// 🔥 verify payment
router.post("/verify", protect, verifyPayment);

export default router;