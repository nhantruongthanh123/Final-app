import express from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getTargetUserFollowers,
  getTargetUserFollowings,
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
import { requireAuth } from "#middlewares/requireAuth.js";

const userRouter = express.Router();

// Follow User
userRouter.post("/users/:id/follow", requireAuth, followUser);
userRouter.delete("/users/:id/unfollow", requireAuth, unfollowUser);
userRouter.get("/users/followings", requireAuth, getUserFollowings);
userRouter.get("/users/followers", requireAuth, getUserFollowers);
userRouter.get("/users/:id/followings", requireAuth, getTargetUserFollowings);
userRouter.get("/users/:id/followers", requireAuth, getTargetUserFollowers);

// User

userRouter.get("/users", getAllUsers);
userRouter.get("/users/:id", getUserById);
userRouter.get("/users/:id/photos", getUserPhotos);
userRouter.get("/users/:id/albums", getUserAlbums);

userRouter.post("/users", createUser);
userRouter.delete("/users/:id", deleteUser);
userRouter.patch("/users/:id", updateUser);

// Like User
userRouter.post("/users/:id/likePhoto", userLikePhoto);
userRouter.delete("/users/:id/likePhoto", userUnlikePhoto);
userRouter.post("/users/:id/likeAlbum", userLikeAlbum);
userRouter.delete("/users/:id/likeAlbum", userUnlikeAlbum);

export default userRouter;
