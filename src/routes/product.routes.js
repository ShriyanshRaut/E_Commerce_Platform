import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { createProduct } from "../controllers/product.controller.js";

const router = Router();

router.post("/", authMiddleware, adminMiddleware, createProduct);

export default router;