import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const avatarSchema = z
  .custom<File>((file) => file instanceof File, "Please upload a valid file")
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    "File size must be less than 5MB",
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Only .jpg, .png formats are supported",
  );

export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Invalid email address"),
});

export type ProfilePayload = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export type PasswordPayload = z.infer<typeof passwordSchema>;
