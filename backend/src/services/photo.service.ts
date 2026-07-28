import { prisma } from "#config/db.js";
import { formatFeedPhotos } from "#utils/photoUtils.js";

export const findPhotosByUserId = async (
  userId: string,
  canViewPrivate: boolean,
  page: number,
  limit: number,
  search?: string,
  isPublic?: string,
) => {
  const offset = (page - 1) * limit;

  const whereClause: any = {
    userId: userId,
    ...(canViewPrivate ? {} : { isPublic: true }),
  };

  if (isPublic !== undefined) {
    whereClause.isPublic = isPublic === "true";
  }

  if (search) {
    whereClause.title = { contains: search as string, mode: "insensitive" };
  }

  const [photos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
      where: whereClause,
    }),
    prisma.photo.count({ where: whereClause }),
  ]);

  return { photos, totalPhotos };
};

export const findAllPhotos = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const [photos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
      where: {
        isPublic: true,
      },
    }),
    prisma.photo.count({ where: { isPublic: true } }),
  ]);

  return { photos, totalPhotos };
};

export const findAllPhotosByAdmin = async (
  page: number,
  limit: number,
  search?: string,
  isPublic?: string,
) => {
  const offset = (page - 1) * limit;
  const whereClause: any = {};
  if (isPublic !== undefined) {
    whereClause.isPublic = isPublic === "true";
  }

  if (search) {
    whereClause.title = { contains: search as string, mode: "insensitive" };
  }

  const [photos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
      where: whereClause,
    }),
    prisma.photo.count({ where: whereClause }),
  ]);

  return { photos, totalPhotos };
};

export const findPhotoById = async (photoId: string) => {
  const photo = await prisma.photo.findUnique({
    where: { id: photoId },
  });
  return photo;
};

export const createPhoto = async (
  userId: string,
  title: string,
  photoUrl: string,
  description: string,
  isPublic: boolean,
  cloudinaryPublicId: string,
) => {
  const newPhoto = await prisma.photo.create({
    data: {
      userId,
      title,
      photoUrl,
      description,
      isPublic,
      cloudinaryPublicId,
    },
  });
  return newPhoto;
};

export const deletePhotoById = async (photoId: string) => {
  const deletedPhoto = await prisma.photo.delete({
    where: { id: photoId },
  });
  return deletedPhoto;
};

export const updatePhotoById = async (
  photoId: string,
  photoUrl: string,
  cloudinaryPublicId: string | null,
  title: string,
  description: string,
  isPublic: boolean,
) => {
  const updatedPhoto = await prisma.photo.update({
    where: { id: photoId },
    data: {
      photoUrl: photoUrl,
      cloudinaryPublicId: cloudinaryPublicId,
      title: title,
      description: description,
      isPublic: isPublic,
    },
  });

  return updatedPhoto;
};

export const findPhotosFeedByUserId = async (
  currentUserId: string,
  followingIds: string[],
  page: number,
  limit: number,
  search?: string,
) => {
  const offset = (page - 1) * limit;

  const [feedPhotos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      where: {
        userId: { in: followingIds },
        isPublic: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search as string, mode: "insensitive" } },
                {
                  description: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
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
            ...(currentUserId
              ? {
                  followers: {
                    where: { followerId: currentUserId },
                    select: { followerId: true },
                    take: 1,
                  },
                }
              : {}),
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
      where: {
        userId: { in: followingIds },
        isPublic: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search as string, mode: "insensitive" } },
                {
                  description: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
    }),
  ]);

  const formattedFeedPhotos = feedPhotos.map(formatFeedPhotos);

  return { formattedFeedPhotos, totalPhotos };
};

export const findPhotosDiscover = async (
  currentUserId: string | undefined,
  page: number,
  limit: number,
  search?: string,
) => {
  const offset = (page - 1) * limit;

  const [discoverPhotos, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      where: {
        isPublic: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search as string, mode: "insensitive" } },
                {
                  description: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      skip: offset,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            ...(currentUserId
              ? {
                  followers: {
                    where: { followerId: currentUserId },
                    select: { followerId: true },
                    take: 1,
                  },
                }
              : {}),
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
      where: {
        isPublic: true,
        ...(search
          ? {
              OR: [
                { title: { contains: search as string, mode: "insensitive" } },
                {
                  description: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
    }),
  ]);

  const formattedDiscoverPhotos = discoverPhotos.map(formatFeedPhotos);

  return { formattedDiscoverPhotos, totalPhotos };
};
