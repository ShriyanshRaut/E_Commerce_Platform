import asyncHandler from "../utils/asyncHandler.js";
import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // basic check
  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  // check duplicate
  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    throw new ApiError(400, "Category already exists");
  }

  // create
  const category = await Category.create({
    name: name.trim(),
    description
  });

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});