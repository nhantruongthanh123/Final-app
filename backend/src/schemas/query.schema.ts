import { z } from "zod";

export const basePaginationSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(12),
});

export const userQuerySchema = basePaginationSchema.extend({
  sortBy: z
    .enum(["createdAt", "firstName", "email"])
    .optional()
    .default("createdAt"),
  role: z.enum(["USER", "ADMIN", "ALL"]).optional().default("ALL"),
  isActive: z.enum(["true", "false"]).optional(),
  search: z.string().optional(),
});

export type UserQuery = z.infer<typeof userQuerySchema>;

export const photoQuerySchema = basePaginationSchema.extend({
  sortBy: z
    .enum(["createdAt", "updatedAt", "likesCount"])
    .optional()
    .default("createdAt"),
  isPublic: z.enum(["true", "false"]).optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
});

export type PhotoQuery = z.infer<typeof photoQuerySchema>;

export const albumQuerySchema = basePaginationSchema.extend({
  sortBy: z
    .enum(["createdAt", "updatedAt", "photosCount"])
    .optional()
    .default("createdAt"),
  isPublic: z.enum(["true", "false"]).optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
});

export type AlbumQuery = z.infer<typeof albumQuerySchema>;
