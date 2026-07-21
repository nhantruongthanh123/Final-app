import { prisma } from "#config/db.js";
import { AppError } from "#utils/app.error.js";
import type { Request, Response } from "express";

export const followUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const followerId = req.user.userId;
  const followedId = req.params.id;

  if (followerId === followedId) {
    throw new AppError("You cannot follow yourself.", 400);
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followedId: {
        followerId,
        followedId,
      },
    },
  });

  if (existingFollow) {
    throw new AppError("You are already following this user.", 400);
  }

  const newFollow = await prisma.follow.create({
    data: {
      followerId,
      followedId,
    },
  });

  res.status(201).json(newFollow);
};

export const unfollowUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  if (!req.user) {
    throw new AppError("Unauthorized: No user found", 401);
  }

  const followerId = req.user.userId;
  const followedId = req.params.id;

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followedId: {
        followerId,
        followedId,
      },
    },
  });

  if (!existingFollow) {
    throw new AppError("You are not following this user.", 400);
  }

  await prisma.follow.delete({
    where: {
      followerId_followedId: {
        followerId,
        followedId,
      },
    },
  });

  res.status(200).json({ message: "Successfully unfollowed the user." });
};
