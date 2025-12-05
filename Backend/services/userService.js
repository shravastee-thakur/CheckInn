import * as userRepo from "../repositories/userRepo.js";
import { ApiError } from "../utils/ApiError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const register = async ({ username, email, password }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new ApiError(409, "User already exists");

  const user = await userRepo.createUser({ username, email, password });

  return { id: user._id, username: user.username, email: user.email };
};

export const loginVerifyCredentials = async ({ email, password }) => {
  console.log("Attempting to find user with email:", email);
  const user = await userRepo.findByEmail(email).select("email password");
  if (!user) throw new ApiError(401, "Invalid credentials");

  console.log("User found:", user);

  const match = await user.comparePassword(password);
  if (!match) throw new ApiError(401, "Invalid credentials");

  return user;
};

export const createTokensAndSave = async (user) => {
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  await userRepo.updateUser(user._id, { refreshToken });
  return { accessToken, refreshToken };
};

export const rotateRefreshToken = async (oldToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(oldToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await userRepo.findById(decoded.id);
  if (!user) throw new ApiError(404, "User not found");

  if (!user.refreshToken || user.refreshToken !== oldToken) {
    throw new ApiError(401, "Refresh token mismatch");
  }

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const newRefreshToken = generateRefreshToken({
    id: user._id,
    role: user.role,
  });

  await userRepo.updateUser(user._id, { refreshToken: newRefreshToken });

  return { accessToken, refreshToken: newRefreshToken };
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
