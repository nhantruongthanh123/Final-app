import { prisma } from "#/config/db.js";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Email is not registered." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Password is not correct." });
    }

    //Handle token generation here (e.g., JWT) and send it back to the client
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "540m" },
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Create sesson in the database
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt,
      },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ error: "No refresh token provided" });
    }

    await prisma.session.deleteMany({
      where: { refreshToken },
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const refreshUserToken = async (req: Request, res: Response) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    try {
      const decoded = jwt.verify(
        oldRefreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
      );
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(403).json({ error: "Refresh token expired" });
      }
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const session = await prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
    });

    if (!session) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user || !user.isActive) {
      return res
        .status(403)
        .json({ error: "User account is suspended or deleted" });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "540m" },
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const existingSession = await prisma.session.findUnique({
      where: { refreshToken: oldRefreshToken },
    });

    if (!existingSession) {
      return res
        .status(403)
        .json({ error: "Session not found. Please log in again." });
    }

    await prisma.session.update({
      where: { id: existingSession.id },
      data: {
        refreshToken: newRefreshToken,
        expiresAt: expiresAt,
      },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log("Error refreshing token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
