import { z } from "zod";

export const userSchema = z.object({
  email: z
    .email()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" }),
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(25, { message: "First name must be less than 25 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(25, { message: "Last name must be less than 25 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(64, { message: "Password must be less than 64 characters" }),
});

export type User = z.infer<typeof userSchema>;

export const updateUserSchema = userSchema
  .pick({
    email: true,
    firstName: true,
    lastName: true,
  })
  .partial();

export type UpdateUser = z.infer<typeof updateUserSchema>;

export const updateUserPasswordSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Current password must be at least 6 characters" })
    .max(64, { message: "Current password must be less than 64 characters" }),
  newPassword: z
    .string()
    .min(6, { message: "New password must be at least 6 characters" })
    .max(64, { message: "New password must be less than 64 characters" }),
});

export type UpdateUserPassword = z.infer<typeof updateUserPasswordSchema>;

export const isActiveSchema = z.object({
  isActive: z.boolean("isActive must be a boolean value"),
});

export type IsActive = z.infer<typeof isActiveSchema>;
