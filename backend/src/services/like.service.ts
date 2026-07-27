import { prisma } from "#config/db.js";

export const isUserLikePhoto = async (userId: string, photoId: string) => {
  const existingLike = await prisma.photoLike.findUnique({
    where: {
      photoId_userId: {
        photoId,
        userId,
      },
    },
  });

  return existingLike;
};

export const userLikePhoto = async (userId: string, photoId: string) => {
  const newLike = await prisma.photoLike.create({
    data: {
      userId,
      photoId,
    },
  });

  return newLike;
};

export const userUnlikePhoto = async (userId: string, photoId: string) => {
  await prisma.photoLike.delete({
    where: {
      photoId_userId: {
        photoId,
        userId,
      },
    },
  });
};

export const isUserLikeAlbum = async (userId: string, albumId: string) => {
  const existingLike = await prisma.albumLike.findUnique({
    where: {
      albumId_userId: {
        albumId,
        userId,
      },
    },
  });

  return existingLike;
};

export const userLikeAlbum = async (userId: string, albumId: string) => {
  const newLike = await prisma.albumLike.create({
    data: {
      userId,
      albumId,
    },
  });

  return newLike;
};

export const userUnlikeAlbum = async (userId: string, albumId: string) => {
  await prisma.albumLike.delete({
    where: {
      albumId_userId: {
        albumId,
        userId,
      },
    },
  });
};
