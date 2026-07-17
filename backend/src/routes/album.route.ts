import {
  createAlbum,
  deleteAlbum,
  getAlbumById,
  getAllAlbums,
  getAllAlbumsDiscover,
  getAllAlbumsFeed,
  updateAlbum,
} from "#controllers/album.controller.js";
import { optionalAuth } from "#middlewares/optionalAuth.js";
import { requireAuth } from "#middlewares/requireAuth.js";
import { upload } from "#middlewares/upload.js";
import express from "express";

const albumRouter = express.Router();

albumRouter.get("/albums", optionalAuth, getAllAlbums);
albumRouter.get("/albums/feed", requireAuth, getAllAlbumsFeed);
albumRouter.get("/albums/discover", optionalAuth, getAllAlbumsDiscover);
albumRouter.get("/albums/:id", optionalAuth, getAlbumById);

albumRouter.post(
  "/albums",
  requireAuth,
  upload.array("photos", 25),
  createAlbum,
);

albumRouter.patch(
  "/albums/:id",
  requireAuth,
  upload.array("photos", 25),
  updateAlbum,
);
albumRouter.delete("/albums/:id", requireAuth, deleteAlbum);

export default albumRouter;
