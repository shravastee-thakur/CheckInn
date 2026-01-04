import * as userRepo from "../repositories/userRepo.js";
import * as otpService from "../services/otpService.js";
import * as resetTokenService from "../services/resetTokenService.js";
import { ApiError } from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

export const register = async ({ username, email, password, role }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw ApiError(409, "User already exists");

  const user = await userRepo.createUser({
    username,
    email,
    password,
    role,
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

export const loginVerifyCredentials = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email).select("email password");
  if (!user) throw ApiError(401, "Invalid credentials");

  const match = await user.comparePassword(password);
  if (!match) throw ApiError(401, "Invalid credentials");

  return user;
};

export const processLoginOtp = async (userEmail) => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  await otpService.saveOtp(userEmail, otp);
  return otp;
};

export const createTokensAndSave = async (user) => {
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await userRepo.updateUser(user._id, { refreshToken: hashedRefreshToken });
  return { accessToken, refreshToken };
};

export const verifyUserOtp = async (userId, otp) => {
  const user = await userRepo.findById(userId);
  if (!user) throw ApiError(404, "User not found");

  const storedOtp = await otpService.getOtp(user.email);

  if (!storedOtp || String(storedOtp) !== String(otp)) {
    throw ApiError(401, "Invalid or expired OTP");
  }

  await otpService.deleteOtp(user.email);

  if (!user.isVerified) {
    user.isVerified = true;
    await user.save();
  }

  return user;
};

export const rotateRefreshToken = async (oldToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(oldToken);
  } catch (error) {
    throw ApiError(401, "Invalid or expired refresh token");
  }

  const user = await userRepo.findById(decoded.id);
  if (!user) throw ApiError(404, "User not found");

  const hashedRefreshToken = crypto
    .createHash("sha256")
    .update(oldToken)
    .digest("hex");

  if (!user.refreshToken || user.refreshToken !== hashedRefreshToken) {
    throw ApiError(401, "Refresh token mismatch");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = generateRefreshToken({
    id: user._id,
    role: user.role,
  });

  const hashedNewRefreshToken = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  await userRepo.updateUser(user._id, { refreshToken: hashedNewRefreshToken });

  return { accessToken, refreshToken: newRefreshToken, user };
};

export const generatePasswordResetToken = async (userId) => {
  const resetToken = crypto.randomBytes(10).toString("hex");
  const hashToken = crypto
    .createHmac("sha256", process.env.HMAC_SECRET)
    .update(resetToken)
    .digest("hex");

  await resetTokenService.saveResetToken(userId, hashToken);
  return resetToken;
};

export const verifyAndResetPassword = async (userId, token, newPassword) => {
  const hashedToken = crypto
    .createHmac("sha256", process.env.HMAC_SECRET)
    .update(token)
    .digest("hex");
  const storedResetToken = await resetTokenService.getResetToken(userId);

  if (!storedResetToken || storedResetToken !== hashedToken) {
    throw ApiError(400, "Invalid or expired reset token");
  }

  await resetTokenService.deleteResetToken(userId);

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepo.updateUser(userId, { password: hashedPassword });
};

export const getUserById = async (userId) => {
  return userRepo.findById(userId);
};

export const logout = async (refreshToken) => {
  if (!refreshToken) return;

  const decoded = verifyRefreshToken(refreshToken);
  if (decoded?.id) {
    await userRepo.updateUser(decoded.id, { refreshToken: "" });
  }
};
