import { prisma } from "#/config/db.js";
import type { Request, Response } from "express";

export const followUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const followerId = req.params.id;
    const { followedId } = req.body;

    if (followerId === followedId) {
      return res.status(400).json({ error: "You cannot follow yourself." });
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
      return res
        .status(400)
        .json({ error: "You are already following this user." });
    }

    const newFollow = await prisma.follow.create({
      data: {
        followerId,
        followedId,
      },
    });

    res.status(201).json(newFollow);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unfollowUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const followerId = req.params.id;
    const { followedId } = req.body;

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId,
          followedId,
        },
      },
    });

    if (!existingFollow) {
      return res
        .status(400)
        .json({ error: "You are not following this user." });
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
