import cloudinary from "#config/cloudinary.js";
import * as photoService from "#services/photo.service.js";
import * as userService from "#services/user.service.js";
import { AppError } from "#utils/app.error.js";
import { uploadToCloudinary } from "#utils/uploadToCloudinary.js";
import type { Request, Response } from "express";
import { fileTypeFromBuffer } from "file-type";

export const getAllPhotos = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;

  const { photos, totalPhotos } = await photoService.findAllPhotos(page, limit);

  res.status(200).json({ photos, totalPhotos });
};

export const getAllPhotosAdmin = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 1;

  const { search, isPublic } = req.query;

  const { photos, totalPhotos } = await photoService.findAllPhotosByAdmin(
    page,
    limit,
    search as string | undefined,
    isPublic as string | undefined,
  );

  res.status(200).json({ photos, totalPhotos });
};

export const getPhotoById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const photoId = req.params.id;

  const existingPhoto = await photoService.findPhotoById(photoId);

  if (!existingPhoto) {
    throw new AppError("Photo not found", 404);
  }

  const currentUserId = req.user?.userId;
  const isAdmin = req.user?.role === "ADMIN";
  const isOwner = existingPhoto.userId === currentUserId;

  if (!isOwner && !isAdmin) {
    throw new AppError("You are not authorized to view this photo", 403);
  }

  res.status(200).json(existingPhoto);
};

export const createPhoto = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  const type = await fileTypeFromBuffer(req.file.buffer);
  if (!type || !type.mime.startsWith("image/")) {
    throw new AppError("Only image files are allowed!", 400);
  }

  const { url, publicId } = await uploadToCloudinary(
    req.file.buffer,
    "fotobook/photos",
  );

  const newPhoto = await photoService.createPhoto(
    req.user.userId,
    req.body.title,
    url,
    req.body.description,
    req.body.isPublic === "true",
    publicId,
  );

  res.status(201).json(newPhoto);
};

export const deletePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const photoId = req.params.id;
  const currentUserId = req.user!.userId;

  const existingPhoto = await photoService.findPhotoById(photoId);

  if (!existingPhoto) {
    throw new AppError("Photo not found", 404);
  }

  if (existingPhoto.userId !== currentUserId && req.user?.role !== "admin") {
    throw new AppError("You are not authorized to delete this photo", 403);
  }

  if (existingPhoto.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(existingPhoto.cloudinaryPublicId);
  }

  const deletedPhoto = await photoService.deletePhotoById(photoId);

  res.status(200).json(deletedPhoto);
};

export const updatePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const photoId = req.params.id;
  const currentUserId = req.user!.userId;

  const existingPhoto = await photoService.findPhotoById(photoId);

  if (!existingPhoto) {
    throw new AppError("Photo not found", 404);
  }

  if (existingPhoto.userId !== currentUserId && req.user?.role !== "ADMIN") {
    throw new AppError("You are not authorized to update this photo", 403);
  }

  let newPhotoUrl = existingPhoto.photoUrl;
  let cloudinaryPublicId = existingPhoto.cloudinaryPublicId;

  if (req.file) {
    const { url, publicId } = await uploadToCloudinary(
      req.file.buffer,
      "fotobook/photos",
    );

    newPhotoUrl = url;
    cloudinaryPublicId = publicId;

    if (existingPhoto.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(existingPhoto.cloudinaryPublicId);
    }
  }

  const updatedPhoto = await photoService.updatePhotoById(
    photoId,
    newPhotoUrl,
    cloudinaryPublicId,
    req.body.title,
    req.body.description,
    req.body.isPublic === "true",
  );

  res.status(200).json(updatedPhoto);
};

export const getAllPhotosFeed = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const currentUserId = req.user.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;

  const followingIds = await userService.getAllFollowingsId(currentUserId);

  // followingIds.push(currentUserId);

  if (followingIds.length === 0) {
    return res.status(200).json({ items: [], total: 0 });
  }

  const { formattedFeedPhotos, totalPhotos } =
    await photoService.findPhotosFeedByUserId(
      currentUserId,
      followingIds,
      page,
      limit,
    );

  res.status(200).json({ items: formattedFeedPhotos, total: totalPhotos });
};

export const getAllPhotosDiscover = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const offset = (page - 1) * limit;

  const currentUserId = req.user?.userId;

  const { formattedDiscoverPhotos, totalPhotos } =
    await photoService.findPhotosDiscover(currentUserId, page, limit);

  res.status(200).json({ items: formattedDiscoverPhotos, total: totalPhotos });
};
