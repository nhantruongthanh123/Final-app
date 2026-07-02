import { prisma } from "#/config/db.js";
import type { Request, Response } from "express";

export const getAllPhotos = async (req: Request, res: Response) => {
  try {
    const photos = await prisma.photo.findMany();
    res.status(200).json(photos);
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

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      select: {
        id: true,
        photoUrl: true,
        title: true,
        description: true,
        userId: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.status(200).json(photo);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createPhoto = async (req: Request, res: Response) => {
  try {
    const { photoUrl, title, description, userId, isPublic } = req.body;

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
    const { photoUrl, title, description, isPublic } = req.body;

    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: {
        ...(photoUrl && { photoUrl }),
        ...(title && { title }),
        ...(description && { description }),
        ...(isPublic !== undefined && { isPublic }),
      },
    });

    res.status(200).json(updatedPhoto);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
