import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      );
      req.user = decoded as { userId: string; role: string };
    } catch (error) {}
  }
  next();
};
