import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { getCart } from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authMiddleware, getCart);

export default router;