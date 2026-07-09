import { prisma } from "#/config/db.js";
import type { Request, Response } from "express";
import { formatFeedPhotos } from "#utils/photoUtils.js";

export const getAllPhotos = async (req: Request, res: Response) => {
  try {
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
        orderBy: { createdAt: "desc" },
        where: visibilityFilter,
      }),
      prisma.photo.count({ where: visibilityFilter }),
    ]);

    res.status(200).json({ photos, totalPhotos });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPhotoById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const photoId = req.params.id;

    const existingPhoto = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!existingPhoto) {
      return res.status(404).json({ error: "Photo not found" });
    }

    if (existingPhoto.isPublic) {
      return res.status(200).json(existingPhoto);
    }

    const currentUserId = req.user?.userId;
    const isAdmin = req.user?.role === "ADMIN";
    const isOwner = existingPhoto.userId === currentUserId;

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: This photo is private" });
    }

    res.status(200).json(existingPhoto);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPhoto = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user.userId;

    const { photoUrl, title, description, isPublic } = req.body;

    const newPhoto = await prisma.photo.create({
      data: {
        photoUrl,
        title,
        description,
        userId,
        isPublic,
      },
    });

    res.status(201).json(newPhoto);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deletePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const photoId = req.params.id;
    const currentUserId = req.user!.userId;

    const existingPhoto = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!existingPhoto) {
      return res.status(404).json({ error: "Photo not found" });
    }

    if (existingPhoto.userId !== currentUserId && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this photo" });
    }

    const deletedPhoto = await prisma.photo.delete({
      where: { id: photoId },
    });

    res.status(200).json(deletedPhoto);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updatePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const photoId = req.params.id;
    const currentUserId = req.user!.userId;
    const { photoUrl, title, description, isPublic } = req.body;

    const existingPhoto = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!existingPhoto) {
      return res.status(404).json({ error: "Photo not found" });
    }

    if (existingPhoto.userId !== currentUserId && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this photo" });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: {
        ...(photoUrl && { photoUrl }),
        ...(title && { title }),
        ...(description && { description }),
        ...(isPublic !== undefined && {
          isPublic: isPublic === "true" || isPublic === true,
        }),
      },
    });

    res.status(200).json(updatedPhoto);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPhotosFeed = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
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
    return res.status(200).json({ feed: [], total: 0 });
  }

  const [feedPhotos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      where: {
        userId: { in: followingIds },
        isPublic: true,
      },
      orderBy: { createdAt: "desc" },
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

  res.status(200).json({ feed: formattedFeedPhotos, total: totalPhotos });
};

export const getAllPhotosDiscover = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const currentUserId = req.user?.userId;

    const [discoverPhotos, totalPhotos] = await Promise.all([
      prisma.photo.findMany({
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
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

    res
      .status(200)
      .json({ discover: formattedDiscoverPhotos, total: totalPhotos });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
