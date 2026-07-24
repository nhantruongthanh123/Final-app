import passport from "#config/passport.js";
import { AppError } from "#utils/app.error.js";
import { NextFunction, Request, Response } from "express";

export const authenticateLocal = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: Express.User | false,
      info: { message?: string },
    ) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(
          new AppError(info?.message || "Authentication failed", 401),
        );
      }

      req.user = user;
      next();
    },
  )(req, res, next);
};

export const authenticateGoogleCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new AppError("Google authentication failed", 401));
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const authenticateFacebookCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "facebook",
    { session: false },
    (err: AppError | null, user: Express.User | false) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new AppError("Facebook authentication failed", 401));
      }
      req.user = user;
      next();
    },
  )(req, res, next);
};
