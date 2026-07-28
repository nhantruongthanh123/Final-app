import cloudinary from "#config/cloudinary.js";
import { UserQuery } from "#schemas/query.schema.js";
import * as albumService from "#services/album.service.js";
import * as photoService from "#services/photo.service.js";
import * as userService from "#services/user.service.js";
import { AppError } from "#utils/app.error.js";
import { uploadToCloudinary } from "#utils/uploadToCloudinary.js";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  const { page, limit } = req.query as unknown as UserQuery;

  const { search, role, isActive } = req.query;

  const { users, totalUsers } = await userService.getusersByAdmin(
    page,
    limit,
    search as string | undefined,
    role as string | undefined,
    isActive as string | undefined,
  );

  res.status(200).json({ users, totalUsers });
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.params.id;
  const currentUserId = req.user?.userId;

  if (!currentUserId) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const isFollowing = await userService.isFollowing(currentUserId, userId);

  const user = await userService.findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ ...user, isFollowing: isFollowing });
};

export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  const newUser = await userService.createUser(
    email,
    firstName,
    lastName,
    password,
  );

  res.status(201).json(newUser);
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.params.id;

  const deletedUser = await userService.deleteUserById(userId);
  res.status(200).json(deletedUser);
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;

  const { email, firstName, lastName } = req.body;

  const existingUser = await userService.findUserByEmail(email);

  if (existingUser && existingUser.id !== userId) {
    throw new AppError("Email already exists", 409);
  }

  const updatedUser = await userService.updateUserById(userId, {
    email,
    firstName,
    lastName,
  });

  res.status(200).json(updatedUser);
};

export const updateUserPassword = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;
  const { password, newPassword } = req.body;

  const oldPassword = await userService.findUserPasswordById(userId);

  if (!bcrypt.compareSync(password, oldPassword?.password || "")) {
    throw new AppError("Incorrect current password", 400);
  }

  const updatedUser = await userService.updateUserPasswordById(
    userId,
    bcrypt.hashSync(newPassword, 10),
  );

  res.status(200).json(updatedUser);
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  const userId = req.user?.userId;

  // Upload the new avatar to Cloudinary
  const { url, publicId } = await uploadToCloudinary(
    req.file.buffer,
    "fotobook/avatars",
  );

  const existingUser = await userService.findUserById(userId);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  // Delete the old avatar from Cloudinary if it exists
  if (existingUser.avatarCloudinaryId) {
    try {
      await cloudinary.uploader.destroy(existingUser.avatarCloudinaryId);
    } catch (error) {
      console.error("Error deleting old avatar from Cloudinary:", error);
    }
  }

  const updatedUser = await userService.updateUserAvatarById(
    userId,
    url,
    publicId,
  );

  res.status(200).json(updatedUser);
};

export const updateUserAdmin = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.params.id;

  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const { email, firstName, lastName } = req.body;

  console.log(email);

  const updatedUser = await userService.updateUserById(userId, {
    email,
    firstName,
    lastName,
  });

  res.status(200).json(updatedUser);
};

export const updateUserAvatarAdmin = async (req: Request, res: Response) => {
  const rawUserId = req.params.id;

  if (!rawUserId) {
    throw new AppError("User ID is required", 400);
  }

  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  const existingUser = await userService.findUserById(userId);

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  // Upload the new avatar to Cloudinary
  const { url, publicId } = await uploadToCloudinary(
    req.file.buffer,
    "fotobook/avatars",
  );

  // Delete the old avatar from Cloudinary if it exists
  if (existingUser.avatarCloudinaryId) {
    try {
      await cloudinary.uploader.destroy(existingUser.avatarCloudinaryId);
    } catch (error) {
      console.error("Error deleting old avatar from Cloudinary:", error);
    }
  }

  const updatedUser = await userService.updateUserAvatarById(
    userId,
    url,
    publicId,
  );

  res.status(200).json(updatedUser);
};

export const updateUserIsActiveAdmin = async (req: Request, res: Response) => {
  const rawUserId = req.params.id;

  if (!rawUserId) {
    throw new AppError("User ID is required", 400);
  }

  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

  const { isActive } = req.body;

  const updatedUser = await userService.updateUserStatusById(userId, isActive);

  res.status(200).json(updatedUser);
};

export const getUserPhotos = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;

  const { search, isPublic } = req.query;

  const currentUserId = req.user?.userId;
  const currentUserRole = req.user?.role;
  const targetUserId = req.params.id;

  const isOwner = currentUserId === targetUserId;
  const isAdmin = currentUserRole === "ADMIN";
  const canViewPrivate = isOwner || isAdmin;

  const userPhotos = await photoService.findPhotosByUserId(
    targetUserId,
    canViewPrivate,
    page,
    limit,
    search as string | undefined,
    isPublic as string | undefined,
  );

  res.status(200).json(userPhotos);
};

export const getUserAlbums = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.params.id;

  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const currentUserId = req.user?.userId;
  const currentUserRole = req.user?.role;
  const targetUserId = req.params.id;

  const isOwner = currentUserId === targetUserId;
  const isAdmin = currentUserRole === "ADMIN";
  const canViewPrivate = isOwner || isAdmin;

  const userAlbums = await albumService.findAlbumsByUserId(
    userId,
    canViewPrivate,
  );
  res.status(200).json(userAlbums);
};

export const getUserFollowings = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;

  const followings = await userService.findUsersFollowing(userId);

  res.status(200).json(followings);
};

export const getUserFollowers = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;

  const followers = await userService.findUsersFollowers(userId);

  res.status(200).json(followers);
};

export const getTargetUserFollowings = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;
  const targetUserId = req.params.id;

  const followingsData = await userService.findUsersFollowingByTargetUserId(
    targetUserId,
    userId,
  );

  res.status(200).json(followingsData);
};

export const getTargetUserFollowers = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const currentUserId = req.user?.userId;
  const targetUserId = req.params.id;

  const followersData = await userService.findUsersFollowersByTargetUserId(
    targetUserId,
    currentUserId,
  );

  res.status(200).json(followersData);
};
