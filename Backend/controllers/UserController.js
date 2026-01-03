import * as userService from "../services/userService.js";
import * as userRepo from "../repositories/userRepo.js";
import { ApiError } from "../utils/ApiError.js";
import logger from "../utils/logger.js";
import sendMail from "../config/sendMail.js";

const sendAuthResponse = (res, tokens, user, message = "Success") => {
  return res
    .cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message,
      accessToken: tokens.accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        verified: user.isVerified,
      },
    });
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const user = await userService.register({
      username,
      email,
      password,
      role,
    });

    logger.info(`New user registered: ${user.email}`);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    next(error);
  }
};

export const loginStepOne = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginVerifyCredentials({ email, password });

    const otp = await userService.processLoginOtp(email);

    const htmlContent = `
        <p>Login Verification</p>
        <p>Your OTP for login is:</p>
        <h2><strong>${otp}</strong></h2>
        <p>This OTP will expire in 5 minutes.</p>
      `;

    await sendMail(email, "Your 2FA Login OTP", htmlContent);

    logger.info(`OTP sent to ${email}`);
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
      throw ApiError(400, "Missing userId or otp");
    }

    const user = await userService.verifyUserOtp(userId, otp);

    const tokens = await userService.createTokensAndSave(user);
    logger.info(`OTP verified. Login success for ${user.email}`);

    return sendAuthResponse(res, tokens, user, "Logged in successfully");
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

    return sendAuthResponse(
      res,
      { accessToken, refreshToken },
      user,
      "Token refreshed"
    );
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userRepo.findByEmail(email);
    if (!user) throw new ApiError(404, "User not found");

    const resetToken = await userService.generatePasswordResetToken(user._id);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;

    const htmlContent = `
        <h2>Password Reset</h2>
        <p>Click the link below to verify your account:</p>
        <a href="${resetLink}" style="padding:10px 15px;background:#4f46e5;color:#fff;   border-radius:4px;text-decoration:none;">
      Verify Email
        </a>
        <p>This link will expire in 5 minutes.</p>
      `;

    await sendMail(email, "Password Reset Request", htmlContent);

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

    await userService.verifyAndResetPassword(userId, token, newPassword);

    return res.json({
      success: true,
      message: "Password updated successfully",
    });
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
