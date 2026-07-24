import cloudinary from "#config/cloudinary.js";
import { prisma } from "#config/db.js";
import { AppError } from "#utils/app.error.js";
import { formatFeedPhotos } from "#utils/photoUtils.js";
import { uploadToCloudinary } from "#utils/uploadToCloudinary.js";
import type { Request, Response } from "express";
import { fileTypeFromBuffer } from "file-type";

export const getAllPhotos = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const offset = (page - 1) * limit;

  let visibilityFilter: any = { isPublic: true };
  if (req.user) {
    if (req.user.role === "ADMIN") {
      visibilityFilter = {};
    } else {
      visibilityFilter = {
        OR: [{ isPublic: true }, { userId: req.user.userId }],
      };
    }
  }

  const [photos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
      where: visibilityFilter,
    }),
    prisma.photo.count({ where: visibilityFilter }),
  ]);

  res.status(200).json({ photos, totalPhotos });
};

export const getAllPhotosAdmin = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const offset = (page - 1) * limit;

  const { search, isPublic } = req.query;

  const whereClause: any = {};
  if (isPublic !== undefined) {
    whereClause.isPublic = isPublic === "true";
  }

  if (search) {
    whereClause.title = { contains: search as string, mode: "insensitive" };
  }

  const [photos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
      where: whereClause,
    }),
    prisma.photo.count({ where: whereClause }),
  ]);

  res.status(200).json({ photos, totalPhotos });
};

export const getPhotoById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const photoId = req.params.id;

  const existingPhoto = await prisma.photo.findUnique({
    where: { id: photoId },
  });

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

  const newPhoto = await prisma.photo.create({
    data: {
      photoUrl: url,
      title: req.body.title,
      description: req.body.description,
      userId: req.user.userId,
      isPublic: req.body.isPublic === "true",
      cloudinaryPublicId: publicId,
    },
  });

  res.status(201).json(newPhoto);
};

export const deletePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const photoId = req.params.id;
  const currentUserId = req.user!.userId;

  const existingPhoto = await prisma.photo.findUnique({
    where: { id: photoId },
  });

  if (!existingPhoto) {
    throw new AppError("Photo not found", 404);
  }

  if (existingPhoto.userId !== currentUserId && req.user?.role !== "admin") {
    throw new AppError("You are not authorized to delete this photo", 403);
  }

  if (existingPhoto.cloudinaryPublicId) {
    await cloudinary.uploader.destroy(existingPhoto.cloudinaryPublicId);
  }

  const deletedPhoto = await prisma.photo.delete({
    where: { id: photoId },
  });

  res.status(200).json(deletedPhoto);
};

export const updatePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const photoId = req.params.id;
  const currentUserId = req.user!.userId;

  const existingPhoto = await prisma.photo.findUnique({
    where: { id: photoId },
  });

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

  const updatedPhoto = await prisma.photo.update({
    where: { id: existingPhoto.id },
    data: {
      photoUrl: newPhotoUrl,
      cloudinaryPublicId: cloudinaryPublicId,
      title: req.body.title,
      description: req.body.description,
      isPublic: req.body.isPublic === "true",
    },
  });
  res.status(200).json(updatedPhoto);
};

export const getAllPhotosFeed = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const currentUserId = req.user.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const offset = (page - 1) * limit;

  const followings = await prisma.follow.findMany({
    where: { followerId: currentUserId },
    select: { followedId: true },
  });

  const followingIds = followings.map((f) => f.followedId);

  // followingIds.push(currentUserId);

  if (followingIds.length === 0) {
    return res.status(200).json({ items: [], total: 0 });
  }

  const [feedPhotos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      where: {
        userId: { in: followingIds },
        isPublic: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { photoLikes: true },
        },
        photoLikes: {
          where: { userId: currentUserId },
          select: { id: true },
        },
      },
    }),
    prisma.photo.count({
      where: { userId: { in: followingIds }, isPublic: true },
    }),
  ]);

  const formattedFeedPhotos = feedPhotos.map(formatFeedPhotos);

  res.status(200).json({ items: formattedFeedPhotos, total: totalPhotos });
};

export const getAllPhotosDiscover = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const offset = (page - 1) * limit;

  const currentUserId = req.user?.userId;

  const [discoverPhotos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      where: { isPublic: true },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        _count: {
          select: { photoLikes: true },
        },
        ...(currentUserId
          ? {
              photoLikes: {
                where: { userId: currentUserId },
                select: { id: true },
              },
            }
          : {}),
      },
    }),
    prisma.photo.count({
      where: { isPublic: true },
    }),
  ]);

  const formattedDiscoverPhotos = discoverPhotos.map(formatFeedPhotos);

  res.status(200).json({ items: formattedDiscoverPhotos, total: totalPhotos });
};
