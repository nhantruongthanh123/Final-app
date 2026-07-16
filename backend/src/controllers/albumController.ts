import cloudinary from "#controllers/config/cloudinary.js";
import { prisma } from "#controllers/config/db.js";
import { formatFeedAlbums } from "#utils/albumUtil.js";
import { uploadToCloudinary } from "#utils/uploadToCloudinary.js";
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
        orderBy: { updatedAt: "desc" },
        where: visibilityFilter,
        include: {
          photos: {
            select: {
              id: true,
              photoUrl: true,
            },
          },
        },
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
      include: {
        photos: {
          select: {
            id: true,
            photoUrl: true,
          },
        },
      },
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

    const currentUserId = req.user!.userId;
    const { title, description, isPublic } = req.body;
    const files = req.files as Express.Multer.File[];

    const newAlbum = await prisma.album.create({
      data: {
        title,
        description,
        isPublic: isPublic === "true" || isPublic === true,
        user: {
          connect: { id: currentUserId },
        },
      },
    });

    await Promise.all(
      files.map(async (file) => {
        const { url, publicId } = await uploadToCloudinary(
          file.buffer,
          "fotobook/albums",
        );
        return prisma.albumImage.create({
          data: {
            photoUrl: url,
            cloudinaryPublicId: publicId,
            albumId: newAlbum.id,
          },
        });
      }),
    );

    res.status(201).json(newAlbum);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
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
      include: { photos: true },
    });

    if (!existingAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    if (existingAlbum.userId !== currentUserId && req.user?.role !== "admin") {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this album" });
    }

    await Promise.all(
      existingAlbum.photos
        .filter((img) => img.cloudinaryPublicId)
        .map((img) => cloudinary.uploader.destroy(img.cloudinaryPublicId!)),
    );

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
    const { title, description, isPublic } = req.body ?? {};
    const files = (req.files as Express.Multer.File[]) ?? [];
    const removedPhotoIdsRaw = req.body?.removedPhotoIds;

    const removedPhotoIds: string[] =
      typeof removedPhotoIdsRaw === "string"
        ? JSON.parse(removedPhotoIdsRaw)
        : Array.isArray(removedPhotoIdsRaw)
          ? removedPhotoIdsRaw
          : [];

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

    if (removedPhotoIds.length > 0) {
      const photosToRemove = await prisma.albumImage.findMany({
        where: { id: { in: removedPhotoIds }, albumId },
      });

      await Promise.all(
        photosToRemove
          .filter((p) => p.cloudinaryPublicId)
          .map((p) => cloudinary.uploader.destroy(p.cloudinaryPublicId!)),
      );

      await prisma.albumImage.deleteMany({
        where: { id: { in: removedPhotoIds }, albumId },
      });
    }

    if (files && files.length > 0) {
      await Promise.all(
        files.map(async (file) => {
          const { url, publicId } = await uploadToCloudinary(
            file.buffer,
            "fotobook/albums",
          );
          return prisma.albumImage.create({
            data: {
              photoUrl: url,
              cloudinaryPublicId: publicId,
              albumId,
            },
          });
        }),
      );
    }

    const updatedAlbum = await prisma.album.update({
      where: { id: albumId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(isPublic !== undefined && {
          isPublic: isPublic === "true" || isPublic === true,
        }),
      },
      include: { photos: true },
    });

    res.status(200).json(updatedAlbum);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
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
        photos: {
          select: {
            id: true,
            photoUrl: true,
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
          photos: {
            select: {
              id: true,
              photoUrl: true,
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
