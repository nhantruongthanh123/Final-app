import { z } from "zod";

export const registerSchema = z
  .object({
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
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterPayload = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .email()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(64, "Password must be less than 64 characters long"),
});

export type LoginPayload = z.infer<typeof loginSchema>;

export const emailSchema = z.object({
  email: z
    .email()
    .min(1, "Email is required")
    .max(255, "Email must be less than 255 characters"),
});

export type EmailPayload = z.infer<typeof emailSchema>;

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(64, "Password must be less than 64 characters long"),
    confirmNewPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(64, "Password must be less than 64 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
