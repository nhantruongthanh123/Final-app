import { followUser, unfollowUser } from "#controllers/follow.controller.js";
import {
  userLikeAlbum,
  userLikePhoto,
  userUnlikeAlbum,
  userUnlikePhoto,
} from "#controllers/like.controller.js";
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
  updateUserAvatarAdmin,
  updateUserPassword,
} from "#controllers/user.controller.js";
import { requireAdmin, requireAuth } from "#middlewares/requireAuth.js";
import { upload } from "#middlewares/upload.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "#middlewares/validate.middleware.js";
import { idParamSchema } from "#schemas/param.schema.js";
import { userQuerySchema } from "#schemas/query.schema.js";
import {
  updateUserPasswordSchema,
  updateUserSchema,
  userSchema,
} from "#schemas/user.schema.js";
import express from "express";

const userRouter = express.Router();

// Follow User
userRouter.post(
  "/users/:id/follow",
  requireAuth,
  validateParams(idParamSchema),
  followUser,
);

userRouter.delete(
  "/users/:id/unfollow",
  requireAuth,
  validateParams(idParamSchema),
  unfollowUser,
);

userRouter.get("/users/followings", requireAuth, getUserFollowings);
userRouter.get("/users/followers", requireAuth, getUserFollowers);

userRouter.get(
  "/users/:id/followings",
  requireAuth,
  validateParams(idParamSchema),
  getTargetUserFollowings,
);

userRouter.get(
  "/users/:id/followers",
  requireAuth,
  validateParams(idParamSchema),
  getTargetUserFollowers,
);

// User
userRouter.get("/users", validateQuery(userQuerySchema), getAllUsers);
userRouter.get(
  "/users/:id",
  requireAuth,
  validateParams(idParamSchema),
  getUserById,
);
userRouter.get(
  "/users/:id/photos",
  requireAuth,
  validateParams(idParamSchema),
  getUserPhotos,
);
userRouter.get(
  "/users/:id/albums",
  requireAuth,
  validateParams(idParamSchema),
  getUserAlbums,
);

userRouter.post("/users", validateBody(userSchema), createUser);
userRouter.patch(
  "/users/me",
  validateBody(updateUserSchema),
  requireAuth,
  updateUser,
);
userRouter.patch(
  "/users/me/avatar",
  requireAuth,
  upload.single("avatar"),
  updateUserAvatar,
);
userRouter.patch(
  "/users/me/password",
  requireAuth,
  validateBody(updateUserPasswordSchema),
  updateUserPassword,
);

userRouter.patch(
  "/users/:id",
  requireAdmin,
  validateBody(updateUserSchema),
  validateParams(idParamSchema),
  updateUserAdmin,
);

userRouter.patch(
  "/users/:id/avatar",
  requireAdmin,
  upload.single("avatar"),
  validateParams(idParamSchema),
  updateUserAvatarAdmin,
);

userRouter.delete(
  "/users/:id",
  requireAdmin,
  validateParams(idParamSchema),
  deleteUser,
);

// Like User
userRouter.post(
  "/users/:id/likePhoto",
  requireAuth,
  validateParams(idParamSchema),

  userLikePhoto,
);
userRouter.delete(
  "/users/:id/likePhoto",
  requireAuth,
  validateParams(idParamSchema),
  userUnlikePhoto,
);
userRouter.post(
  "/users/:id/likeAlbum",
  requireAuth,
  validateParams(idParamSchema),
  userLikeAlbum,
);
userRouter.delete(
  "/users/:id/likeAlbum",
  requireAuth,
  validateParams(idParamSchema),
  userUnlikeAlbum,
);

export default userRouter;
