import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
} from "../controllers/cart.controller.js";

const router = Router();

// Get cart
router.get("/", protect, getCart);

// Add to cart
router.post("/add", protect, addToCart);

// Update quantity
router.patch("/update", protect, updateCartItem);

// Remove item
router.delete("/remove", protect, removeCartItem);

//  THIS LINE IS THE MOST IMPORTANT
export default router;