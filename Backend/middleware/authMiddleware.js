import { verifyAccessToken } from "../utils/jwt.js";
import * as userService from "../services/userService.js";
import logger from "../utils/logger.js";
import { ApiError } from "../utils/ApiError.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError(401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);
    if (!decoded || !decoded.id) {
      throw ApiError(401, "Unauthorized: Invalid token");
    }

    const user = await userService.getUserById(decoded.id);
    if (!user) {
      throw ApiError(401, "Unauthorized: User no longer exists");
    }

    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error(`Error in authMiddleware ${error.message}`);
    console.error(error);
  }
};
