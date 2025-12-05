import * as userService from "../services/userService.js";
import * as otpService from "../services/otpService.js";
import * as resetTokenService from "../services/resetTokenService.js";
import * as userRepo from "../repositories/userRepo.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import transporter from "../config/sendMail.js";
import {
  loginOtpTemplate,
  resetPasswordTemplate,
} from "../emails/templates.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const user = await userService.register({ username, email, password });

    logger.info(`New user registered: ${user.email}`);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    next(error);
  }
};

export const loginStepOne = async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const user = await userService.loginVerifyCredentials({ email, password });

    console.log("User email:", user.email);

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    await otpService.saveOtp(user.email, otp);

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Your 2FA Login OTP",
      html: loginOtpTemplate(otp),
    });

    logger.info(`OTP sent to ${user.email}`);
    return res.json({
      success: true,
      message: "OTP sent to your email. Please verify.",
      userId: user._id,
    });
  } catch (error) {
    logger.warn(`Failed login attempt for: ${req.body?.email}`);
    logger.error(`Login step 1 error: ${error.message}`);
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      logger.warn("Missing userId or OTP in verifyOtp");
      throw new ApiError(400, "Missing userId or otp");
    }

    const user = await userRepo.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const storedOtp = await otpService.getOtp(user.email);
    if (!storedOtp || String(storedOtp) !== String(otp)) {
      logger.warn(`Invalid OTP for user: ${user.email}`);
      throw new ApiError(401, "Invalid or expired OTP");
    }

    await otpService.deleteOtp(user.email);

    const tokens = await userService.createTokensAndSave(user);
    logger.info(`OTP verified. Login success for ${user.email}`);

    res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, accessToken: tokens.accessToken });
  } catch (error) {
    logger.error(`OTP verification error: ${error.message}`);
    next(error);
  }
};

export const refreshHandler = async (req, res, next) => {
  try {
    const oldToken = req.cookies?.refreshToken;
    if (!oldToken) throw new ApiError(401, "Refresh token missing");

    const { accessToken, refreshToken } = await userService.rotateRefreshToken(
      oldToken
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, accessToken });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await userRepo.findByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    const resetToken = crypto.randomBytes(10).toString("hex");
    const hashToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await resetTokenService.saveResetToken(user._id, hashToken);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset your password",
      html: resetPasswordTemplate(resetLink),
    });

    logger.info(`Password reset link sent to ${email}`);

    return res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    logger.error(`Forgot password error: ${error.message}`);
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { userId, token, newPassword } = req.body;

    if (!userId || !token || !newPassword)
      throw new ApiError(400, "Missing required fields");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const storedResetToken = await resetTokenService.getResetToken(userId);

    if (!storedResetToken) {
      throw new ApiError(400, "Token expired or invalid");
    }

    if (storedResetToken !== hashedToken) {
      throw new ApiError(401, "Invalid reset token");
    }

    await resetTokenService.deleteResetToken(userId);

    const user = await userRepo.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepo.updateUser(userId, { password: hashedPassword });

    logger.info(`Password reset successful for ${user.email}`);

    return res.json({ success: true, message: "Password updated" });
  } catch (error) {
    logger.error(`Reset password error: ${error.message}`);
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    await userService.logout(refreshToken);

    return res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    next(error);
  }
};
