import { prisma } from "#config/db.js";

export const isExistingFollow = async (
  followerId: string,
  followedId: string,
) => {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followedId: {
        followerId,
        followedId,
      },
    },
  });

  return existingFollow;
};

export const createFollow = async (followerId: string, followedId: string) => {
  const newFollow = await prisma.follow.create({
    data: {
      followerId,
      followedId,
    },
  });
  return newFollow;
};

export const deleteFollow = async (followerId: string, followedId: string) => {
  await prisma.follow.delete({
    where: {
      followerId_followedId: {
        followerId,
        followedId,
      },
    },
  });
};
