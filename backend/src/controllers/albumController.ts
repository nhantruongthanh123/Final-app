import { prisma } from "#/config/db.js";
import { formatFeedAlbums } from "#utils/albumUtil.js";
import type { Request, Response } from "express";

export const getAllAlbums = async (req: Request, res: Response) => {
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

    const [albums, totalAlbums] = await Promise.all([
      prisma.album.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
        where: visibilityFilter,
      }),
      prisma.album.count({ where: visibilityFilter }),
    ]);
    res.status(200).json({ albums, totalAlbums });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAlbumById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const albumId = req.params.id;

    const existingAlbum = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!existingAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    if (existingAlbum.isPublic) {
      return res.status(200).json(existingAlbum);
    }

    const currentUserId = req.user?.userId;
    const isAdmin = req.user?.role === "ADMIN";
    const isOwner = existingAlbum.userId === currentUserId;

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Forbidden: This album is private" });
    }

    res.status(200).json(existingAlbum);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createAlbum = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user.userId;

    const { photos, title, description, isPublic } = req.body;

    const newAlbum = await prisma.album.create({
      data: {
        photos,
        title,
        description,
        userId,
        isPublic,
      },
    });

    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAlbum = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const albumId = req.params.id;
    const currentUserId = req.user!.userId;

    const existingAlbum = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!existingAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    if (existingAlbum.userId !== currentUserId && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this album" });
    }

    const deletedAlbum = await prisma.album.delete({
      where: { id: albumId },
    });

    res.status(200).json(deletedAlbum);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateAlbum = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const albumId = req.params.id;
    const currentUserId = req.user!.userId;
    const { photos, title, description, isPublic } = req.body;

    const existingAlbum = await prisma.album.findUnique({
      where: { id: albumId },
    });

    if (!existingAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    if (existingAlbum.userId !== currentUserId && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this album" });
    }

    const updatedAlbum = await prisma.album.update({
      where: { id: albumId },
      data: {
        ...(photos && { photos }),
        ...(title && { title }),
        ...(description && { description }),
        ...(isPublic !== undefined && {
          isPublic: isPublic === "true" || isPublic === true,
        }),
      },
    });

    res.status(200).json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllAlbumsFeed = async (req: Request, res: Response) => {
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

  if (followingIds.length === 0) {
    return res.status(200).json({ feed: [], total: 0 });
  }

  const [feedAlbums, totalAlbums] = await Promise.all([
    prisma.album.findMany({
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
          select: { albumLikes: true },
        },
        albumLikes: {
          where: { userId: currentUserId },
          select: { id: true },
        },
      },
    }),
    prisma.album.count({
      where: { userId: { in: followingIds }, isPublic: true },
    }),
  ]);

  const formattedFeedAlbums = feedAlbums.map((album) => {
    return formatFeedAlbums(album);
  });

  res.status(200).json({ feed: formattedFeedAlbums, total: totalAlbums });
};

export const getAllAlbumsDiscover = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const currentUserId = req.user?.userId;

    const [discoverAlbums, totalAlbums] = await Promise.all([
      prisma.album.findMany({
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
            select: { albumLikes: true },
          },
          ...(currentUserId
            ? {
                albumLikes: {
                  where: { userId: currentUserId },
                  select: { id: true },
                },
              }
            : {}),
        },
      }),
      prisma.album.count({
        where: { isPublic: true },
      }),
    ]);

    const formattedDiscoverAlbums = discoverAlbums.map(formatFeedAlbums);

    res
      .status(200)
      .json({ discover: formattedDiscoverAlbums, total: totalAlbums });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
