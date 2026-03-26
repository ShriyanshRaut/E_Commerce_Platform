import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createOrUpdateReview,
  getProductReviews,
  deleteReview,
} from "../services/review.service.js";

// Create or update a review
const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;

  const review = await createOrUpdateReview(
    req.user._id,
    productId,
    rating,
    comment
  );

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review submitted successfully"));
});

// Get reviews for a product
const getReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const reviews = await getProductReviews(productId);

  return res
    .status(200)
    .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// Delete a review
const removeReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await deleteReview(req.user._id, id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export {
  createReview,
  getReviews,
  removeReview,
};