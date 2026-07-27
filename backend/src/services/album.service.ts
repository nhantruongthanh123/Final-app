import cloudinary from "#config/cloudinary.js";
import { prisma } from "#config/db.js";
import { formatFeedAlbums } from "#utils/albumUtil.js";
import { uploadToCloudinary } from "#utils/uploadToCloudinary.js";

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

export const findAllAlbums = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  const [albums, totalAlbums] = await Promise.all([
    prisma.album.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
      where: {
        isPublic: true,
      },
    }),
    prisma.album.count({ where: { isPublic: true } }),
  ]);

  return { albums, totalAlbums };
};

export const findAllPhotosByAdmin = async (
  page: number,
  limit: number,
  search?: string,
  isPublic?: string,
) => {
  const offset = (page - 1) * limit;

  const whereClause: any = {};
  if (search) {
    whereClause.title = { contains: search as string, mode: "insensitive" };
  }
  if (isPublic !== undefined) {
    whereClause.isPublic = isPublic === "true";
  }

  const [albums, totalAlbums] = await Promise.all([
    prisma.album.findMany({
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
      where: whereClause,
      include: {
        photos: {
          select: {
            id: true,
            photoUrl: true,
          },
        },
      },
    }),
    prisma.album.count({ where: whereClause }),
  ]);

  return { albums, totalAlbums };
};

export const findAlbumById = async (albumId: string) => {
  const album = await prisma.album.findUnique({
    where: { id: albumId },
    include: { photos: true },
  });
  return album;
};

export const createAlbum = async (
  currentUserId: string,
  title: string,
  description: string,
  isPublic: boolean,
  files: Express.Multer.File[],
) => {
  const newAlbum = await prisma.album.create({
    data: {
      title,
      description,
      isPublic,
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

  return newAlbum;
};

export const deleteAlbumById = async (albumId: string) => {
  const deletedAlbum = await prisma.album.delete({
    where: { id: albumId },
  });
  return deletedAlbum;
};

export const deletePhotosInAlbum = async (
  albumId: string,
  removedPhotoIds: string[],
) => {
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
};

export const addPhotosToAlbum = async (
  albumId: string,
  files: Express.Multer.File[],
) => {
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
};

export const updateAlbumById = async (
  albumId: string,
  title: string,
  description: string,
  isPublic: boolean,
) => {
  const updatedAlbum = await prisma.album.update({
    where: { id: albumId },
    data: {
      ...(title && { title }),
      ...(description && { description }),
      ...(isPublic !== undefined && {
        isPublic,
      }),
    },
    include: { photos: true },
  });

  return updatedAlbum;
};

export const findAlbumsFeedByUserId = async (
  currentUserId: string,
  followingIds: string[],
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

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

  return { formattedFeedAlbums, totalAlbums };
};

export const findAlbumsDiscover = async (
  currentUserId: string | undefined,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const [discoverAlbums, totalAlbums] = await Promise.all([
    prisma.album.findMany({
      where: { isPublic: true },
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

  return { formattedDiscoverAlbums, totalAlbums };
};
