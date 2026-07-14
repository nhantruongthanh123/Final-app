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
  updateUserAdmin,
  updateUserAvatar,
  updateUserPassword,
} from "#/controllers/userController.js";
import { followUser, unfollowUser } from "#controllers/followController.js";
import {
  userLikeAlbum,
  userLikePhoto,
  userUnlikeAlbum,
  userUnlikePhoto,
} from "#controllers/likeController.js";
import { requireAdmin, requireAuth } from "#middlewares/requireAuth.js";
import { upload } from "#middlewares/upload.js";
import express from "express";

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
userRouter.get("/users/:id", requireAuth, getUserById);
userRouter.get("/users/:id/photos", requireAuth, getUserPhotos);
userRouter.get("/users/:id/albums", requireAuth, getUserAlbums);

userRouter.post("/users", createUser);
userRouter.patch("/users/me", requireAuth, updateUser);
userRouter.patch(
  "/users/me/avatar",
  requireAuth,
  upload.single("avatar"),
  updateUserAvatar,
);
userRouter.patch("/users/me/password", requireAuth, updateUserPassword);
userRouter.patch("/users/:id", requireAdmin, updateUserAdmin);
userRouter.delete("/users/:id", deleteUser);

// Like User
userRouter.post("/users/:id/likePhoto", requireAuth, userLikePhoto);
userRouter.delete("/users/:id/likePhoto", requireAuth, userUnlikePhoto);
userRouter.post("/users/:id/likeAlbum", requireAuth, userLikeAlbum);
userRouter.delete("/users/:id/likeAlbum", requireAuth, userUnlikeAlbum);

export default userRouter;
