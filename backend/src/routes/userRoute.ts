import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserAlbums,
  getUserById,
  getUserFollowers,
  getUserFollowings,
  getUserPhotos,
  updateUser,
} from "#/controllers/userController.js";
import { followUser, unfollowUser } from "#controllers/followController.js";
import {
  userLikeAlbum,
  userLikePhoto,
  userUnlikeAlbum,
  userUnlikePhoto,
} from "#controllers/likeController.js";

const userRouter = express.Router();

userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getUserById);
userRouter.post("/users", createUser);
userRouter.delete("/users/:id", deleteUser);
userRouter.patch("/users/:id", updateUser);
userRouter.get("/users/:id/photos", getUserPhotos);
userRouter.get("/users/:id/albums", getUserAlbums);

// Follow User
userRouter.post("/users/:id/follow", followUser);
userRouter.delete("/users/:id/follow", unfollowUser);
userRouter.get("/users/:id/followers", getUserFollowers);
userRouter.get("/users/:id/followings", getUserFollowings);

// Like User
userRouter.post("/users/:id/likePhoto", userLikePhoto);
userRouter.delete("/users/:id/likePhoto", userUnlikePhoto);
userRouter.post("/users/:id/likeAlbum", userLikeAlbum);
userRouter.delete("/users/:id/likeAlbum", userUnlikeAlbum);

export default userRouter;
