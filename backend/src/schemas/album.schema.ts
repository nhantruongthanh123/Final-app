import { z } from "zod";

export const albumSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" }),
  isPublic: z
    .preprocess((val) => {
      if (typeof val === "string") {
        return val === "true";
      }
      return val;
    }, z.boolean())
    .optional(),
});

export type Album = z.infer<typeof albumSchema>;

export const updateAlbumSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(100, { message: "Title must be less than 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
  isPublic: z.preprocess((val) => {
    if (val === "true") return true;
    if (val === "false") return false;
    return val;
  }, z.boolean().optional()),
  removedPhotoIds: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
    return val;
  }, z.array(z.string()).optional()),
});

export type UpdateAlbum = z.infer<typeof updateAlbumSchema>;
