import {
  createPhoto,
  deletePhoto,
  getAllPhotos,
  getAllPhotosAdmin,
  getAllPhotosDiscover,
  getAllPhotosFeed,
  getPhotoById,
  updatePhoto,
} from "#controllers/photo.controller.js";
import { optionalAuth } from "#middlewares/optionalAuth.js";
import { requireAdmin, requireAuth } from "#middlewares/requireAuth.js";
import { upload } from "#middlewares/upload.js";
import {
  validateBody,
  validateFiles,
  validateParams,
  validateQuery,
} from "#middlewares/validate.middleware.js";
import {
  singleFileSchema,
  updatePhotoFilesSchema,
} from "#schemas/file.schema.js";
import { idParamSchema } from "#schemas/param.schema.js";
import { photoSchema, updatePhotoSchema } from "#schemas/photo.schema.js";
import { photoQuerySchema } from "#schemas/query.schema.js";
import express from "express";

const photoRouter = express.Router();

photoRouter.get(
  "/photos",
  optionalAuth,
  validateQuery(photoQuerySchema),
  getAllPhotos,
);

photoRouter.get(
  "/photos/admin",
  requireAdmin,
  validateQuery(photoQuerySchema),
  getAllPhotosAdmin,
);

photoRouter.get(
  "/photos/feed",
  requireAuth,
  validateQuery(photoQuerySchema),
  getAllPhotosFeed,
);

photoRouter.get(
  "/photos/discover",
  optionalAuth,
  validateQuery(photoQuerySchema),
  getAllPhotosDiscover,
);

photoRouter.get(
  "/photos/:id",
  optionalAuth,
  validateParams(idParamSchema),
  getPhotoById,
);

photoRouter.post(
  "/photos",
  requireAuth,
  upload.single("photo"),
  validateBody(photoSchema),
  validateFiles(singleFileSchema),
  createPhoto,
);

photoRouter.delete(
  "/photos/:id",
  requireAuth,
  validateParams(idParamSchema),
  deletePhoto,
);

photoRouter.patch(
  "/photos/:id",
  requireAuth,
  validateParams(idParamSchema),
  upload.single("photo"),
  validateBody(updatePhotoSchema),
  validateFiles(updatePhotoFilesSchema),
  updatePhoto,
);

export default photoRouter;
