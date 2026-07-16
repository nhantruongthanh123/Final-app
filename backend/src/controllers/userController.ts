import cloudinary from "#controllers/config/cloudinary.js";
import { prisma } from "#controllers/config/db.js";
import { uploadToCloudinary } from "#utils/uploadToCloudinary.js";
import { attachFollowStatus } from "#utils/userUtils.js";
import bcrypt from "bcryptjs";
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
        orderBy: { updatedAt: "desc" },
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
    const currentUserId = req.user?.userId;

    if (!currentUserId) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const isFollowing = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followedId: userId,
      },
    });

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
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ ...user, isFollowing: !!isFollowing });
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    console.log("Request body:", req.body);

    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user?.userId;

    const { email, firstName, lastName, avatarUrl } = req.body;

    console.log(email, firstName, lastName, avatarUrl);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(avatarUrl && { avatarUrl }),
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error updating user:", error);
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const userId = req.user?.userId;
    const { password, newPassword } = req.body;

    const oldPassword = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!bcrypt.compareSync(password, oldPassword?.password || "")) {
      return res.status(400).json({ error: "Incorrect current password" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: bcrypt.hashSync(newPassword, 10) },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error updating user password:", error);
  }
};

export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user?.userId;

    // Upload the new avatar to Cloudinary
    const { url, publicId } = await uploadToCloudinary(
      req.file.buffer,
      "fotobook/avatars",
    );

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarCloudinaryId: true },
    });

    // Delete the old avatar from Cloudinary if it exists
    if (existingUser?.avatarCloudinaryId) {
      try {
        await cloudinary.uploader.destroy(existingUser.avatarCloudinaryId);
      } catch (error) {
        console.error(
          "Error occurred while deleting old avatar from Cloudinary:",
          error,
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatarUrl: url,
        avatarCloudinaryId: publicId,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
    console.log("Error updating user avatar:", error);
  }
};

export const updateUserAdmin = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    {
    }
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

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
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: No user found" });
    }

    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;
    const targetUserId = req.params.id;

    const isOwner = currentUserId === targetUserId;
    const isAdmin = currentUserRole === "ADMIN";
    const canViewPrivate = isOwner || isAdmin;

    const userPhotos = await prisma.photo.findMany({
      where: {
        userId: targetUserId,
        ...(canViewPrivate ? {} : { isPublic: true }),
      },
      orderBy: { updatedAt: "desc" },
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
      orderBy: { updatedAt: "desc" },
      include: {
        photos: {
          select: {
            id: true,
            photoUrl: true,
          },
        },
      },
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
