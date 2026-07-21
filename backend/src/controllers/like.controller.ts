import { prisma } from "#config/db.js";
import { AppError } from "#utils/app.error.js";
import type { Request, Response } from "express";

export const userLikePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;
  const photoId = req.params.id;

  // Check if the user has already liked the photo
  const existingLike = await prisma.photoLike.findUnique({
    where: {
      photoId_userId: {
        photoId,
        userId,
      },
    },
  });

  if (existingLike) {
    throw new AppError("You have already liked this photo.", 400);
  }

  // Create a new like
  const newLike = await prisma.photoLike.create({
    data: {
      userId,
      photoId,
    },
  });

  res.status(201).json(newLike);
};

export const userUnlikePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;
  const photoId = req.params.id;

  // Check if the like exists
  const existingLike = await prisma.photoLike.findUnique({
    where: {
      photoId_userId: {
        photoId,
        userId,
      },
    },
  });

  if (!existingLike) {
    throw new AppError("You have not liked this photo.", 404);
  }

  // Delete the like
  await prisma.photoLike.delete({
    where: {
      photoId_userId: {
        photoId,
        userId,
      },
    },
  });

  res.status(200).json({ message: "Photo unliked successfully." });
};

export const userLikeAlbum = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;
  const albumId = req.params.id;

  // Check if the user has already liked the album
  const existingLike = await prisma.albumLike.findUnique({
    where: {
      albumId_userId: {
        albumId,
        userId,
      },
    },
  });

  if (existingLike) {
    throw new AppError("You have already liked this album.", 400);
  }

  // Create a new like
  const newLike = await prisma.albumLike.create({
    data: {
      userId,
      albumId,
    },
  });

  res.status(201).json(newLike);
};

export const userUnlikeAlbum = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const userId = req.user?.userId;
  const albumId = req.params.id;

  // Check if the like exists
  const existingLike = await prisma.albumLike.findUnique({
    where: {
      albumId_userId: {
        albumId,
        userId,
      },
    },
  });

  if (!existingLike) {
    throw new AppError("You have not liked this album.", 404);
  }

  // Delete the like
  await prisma.albumLike.delete({
    where: {
      albumId_userId: {
        albumId,
        userId,
      },
    },
  });

  res.status(200).json({ message: "Album unliked successfully." });
};
