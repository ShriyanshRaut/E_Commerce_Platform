import express from "express";
import {
  createReview,
  getReviews,
  removeReview,
} from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create or update review
router.post("/", protect, createReview);

// Get reviews for a product
router.get("/:productId", getReviews);

// Delete review
router.delete("/:id", protect, removeReview);

export default router;