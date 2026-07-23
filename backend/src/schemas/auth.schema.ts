import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(25, "First name must be less than 25 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(25, "Last name must be less than 25 characters"),
  email: z
    .email()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(64, "Password must be less than 64 characters long"),
});

export type Register = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(64, "Password must be less than 64 characters long"),
});

export type Login = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters"),
});

export type ForgotPassword = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  newPassword: z
    .string()
    .min(6, "New password must be at least 6 characters long")
    .max(64, "New password must be less than 64 characters long"),
});

export type ResetPassword = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type VerifyEmail = z.infer<typeof verifyEmailSchema>;

export const resendVerificationEmailSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters"),
});

export type ResendVerificationEmail = z.infer<
  typeof resendVerificationEmailSchema
>;
