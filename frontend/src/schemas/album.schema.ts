import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const albumSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),

  isPublic: z.boolean(),
  files: z
    .array(
      z
        .custom<File>((val) => val instanceof File, {
          message: "Must be a valid file.",
        })
        .refine((file) => file.size <= MAX_FILE_SIZE, {
          message: "Each file must be less than 5MB.",
        })
        .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
          message: "Only .jpg, .jpeg, .png, and .webp formats are supported.",
        }),
    )
    .min(1, { message: "At least one photo is required to create an album." })
    .max(25, { message: "You can only upload up to 25 photos." }),
});

export type AlbumPayload = z.infer<typeof albumSchema>;

export const editAlbumSchema = albumSchema.omit({ files: true }).extend({
  files: z
    .array(
      z
        .custom<File>((val) => val instanceof File, {
          message: "Must be a valid file.",
        })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Each file must be less than 5MB.",
        })
        .refine(
          (file) =>
            ["image/jpeg", "image/jpg", "image/png"].includes(file.type),
          {
            message: "Only .jpg, .jpeg, .png, and .webp formats are supported.",
          },
        ),
    )
    .max(25, { message: "You can only upload up to 25 photos." }),
});

export type EditAlbumPayload = z.infer<typeof editAlbumSchema>;
