import * as authService from "#services/auth.service.js";
import * as userService from "#services/user.service.js";
import { AppError } from "#utils/app.error.js";
import { sendResetPasswordEmail } from "#utils/sendResetPasswordEmail.js";
import { sendVerificationEmail } from "#utils/sendVerificationEmail.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type { Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }

  const existingUser = await userService.findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const emailVerificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(emailVerificationToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const newUser = await userService.createUser(
    email,
    firstName,
    lastName,
    hashedPassword,
    false,
    hashedToken,
    expiresAt,
  );

  res.status(201).json({ message: "User registered successfully" });

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${emailVerificationToken}`;

  sendVerificationEmail(
    newUser.email,
    newUser.firstName ?? "",
    verifyLink,
  ).catch((err) => {
    console.error("Error sending verification email:", err);
  });

  res.status(201).json(newUser);
};

export const loginUser = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const role = req.user!.role;

  const user = await userService.findUserById(userId);

  if (!user || !user.isActive) {
    throw new AppError("User not found or inactive. Please log in again.", 403);
  }

  //Handle token generation here (e.g., JWT) and send it back to the client
  const accessToken = jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env
        .ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env
        .REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create sesson in the database
  await authService.createSession(userId, refreshToken, expiresAt);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    user,
    accessToken,
  });
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const role = req.user!.role;

  const user = await userService.findUserById(userId);

  const accessToken = jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env
        .ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env
        .REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
    },
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create sesson in the database
  await authService.createSession(userId, refreshToken, expiresAt);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect(`${process.env.FRONTEND_URL}/feed`);
};

export const logoutUser = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new AppError("No refresh token provided", 400);
  }

  await authService.deleteSessionByRefreshToken(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const refreshUserToken = async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken;
  if (!oldRefreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET as string);

  const session = await authService.findSessionByRefreshToken(oldRefreshToken);

  if (!session) {
    throw new AppError("Session not found. Please log in again.", 403);
  }

  const user = await userService.findUserById(session.userId);

  if (!user || !user.isActive) {
    console.log(session);
    throw new AppError("User not found or inactive. Please log in again.", 403);
  }

  const newAccessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "600m" },
  );

  const newRefreshToken = jwt.sign(
    { userId: user.id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" },
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const existingSession =
    await authService.findSessionByRefreshToken(oldRefreshToken);

  if (!existingSession) {
    throw new AppError("Session not found. Please log in again.", 403);
  }

  await authService.updateSessionByRefreshToken(
    oldRefreshToken,
    newRefreshToken,
    expiresAt,
  );

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    user,
    accessToken: newAccessToken,
  });
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await userService.findUserByEmail(email);

  if (!user) {
    return res.status(200).json({
      message: "Recovery will send to admin email. Please contact support.",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await authService.updateUserResetTokenByUserId(
    user.id,
    hashedToken,
    expiresAt,
  );

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await sendResetPasswordEmail(user.email, user.firstName ?? "", resetLink);

  return res.status(200).json({
    message: "Recovery will send to admin email. Please contact support.",
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new AppError("Token and new password are required", 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await authService.findUserByResetPasswordToken(hashedToken);

  if (!user) {
    throw new AppError(
      "Token is invalid or has expired. Please request a new password reset.",
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await authService.updateUserResetTokenByUserId(
    user.id,
    null,
    null,
    hashedPassword,
  );

  res.status(200).json({ message: "Reset password successfully." });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError("Token is required", 400);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await authService.findUserByVerificationEmailToken(hashedToken);

  if (!user) {
    throw new AppError(
      "Token is invalid or has expired. Please request a new verification email.",
      400,
    );
  }

  await authService.updateUserVerificationEmailTokenByUserId(
    user.id,
    null,
    null,
    true,
  );

  res.status(200).json({ message: "Please wait admin verify your email." });
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await userService.findUserByEmail(email);

  if (!user) {
    throw new AppError("Email is not registered.", 400);
  }

  if (user.isEmailVerified) {
    throw new AppError("Email is already verified.", 400);
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await authService.updateUserVerificationEmailTokenByUserId(
    user.id,
    hashedToken,
    expiresAt,
  );

  const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  sendVerificationEmail(user.email, user.firstName ?? "", verifyLink);

  res.status(200).json({
    message: "Please wait admin verify your email.",
  });
};
