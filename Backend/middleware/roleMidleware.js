import { ApiError } from "../utils/ApiError.js";

export const allowRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError(401, "Unauthorized");
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError(403, "Access denied: insufficient permissions");
    }
    next();
  };
};
