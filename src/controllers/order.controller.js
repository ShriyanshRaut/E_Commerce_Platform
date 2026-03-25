import asyncHandler from "../utils/asyncHandler.js";
import { createOrderService } from "../services/order.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { createOrderSchema } from "../validators/order.validator.js";
import ApiError from "../utils/ApiError.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  const order = await createOrderService(req.user._id, shippingAddress);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});