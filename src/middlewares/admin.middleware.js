import ApiError from "../utils/ApiError.js";

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  if (req.user.role !== "admin") {
    throw new ApiError(403, "Forbidden: Admin access only");
  }

  next();
};

export default adminMiddleware;