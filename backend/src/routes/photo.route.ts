import {
  createPhoto,
  deletePhoto,
  getAllPhotos,
  getAllPhotosDiscover,
  getAllPhotosFeed,
  getPhotoById,
  updatePhoto,
} from "#controllers/photo.controller.js";
import { optionalAuth } from "#middlewares/optionalAuth.js";
import { requireAuth } from "#middlewares/requireAuth.js";
import { upload } from "#middlewares/upload.js";
import express from "express";

const photoRouter = express.Router();

photoRouter.get("/photos", optionalAuth, getAllPhotos);
photoRouter.get("/photos/feed", requireAuth, getAllPhotosFeed);
photoRouter.get("/photos/discover", optionalAuth, getAllPhotosDiscover);
photoRouter.get("/photos/:id", optionalAuth, getPhotoById);
photoRouter.post("/photos", requireAuth, upload.single("photo"), createPhoto);
photoRouter.delete("/photos/:id", requireAuth, deletePhoto);
photoRouter.patch(
  "/photos/:id",
  requireAuth,
  upload.single("photo"),
  updatePhoto,
);

export default photoRouter;
