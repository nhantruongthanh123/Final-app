import { prisma } from "#/config/db.js";
import type { Request, Response } from "express";

export const getAllAlbums = async (req: Request, res: Response) => {
  try {
    const albums = await prisma.album.findMany();
    res.status(200).json(albums);
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

    const album = await prisma.album.findUnique({
      where: { id: albumId },
      select: {
        id: true,
        name: true,
        description: true,
        userId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createAlbum = async (req: Request, res: Response) => {
  try {
    const { photos, title, description, userId, isPublic } = req.body;

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
    const { photos, title, description, isPublic } = req.body;

    const updatedAlbum = await prisma.album.update({
      where: { id: albumId },
      data: {
        ...(photos && { photos }),
        ...(title && { title }),
        ...(description && { description }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    res.status(200).json(updatedAlbum);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
