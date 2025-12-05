import joi from "joi";

export const registerSchema = joi.object({
  username: joi.string().required().trim().messages({
    "string.empty": "Username is required",
  }),
  email: joi.string().email().trim().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: joi.string().min(6).max(14).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

export const loginSchema = joi.object({
  email: joi.string().email().trim().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: joi.string().min(6).max(14).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

export const otpValidationSchema = joi.object({
  userId: joi.string().required().messages({
    "string.empty": "User ID is required",
    "any.required": "User ID is required",
  }),

  otp: joi.string().length(6).required().messages({
    "string.empty": "OTP is required",
    "string.length": "OTP must be exactly 6 digits",
    "any.required": "OTP is required",
  }),
});
