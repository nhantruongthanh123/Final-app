import { AppError } from "#utils/app.error.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized: No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    req.user = decoded as { userId: string; role: string };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Unauthorized: Invalid token", 401);
    }
    throw new AppError("Unauthorized: Token verification failed", 401);
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized: No token provided", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );

    req.user = decoded as { userId: string; role: string };

    if (!req.user) {
      throw new AppError("Unauthorized: User not found", 401);
    }

    if (req.user.role !== "ADMIN") {
      throw new AppError("Forbidden: Admin access required", 403);
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Unauthorized: Invalid token", 401);
    }
    throw new AppError("Unauthorized: Token verification failed", 401);
  }
};
