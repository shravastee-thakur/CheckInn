import express from "express";
import * as userController from "../controllers/UserController.js";
import {
  loginSchema,
  otpValidationSchema,
  registerSchema,
} from "../validators/userValidator.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { sanitizeMiddleware } from "../middleware/sanitize.js";
import { validate } from "../middleware/validate.js";
import { rateLimiterMiddleware } from "../middleware/rateLimiter.js";
import { securityMiddleware } from "../middleware/securityMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  sanitizeMiddleware,
  userController.register
);
router.post(
  "/loginStepOne",
  securityMiddleware,
  sanitizeMiddleware,
  validate(loginSchema),
  rateLimiterMiddleware(5, 60),
  userController.loginStepOne
);
router.post(
  "/verifyLogin",
  securityMiddleware,
  sanitizeMiddleware,
  validate(otpValidationSchema),
  userController.verifyOtp
);
router.post("/refreshHandler", userController.refreshHandler);
router.post(
  "/forgetPassword",
  sanitizeMiddleware,
  rateLimiterMiddleware(3, 60),
  userController.forgetPassword
);
router.post("/resetPassword", sanitizeMiddleware, userController.resetPassword);
router.post("/logout", authenticate, userController.logout);

export default router;
