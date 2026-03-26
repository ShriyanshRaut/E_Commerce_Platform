import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";

// Helper function to update product ratings
const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;

  const avgRating =
    numReviews === 0
      ? 0
      : reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    ratings: avgRating,
    numReviews: numReviews,
  });
};

// Create or update a review
const createOrUpdateReview = async (userId, productId, rating, comment) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if review already exists
  let review = await Review.findOne({
    user: userId,
    product: productId,
  });

  if (review) {
    // Update existing review
    review.rating = rating;
    review.comment = comment;
    await review.save();
  } else {
    // Create new review
    review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });
  }

  // Recalculate product ratings
  await updateProductRatings(productId);

  return review;
};

// Get all reviews for a product
const getProductReviews = async (productId) => {
  const reviews = await Review.find({ product: productId })
    .populate("user", "fullName avatar");

  return reviews;
};

// Delete a review
const deleteReview = async (userId, reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Only owner can delete
  if (review.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized to delete this review");
  }

  const productId = review.product;

  await review.deleteOne();

  // Recalculate ratings after deletion
  await updateProductRatings(productId);

  return;
};

export {
  createOrUpdateReview,
  getProductReviews,
  deleteReview,
};