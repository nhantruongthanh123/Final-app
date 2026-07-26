import { prisma } from "#config/db.js";

export const findPhotosByUserId = async (
  userId: string,
  canViewPrivate: boolean,
) => {
  const userPhotos = await prisma.photo.findMany({
    where: {
      userId: userId,
      ...(canViewPrivate ? {} : { isPublic: true }),
    },
    orderBy: { updatedAt: "desc" },
  });

  return userPhotos;
};
