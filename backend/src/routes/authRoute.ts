import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "#/controllers/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/auth/register", registerUser);
authRouter.post("/auth/login", loginUser);
authRouter.post("/auth/logout", logoutUser);
authRouter.post("/auth/refresh", refreshUserToken);
authRouter.post("/auth/forgot-password", forgotPassword);
authRouter.post("/auth/reset-password", resetPassword);
authRouter.post("/auth/verify-email", verifyEmail);
authRouter.post("/auth/resend-verification-email", resendVerificationEmail);

export default authRouter;
