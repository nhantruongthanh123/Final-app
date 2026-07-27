import * as likeService from "#services/like.service.js";
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
  const existingLike = await likeService.isUserLikePhoto(userId, photoId);

  if (existingLike) {
    throw new AppError("You have already liked this photo.", 400);
  }

  // Create a new like
  const newLike = await likeService.userLikePhoto(userId, photoId);

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
  const existingLike = await likeService.isUserLikePhoto(userId, photoId);

  if (!existingLike) {
    throw new AppError("You have not liked this photo.", 404);
  }

  // Delete the like
  await likeService.userUnlikePhoto(userId, photoId);

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
  const existingLike = await likeService.isUserLikeAlbum(userId, albumId);

  if (existingLike) {
    throw new AppError("You have already liked this album.", 400);
  }

  // Create a new like
  const newLike = await likeService.userLikeAlbum(userId, albumId);

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
  const existingLike = await likeService.isUserLikeAlbum(userId, albumId);

  if (!existingLike) {
    throw new AppError("You have not liked this album.", 404);
  }

  // Delete the like
  await likeService.userUnlikeAlbum(userId, albumId);

  res.status(200).json({ message: "Album unliked successfully." });
};
