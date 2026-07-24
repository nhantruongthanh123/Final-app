import passport from "#config/passport.js";
import {
  forgotPassword,
  googleAuthCallback,
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
  resendVerificationEmail,
  resetPassword,
  verifyEmail,
} from "#controllers/auth.controller.js";
import {
  authenticateGoogleCallback,
  authenticateLocal,
} from "#middlewares/auth.middleware.js";
import { validateBody } from "#middlewares/validate.middleware.js";
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

authRouter.post("/auth/register", validateBody(registerSchema), registerUser);
authRouter.post(
  "/auth/login",
  validateBody(loginSchema),
  authenticateLocal,
  loginUser,
);

authRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

authRouter.get(
  "/auth/google/callback",
  authenticateGoogleCallback,
  googleAuthCallback,
);

authRouter.post("/auth/logout", logoutUser);
authRouter.post("/auth/refresh", refreshUserToken);
authRouter.post(
  "/auth/forgot-password",
  validateBody(forgotPasswordSchema),
  forgotPassword,
);

authRouter.post(
  "/auth/reset-password",
  validateBody(resetPasswordSchema),
  resetPassword,
);

authRouter.post(
  "/auth/verify-email",
  validateBody(verifyEmailSchema),
  verifyEmail,
);
authRouter.post(
  "/auth/resend-verification-email",
  validateBody(resendVerificationEmailSchema),
  resendVerificationEmail,
);

export default authRouter;
