import z from "zod";

export const photoSchema = z.object({
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

export type Photo = z.infer<typeof photoSchema>;

export const updatePhotoSchema = photoSchema.partial();
