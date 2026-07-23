import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbums,
  getAllAlbumsAdmin,
  getAllAlbumsDiscover,
  getAllAlbumsFeed,
  updateAlbum,
} from "#controllers/album.controller.js";
import { optionalAuth } from "#middlewares/optionalAuth.js";
import { requireAdmin, requireAuth } from "#middlewares/requireAuth.js";
import { upload } from "#middlewares/upload.js";
import {
  validateBody,
  validateFiles,
  validateParams,
  validateQuery,
} from "#middlewares/validate.middleware.js";
import { albumSchema, updateAlbumSchema } from "#schemas/album.schema.js";
import {
  multipleFilesSchema,
  updateAlbumFilesSchema,
} from "#schemas/file.schema.js";
import { idParamSchema } from "#schemas/param.schema.js";
import { albumQuerySchema } from "#schemas/query.schema.js";
import express from "express";

const albumRouter = express.Router();

albumRouter.get(
  "/albums",
  optionalAuth,
  validateQuery(albumQuerySchema),
  getAllAlbums,
);

albumRouter.get(
  "/albums/admin",
  requireAdmin,
  validateQuery(albumQuerySchema),
  getAllAlbumsAdmin,
);

albumRouter.get(
  "/albums/feed",
  requireAuth,
  validateQuery(albumQuerySchema),
  getAllAlbumsFeed,
);
albumRouter.get(
  "/albums/discover",
  optionalAuth,
  validateQuery(albumQuerySchema),
  getAllAlbumsDiscover,
);
albumRouter.get(
  "/albums/:id",
  optionalAuth,
  validateParams(idParamSchema),
  getAlbumById,
);

albumRouter.post(
  "/albums",
  requireAuth,
  upload.array("photos", 25),
  validateBody(albumSchema),
  validateFiles(multipleFilesSchema),
  createAlbum,
);

albumRouter.patch(
  "/albums/:id",
  requireAuth,
  validateParams(idParamSchema),
  upload.array("photos", 25),
  validateBody(updateAlbumSchema),
  validateFiles(updateAlbumFilesSchema),
  updateAlbum,
);
albumRouter.delete(
  "/albums/:id",
  requireAuth,
  validateParams(idParamSchema),
  deleteAlbum,
);

export default albumRouter;
