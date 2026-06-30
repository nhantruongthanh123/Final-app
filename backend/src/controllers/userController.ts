import { prisma } from "../config/db";
import type { Request, Response } from "express";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};
