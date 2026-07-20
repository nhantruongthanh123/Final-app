import { AppError } from "#utils/app.error.js";
import { NextFunction, Request, Response } from "express";

export async function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.name === "TokenExpiredError") {
    err = new AppError("Token has expired. Please log in again.", 401);
  } else if (err.name === "JsonWebTokenError") {
    err = new AppError("Invalid token. Please log in again.", 403);
  } else {
    err.statusCode = err.statusCode || 500;
  }
  err.status = err.status || "error";

  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      statusCode: err.statusCode,
      stacktree: err.stack,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
}
