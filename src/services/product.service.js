import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import ApiError from "../utils/ApiError.js";
import redis from "../config/redis.js";

export const createProductService = async (data) => {
  // check category exists
  const categoryExists = await Category.findById(data.category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  const product = await Product.create(data);

  await redis.del("products:all");

  return product;
};

export const getAllProductsService = async () => {
  const cacheKey = "products:all";

  // 1. Check cache
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("Cache HIT ⚡");
    return JSON.parse(cached);
  }

  console.log("Cache MISS ");

  // 2. Fetch from DB
  const products = await Product.find().lean();

  // 3. Store in Redis (60 sec)
  await redis.set(cacheKey, JSON.stringify(products), "EX", 60);

  return products;
};