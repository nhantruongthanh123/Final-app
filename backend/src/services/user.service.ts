import { prisma } from "#config/db.js";
import { attachFollowStatus } from "#utils/userUtils.js";

export const findUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      lastName: true,
      firstName: true,
      avatarUrl: true,
      isActive: true,
      role: true,
      updatedAt: true,
      createdAt: true,
      avatarCloudinaryId: true,
    },
  });

  return user;
};

export const findUserPasswordById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      password: true,
    },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  return user;
};

export const createUser = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  isEmailVerified: boolean = false,
  emailVerificationToken: string | null = null,
  emailVerificationExpires: Date | null = null,
) => {
  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      password,
      isEmailVerified,
      emailVerificationToken,
      emailVerificationExpires,
    },
  });

  return newUser;
};

export const deleteUserById = async (userId: string) => {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });

  return deletedUser;
};

export const updateUserById = async (
  userId: string,
  data: { email?: string; firstName?: string; lastName?: string },
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data,
  });

  return updatedUser;
};

export const updateUserPasswordById = async (
  userId: string,
  newPassword: string,
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });

  return updatedUser;
};

export const updateUserAvatarById = async (
  userId: string,
  avatarUrl: string,
  avatarCloudinaryId: string,
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl, avatarCloudinaryId },
  });

  return updatedUser;
};

export const updateUserStatusById = async (
  userId: string,
  isActive: boolean,
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  return updatedUser;
};

export const findUsersFollowing = async (userId: string) => {
  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: {
      following: {
        select: {
          id: true,
          email: true,
          avatarUrl: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return followings.map((f) => ({ ...f.following, isFollowing: true }));
};

export const findUsersFollowers = async (userId: string) => {
  const followers = await prisma.follow.findMany({
    where: { followedId: userId },
    select: {
      follower: {
        select: {
          id: true,
          email: true,
          avatarUrl: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  const rawFollowers = followers.map((f) => f.follower);

  const formattedFollowers = await attachFollowStatus(rawFollowers, userId);

  return formattedFollowers;
};

export const findUsersFollowingByTargetUserId = async (
  targetUserId: string,
  currentUserId: string,
  page: number = 1,
  limit: number = 12,
  search?: string,
) => {
  const offset = (page - 1) * limit;

  const whereClause: any = {
    followerId: targetUserId,
  };

  if (search) {
    whereClause.following = {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const [followings, totalFollowings] = await Promise.all([
    prisma.follow.findMany({
      skip: offset,
      take: limit,
      where: whereClause,
      select: {
        following: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.follow.count({ where: whereClause }),
  ]);

  const rawFollowings = followings.map((f) => f.following);

  const formattedFollowings = await attachFollowStatus(
    rawFollowings,
    currentUserId,
  );

  return { formattedFollowings, totalFollowings };
};

export const findUsersFollowersByTargetUserId = async (
  targetUserId: string,
  currentUserId: string,
  page: number = 1,
  limit: number = 12,
  search?: string,
) => {
  const offset = (page - 1) * limit;

  const whereClause: any = {
    followedId: targetUserId,
  };

  if (search) {
    whereClause.follower = {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ],
    };
  }

  const [followers, totalFollowers] = await Promise.all([
    prisma.follow.findMany({
      skip: offset,
      take: limit,
      where: whereClause,
      select: {
        follower: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
    prisma.follow.count({ where: whereClause }),
  ]);

  const rawFollowers = followers.map((f) => f.follower);

  const formattedFollowers = await attachFollowStatus(
    rawFollowers,
    currentUserId,
  );

  return { formattedFollowers, totalFollowers };
};

export const getusersByAdmin = async (
  page: number = 1,
  limit: number = 12,
  search?: string,
  role?: string,
  isActive?: string,
) => {
  const offset = (page - 1) * limit;

  const whereClause: any = {};

  if (search) {
    whereClause.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  if (role && role !== "ALL") {
    whereClause.role = role;
  }

  if (isActive === "true") {
    whereClause.isActive = true;
  } else if (isActive === "false") {
    whereClause.isActive = false;
  }

  const [users, totalUsers] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.user.count({ where: whereClause }),
  ]);

  return { users, totalUsers };
};

export const isFollowing = async (followerId: string, followedId: string) => {
  const follow = await prisma.follow.findFirst({
    where: {
      followerId,
      followedId,
    },
  });

  return !!follow;
};

export const getAllFollowingsId = async (userId: string) => {
  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followedId: true },
  });

  return followings.map((f) => f.followedId);
};
