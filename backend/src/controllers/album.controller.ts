import cloudinary from "#config/cloudinary.js";
import * as albumService from "#services/album.service.js";
import * as userService from "#services/user.service.js";
import { AppError } from "#utils/app.error.js";
import type { Request, Response } from "express";

export const getAllAlbums = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;

  const { albums, totalAlbums } = await albumService.findAllAlbums(page, limit);
  res.status(200).json({ albums, totalAlbums });
};

export const getAllAlbumsAdmin = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;

  const { search, isPublic } = req.query;

  const whereClause: any = {};
  if (search) {
    whereClause.title = { contains: search as string, mode: "insensitive" };
  }
  if (isPublic !== undefined) {
    whereClause.isPublic = isPublic === "true";
  }

  const { albums, totalAlbums } = await albumService.findAllPhotosByAdmin(
    page,
    limit,
    search as string | undefined,
    isPublic as string | undefined,
  );

  res.status(200).json({ albums, totalAlbums });
};

export const getAlbumById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const albumId = req.params.id;

  const existingAlbum = await albumService.findAlbumById(albumId);

  if (!existingAlbum) {
    throw new AppError("Album not found", 404);
  }

  const currentUserId = req.user?.userId;
  const isAdmin = req.user?.role === "ADMIN";
  const isOwner = existingAlbum.userId === currentUserId;

  if (!isOwner && !isAdmin) {
    throw new AppError("Forbidden: This album is private", 403);
  }

  res.status(200).json(existingAlbum);
};

export const createAlbum = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const currentUserId = req.user!.userId;
  const { title, description, isPublic } = req.body;
  const files = req.files as Express.Multer.File[];

  const newAlbum = await albumService.createAlbum(
    currentUserId,
    title,
    description,
    isPublic === "true" || isPublic === true,
    files,
  );

  res.status(201).json(newAlbum);
};

export const deleteAlbum = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const albumId = req.params.id;
  const currentUserId = req.user!.userId;

  const existingAlbum = await albumService.findAlbumById(albumId);

  if (!existingAlbum) {
    throw new AppError("Album not found", 404);
  }

  if (existingAlbum.userId !== currentUserId && req.user?.role !== "admin") {
    throw new AppError("You are not authorized to delete this album", 403);
  }

  await Promise.all(
    existingAlbum.photos
      .filter((img) => img.cloudinaryPublicId)
      .map((img) => cloudinary.uploader.destroy(img.cloudinaryPublicId!)),
  );

  const deletedAlbum = await albumService.deleteAlbumById(albumId);

  res.status(200).json(deletedAlbum);
};

export const updateAlbum = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const albumId = req.params.id;
  const currentUserId = req.user!.userId;
  const { title, description, isPublic } = req.body ?? {};
  const files = (req.files as Express.Multer.File[]) ?? [];
  const removedPhotoIdsRaw = req.body?.removedPhotoIds;

  const removedPhotoIds: string[] =
    typeof removedPhotoIdsRaw === "string"
      ? JSON.parse(removedPhotoIdsRaw)
      : Array.isArray(removedPhotoIdsRaw)
        ? removedPhotoIdsRaw
        : [];

  const existingAlbum = await albumService.findAlbumById(albumId);

  if (!existingAlbum) {
    throw new AppError("Album not found", 404);
  }

  if (existingAlbum.userId !== currentUserId && req.user?.role !== "ADMIN") {
    throw new AppError("You are not authorized to update this album", 403);
  }

  if (removedPhotoIds.length > 0) {
    await albumService.deletePhotosInAlbum(albumId, removedPhotoIds);
  }

  if (files && files.length > 0) {
    await albumService.addPhotosToAlbum(albumId, files);
  }

  const updatedAlbum = await albumService.updateAlbumById(
    albumId,
    title,
    description,
    isPublic === "true" || isPublic === true,
  );

  res.status(200).json(updatedAlbum);
};

export const getAllAlbumsFeed = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const currentUserId = req.user.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const offset = (page - 1) * limit;

  const followingIds = await userService.getAllFollowingsId(currentUserId);

  if (followingIds.length === 0) {
    return res.status(200).json({ items: [], total: 0 });
  }

  const { formattedFeedAlbums, totalAlbums } =
    await albumService.findAlbumsFeedByUserId(
      currentUserId,
      followingIds,
      page,
      limit,
    );

  res.status(200).json({ items: formattedFeedAlbums, total: totalAlbums });
};

export const getAllAlbumsDiscover = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 12;
  const offset = (page - 1) * limit;

  const currentUserId = req.user?.userId;

  const { formattedDiscoverAlbums, totalAlbums } =
    await albumService.findAlbumsDiscover(currentUserId, page, limit);

  res.status(200).json({ items: formattedDiscoverAlbums, total: totalAlbums });
};
