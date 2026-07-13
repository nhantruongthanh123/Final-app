import { prisma } from "#/config/db.js";
import type { Request, Response } from "express";

export const userLikePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
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
      return res
        .status(400)
        .json({ error: "You have already liked this photo." });
    }

    // Create a new like
    const newLike = await prisma.photoLike.create({
      data: {
        userId,
        photoId,
      },
    });

    res.status(201).json(newLike);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const userUnlikePhoto = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
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
      return res.status(404).json({ error: "Like not found." });
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const userLikeAlbum = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
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
      return res
        .status(400)
        .json({ error: "You have already liked this album." });
    }

    // Create a new like
    const newLike = await prisma.albumLike.create({
      data: {
        userId,
        albumId,
      },
    });

    res.status(201).json(newLike);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const userUnlikeAlbum = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
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
      return res.status(404).json({ error: "Like not found." });
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
