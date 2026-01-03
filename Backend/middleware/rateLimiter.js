import rateLimit from "../services/rateLimitService.js";

export const rateLimiterMiddleware = (limit, windowSec) => {
  return async (req, res, next) => {
    const key = req.ip;

    const blocked = await rateLimit(key, limit, windowSec);

    if (blocked) {
      return res.status(429).json({ message: "Too many requests" });
    }

    next();
  };
};
