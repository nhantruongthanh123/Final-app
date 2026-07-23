import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const photoSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),

  isPublic: z.boolean(),
  file: z
    .custom<File | undefined>((val) => val instanceof File, {
      message: "Image is required. Please upload a photo.",
    })
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "File size must be less than 5MB.",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png formats are supported.",
    }),
});

export type PhotoPayload = z.infer<typeof photoSchema>;

export const updatePhotoSchema = photoSchema.partial();

export type UpdatePhotoPayload = z.infer<typeof updatePhotoSchema>;
