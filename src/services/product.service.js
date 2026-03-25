import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";

export const createProductService = async (data) => {
  // check category exists
  const categoryExists = await Category.findById(data.category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  const product = await Product.create(data);

  return product;
};