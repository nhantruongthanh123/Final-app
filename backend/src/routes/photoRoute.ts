import express from "express";
import {
  createPhoto,
  deletePhoto,
  getAllPhotos,
  getPhotoById,
} from "#/controllers/photoController.js";

const photoRouter = express.Router();

photoRouter.get("/photos", getAllPhotos);
photoRouter.get("/photos/:id", getPhotoById);
photoRouter.post("/photos", createPhoto);
photoRouter.delete("/photos/:id", deletePhoto);
photoRouter.patch("/photos/:id", deletePhoto);

export default photoRouter;
