import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserAlbums,
  getUserById,
  getUserPhotos,
  updateUser,
} from "#/controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getUserById);
userRouter.post("/users", createUser);
userRouter.delete("/users/:id", deleteUser);
userRouter.patch("/users/:id", updateUser);
userRouter.get("/users/:id/photos", getUserPhotos);
userRouter.get("/users/:id/albums", getUserAlbums);

export default userRouter;
