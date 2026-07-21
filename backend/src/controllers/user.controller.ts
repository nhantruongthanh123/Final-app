import cloudinary from "#config/cloudinary.js";
import { prisma } from "#config/db.js";
import { UserQuery } from "#schemas/query.schema.js";
import { AppError } from "#utils/app.error.js";
import { uploadToCloudinary } from "#utils/uploadToCloudinary.js";
import { attachFollowStatus } from "#utils/userUtils.js";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  const { page, limit } = req.query as unknown as UserQuery;
  const offset = (page - 1) * limit;

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.count(),
  ]);

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

  const isFollowing = await prisma.follow.findFirst({
    where: {
      followerId: currentUserId,
      followedId: userId,
    },
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      lastName: true,
      firstName: true,
      avatarUrl: true,
      isActive: true,
      role: true,
      updatedAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ ...user, isFollowing: !!isFollowing });
};

export const createUser = async (req: Request, res: Response) => {
  const { email, firstName, lastName, password } = req.body;

  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password,
    },
  });

  res.status(201).json(newUser);
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const userId = req.params.id;

  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });
  res.status(200).json(deletedUser);
};

export const updateUser = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;

  const { email, firstName, lastName } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
    },
  });

  res.status(200).json(updatedUser);
};

export const updateUserPassword = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;
  const { password, newPassword } = req.body;

  const oldPassword = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });

  if (!bcrypt.compareSync(password, oldPassword?.password || "")) {
    throw new AppError("Incorrect current password", 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: bcrypt.hashSync(newPassword, 10) },
  });

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

  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { avatarCloudinaryId: true },
  });

  if (!existingUser) {
    throw new AppError("User not found", 404);
  }

  // Delete the old avatar from Cloudinary if it exists
  await cloudinary.uploader.destroy(existingUser.avatarCloudinaryId || "");

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: url,
      avatarCloudinaryId: publicId,
    },
  });

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

  const { email, firstName, lastName, password } = req.body;

  console.log(email);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(email && { email }),
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(password && { password }),
    },
  });

  res.status(200).json(updatedUser);
};

export const getUserPhotos = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const currentUserId = req.user?.userId;
  const currentUserRole = req.user?.role;
  const targetUserId = req.params.id;

  const isOwner = currentUserId === targetUserId;
  const isAdmin = currentUserRole === "ADMIN";
  const canViewPrivate = isOwner || isAdmin;

  const userPhotos = await prisma.photo.findMany({
    where: {
      userId: targetUserId,
      ...(canViewPrivate ? {} : { isPublic: true }),
    },
    orderBy: { updatedAt: "desc" },
  });

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

  const userAlbums = await prisma.album.findMany({
    where: {
      userId: targetUserId,
      ...(canViewPrivate ? {} : { isPublic: true }),
    },
    include: {
      photos: {
        select: {
          id: true,
          photoUrl: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  res.status(200).json(userAlbums);
};

export const getUserFollowings = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;

  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: {
      following: {
        select: {
          id: true,
          email: true,
          avatarUrl: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  res
    .status(200)
    .json(followings.map((f) => ({ ...f.following, isFollowing: true })));
};

export const getUserFollowers = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;

  const followers = await prisma.follow.findMany({
    where: { followedId: userId },
    select: {
      follower: {
        select: {
          id: true,
          email: true,
          avatarUrl: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const rawFollowers = followers.map((f) => f.follower);

  const formattedFollowers = await attachFollowStatus(rawFollowers, userId);

  res.status(200).json(formattedFollowers);
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

  const followingsData = await prisma.follow.findMany({
    where: { followerId: targetUserId },
    select: {
      following: {
        select: {
          id: true,
          email: true,
          avatarUrl: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  const rawFollowings = followingsData.map((f) => f.following);

  const formattedFollowings = await attachFollowStatus(rawFollowings, userId);

  res.status(200).json(formattedFollowings);
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

  const followersData = await prisma.follow.findMany({
    where: { followedId: targetUserId },
    select: {
      follower: {
        select: {
          id: true,
          email: true,
          avatarUrl: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const rawFollowers = followersData.map((f) => f.follower);

  const formattedFollowers = await attachFollowStatus(
    rawFollowers,
    currentUserId,
  );

  res.status(200).json(formattedFollowers);
};
