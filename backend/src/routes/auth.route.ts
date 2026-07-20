import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "#controllers/auth.controller.js";
import { validate } from "#middlewares/validate.middleware.js";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendVerificationEmailSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "#schemas/auth.schema.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/auth/register", validate(registerSchema), registerUser);
authRouter.post("/auth/login", validate(loginSchema), loginUser);

authRouter.post("/auth/logout", logoutUser);
authRouter.post("/auth/refresh", refreshUserToken);
authRouter.post(
  "/auth/forgot-password",
  validate(forgotPasswordSchema),
  forgotPassword,
);

authRouter.post(
  "/auth/reset-password",
  validate(resetPasswordSchema),
  resetPassword,
);

authRouter.post("/auth/verify-email", validate(verifyEmailSchema), verifyEmail);
authRouter.post(
  "/auth/resend-verification-email",
  validate(resendVerificationEmailSchema),
  resendVerificationEmail,
);

export default authRouter;
