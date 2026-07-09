import express from "express";
import {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  deleteAlbum,
  updateAlbum,
  getAllAlbumsFeed,
  getAllAlbumsDiscover,
} from "#/controllers/albumController.js";
import { optionalAuth } from "#middlewares/optionalAuth.js";
import { requireAuth } from "#middlewares/requireAuth.js";

const albumRouter = express.Router();

albumRouter.get("/albums", optionalAuth, getAllAlbums);
albumRouter.get("/albums/feed", requireAuth, getAllAlbumsFeed);
albumRouter.get("/albums/discover", optionalAuth, getAllAlbumsDiscover);
albumRouter.get("/albums/:id", optionalAuth, getAlbumById);
albumRouter.post("/albums", requireAuth, createAlbum);
albumRouter.delete("/albums/:id", requireAuth, deleteAlbum);
albumRouter.patch("/albums/:id", requireAuth, updateAlbum);

export default albumRouter;
