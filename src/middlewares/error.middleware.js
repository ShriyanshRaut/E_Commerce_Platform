import ApiError from "../utils/ApiError.js";

const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // If error is NOT ApiError → convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;

    error = new ApiError(
      statusCode,
      error.message || "Internal Server Error",
      error.errors || [],
      err.stack
    );
  }

  // Final response
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export default errorMiddleware;