import express from "express";
import {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  deleteAlbum,
  updateAlbum,
} from "#/controllers/albumController.js";

const albumRouter = express.Router();

albumRouter.get("/albums", getAllAlbums);
albumRouter.get("/albums/:id", getAlbumById);
albumRouter.post("/albums", createAlbum);
albumRouter.delete("/albums/:id", deleteAlbum);
albumRouter.patch("/albums/:id", updateAlbum);

export default albumRouter;
