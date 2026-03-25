import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import { createCategory, getAllCategories } from "../controllers/category.controller.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", authMiddleware, adminMiddleware, createCategory);

export default router;