import { prisma } from "#config/db.js";

export const createSession = async (
  userId: string,
  refreshToken: string,
  expiresAt: Date,
) => {
  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      expiresAt,
    },
  });
};

export const deleteSessionByRefreshToken = async (refreshToken: string) => {
  await prisma.session.deleteMany({
    where: { refreshToken },
  });
};

export const findSessionByRefreshToken = async (refreshToken: string) => {
  const session = await prisma.session.findUnique({
    where: { refreshToken },
  });

  return session;
};

export const updateSessionByRefreshToken = async (
  oldRefreshToken: string,
  newRefreshToken: string,
  expiresAt: Date,
) => {
  await prisma.session.update({
    where: { id: oldRefreshToken },
    data: {
      refreshToken: newRefreshToken,
      expiresAt: expiresAt,
    },
  });
};

export const updateUserResetTokenByUserId = async (
  userId: string,
  resetPasswordToken: string | null,
  resetPasswordExpires: Date | null,
  password?: string,
) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      resetPasswordToken,
      resetPasswordExpires,
      ...(password && { password }),
    },
  });
};

export const findUserByResetPasswordToken = async (
  resetPasswordToken: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpires: { gt: new Date() },
    },
  });

  return user;
};

export const findUserByVerificationEmailToken = async (
  emailVerificationToken: string,
) => {
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: emailVerificationToken,
      emailVerificationExpires: { gt: new Date() },
    },
  });

  return user;
};

export const updateUserVerificationEmailTokenByUserId = async (
  userId: string,
  emailVerificationToken: string | null,
  emailVerificationExpires: Date | null,
  isEmailVerified?: boolean,
) => {
  await prisma.user.update({
    where: { id: userId },
    data: {
      ...(isEmailVerified !== undefined && { isEmailVerified }),
      emailVerificationToken: emailVerificationToken,
      emailVerificationExpires: emailVerificationExpires,
    },
  });
};
