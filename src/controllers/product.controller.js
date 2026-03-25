import asyncHandler from "../utils/asyncHandler.js";
import { createProductSchema } from "../validators/product.validator.js";
import { createProductService } from "../services/product.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createProduct = asyncHandler(async (req, res) => {
  const parsed = createProductSchema.safeParse(req.body);

  if (!parsed.success) {
    const msg = parsed.error?.issues?.[0]?.message || "Invalid input";
    throw new ApiError(400, msg);
  }

  const product = await createProductService(parsed.data);

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});