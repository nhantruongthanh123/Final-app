import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const singleFileSchema = z.object({
  size: z.number().max(MAX_FILE_SIZE, "File must be under 5MB"),
  mimetype: z
    .string()
    .refine((type) => ACCEPTED_TYPES.includes(type), "Invalid file type"),
});

export const multipleFilesSchema = z
  .array(singleFileSchema)
  .min(1, "At least one file is required")
  .max(25, "You can upload a maximum of 25 files");

export const updateAlbumFilesSchema = z.array(singleFileSchema).optional();
