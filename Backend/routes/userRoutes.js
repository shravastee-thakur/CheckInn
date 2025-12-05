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

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  sanitizeMiddleware,
  userController.register
);
router.post(
  "/loginStepOne",
  sanitizeMiddleware,
  validate(loginSchema),
  userController.loginStepOne
);
router.post(
  "/verifyLogin",
  sanitizeMiddleware,
  validate(otpValidationSchema),
  userController.verifyOtp
);
router.post("/refreshHandler", userController.refreshHandler);
router.post(
  "/forgetPassword",
  sanitizeMiddleware,
  userController.forgetPassword
);
router.post("/resetPassword", sanitizeMiddleware, userController.resetPassword);
router.post("/logout", authenticate, userController.logout);

export default router;
