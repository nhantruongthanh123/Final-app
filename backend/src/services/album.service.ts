import { prisma } from "#config/db.js";

export const findAlbumsByUserId = async (
  userId: string,
  canViewPrivate: boolean,
) => {
  const userAlbums = await prisma.album.findMany({
    where: {
      userId: userId,
      ...(canViewPrivate ? {} : { isPublic: true }),
    },
    include: {
      photos: {
        select: {
          id: true,
          photoUrl: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return userAlbums;
};
