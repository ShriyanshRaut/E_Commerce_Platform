import asyncHandler from "../utils/asyncHandler.js";
import { getCartService } from "../services/cart.service.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartService(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});