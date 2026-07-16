import { prisma } from "#controllers/config/db.js";

export const attachFollowStatus = async (
  users: {
    id: string;
    email: string;
    avatarUrl: string | null;
    firstName: string | null;
    lastName: string | null;
  }[],
  currentUserId: string,
) => {
  if (users.length === 0) return [];

  const userIds = users.map((user) => user.id);

  const activeFollows = await prisma.follow.findMany({
    where: {
      followerId: currentUserId,
      followedId: { in: userIds },
    },
  });

  const followingSet = new Set(activeFollows.map((f) => f.followedId));
  return users.map((user) => ({
    ...user,
    isFollowing: followingSet.has(user.id),
  }));
};
