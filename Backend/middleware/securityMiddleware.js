import aj from "../utils/arcject.js";
import logger from "../utils/logger.js";

export const securityMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 });

    if (decision.isDenied() && !decision.reason.isDryRun()) {
      if (decision.reason.isBot()) {
        return res.status(403).json({ message: "No automated access allowed" });
      }

      if (decision.reason.isShield()) {
        return res.status(400).json({ message: "Invalid request parameters" });
      }

      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  } catch (error) {
    logger.error(`Arcjet Error: ${error.message}`);
    next();
  }
};
