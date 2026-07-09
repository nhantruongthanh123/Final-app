import express from "express";
import {
  createPhoto,
  deletePhoto,
  getAllPhotos,
  getPhotoById,
  getAllPhotosFeed,
  updatePhoto,
} from "#/controllers/photoController.js";
import { requireAuth } from "#middlewares/requireAuth.js";
import { optionalAuth } from "#middlewares/optionalAuth.js";

const photoRouter = express.Router();

photoRouter.get("/photos", optionalAuth, getAllPhotos);
photoRouter.get("/photos/feed", requireAuth, getAllPhotosFeed);
photoRouter.get("/photos/:id", optionalAuth, getPhotoById);
photoRouter.post("/photos", requireAuth, createPhoto);
photoRouter.delete("/photos/:id", requireAuth, deletePhoto);
photoRouter.patch("/photos/:id", requireAuth, updatePhoto);

export default photoRouter;
