import { prisma } from "#/config/db.js";
import { attachFollowStatus } from "#utils/userUtils.js";
import type { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        skip: offset,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count(),
    ]);

    res.status(200).json({ users, totalUsers });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const userId = req.params.id;

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
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const userId = req.params.id;

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });
    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const userId = req.params.id;
    const { email, firstName, lastName, password, avatarUrl } = req.body;

    console.log(email);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(password && { password }),
        ...(avatarUrl && { avatarUrl }),
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error updating user:", error);
  }
};

export const getUserPhotos = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const userId = req.params.id;

    const userPhotos = await prisma.photo.findMany({
      where: { userId },
    });
    res.status(200).json(userPhotos);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserAlbums = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const userId = req.params.id;

    const userAlbums = await prisma.album.findMany({
      where: { userId },
    });
    res.status(200).json(userAlbums);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserFollowings = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user?.userId;

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

    res
      .status(200)
      .json(followings.map((f) => ({ ...f.following, isFollowing: true })));
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserFollowers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user?.userId;

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

    res.status(200).json(formattedFollowers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTargetUserFollowings = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user?.userId;
    const targetUserId = req.params.id;

    const followingsData = await prisma.follow.findMany({
      where: { followerId: targetUserId },
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
    const rawFollowings = followingsData.map((f) => f.following);

    const formattedFollowings = await attachFollowStatus(rawFollowings, userId);

    res.status(200).json(formattedFollowings);
  } catch (error) {}
};

export const getTargetUserFollowers = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const currentUserId = req.user?.userId;
    const targetUserId = req.params.id;

    const followersData = await prisma.follow.findMany({
      where: { followedId: targetUserId },
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

    const rawFollowers = followersData.map((f) => f.follower);

    // res.status(200).json(rawFollowers);

    const formattedFollowers = await attachFollowStatus(
      rawFollowers,
      currentUserId,
    );

    // res.status(200).json(rawFollowers);

    res.status(200).json(formattedFollowers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
