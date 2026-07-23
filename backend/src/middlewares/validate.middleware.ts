import { AppError } from "#utils/app.error.js";
import { NextFunction, Request, Response } from "express";
import { fileTypeFromBuffer } from "file-type";
import { z } from "zod";

export const validateBody = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      const message = errors
        .map((err) => `${err.field}: ${err.message}`)
        .join(", ");

      throw new AppError(message, 400);
    }

    req.body = result.data;
    next();
  };
};

export const validateParams = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const result = await schema.safeParseAsync(req.params);

    if (!result.success) {
      res.status(400).json({
        message: "URL Parameter validation failed",
        errors: result.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    Object.defineProperty(req, "params", {
      value: result.data,
      configurable: true,
      enumerable: true,
      writable: true,
    });
    next();
  };
};

export const validateQuery = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const result = await schema.safeParseAsync(req.query);
    if (!result.success) {
      res.status(400).json({
        message: "Query validation failed",
        errors: result.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }
    Object.defineProperty(req, "query", {
      value: result.data,
      configurable: true,
      enumerable: true,
      writable: true,
    });
    next();
  };
};

export const validateFiles = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let filesToProcess: Express.Multer.File[] = [];

    if (req.file) {
      filesToProcess = [req.file];
    } else if (req.files) {
      if (Array.isArray(req.files)) {
        filesToProcess = req.files;
      } else {
        filesToProcess = Object.values(req.files).flat();
      }
    }

    if (filesToProcess.length > 0) {
      for (const file of filesToProcess) {
        if (file.buffer) {
          const realType = await fileTypeFromBuffer(file.buffer);
          file.mimetype = realType?.mime || "application/octet-stream";
        }
      }
    }

    const targetToValidate = req.file || req.files || undefined;

    const result = await schema.safeParseAsync(targetToValidate);

    if (!result.success) {
      const errors = result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      const message = errors
        .map((err) => `${err.field}: ${err.message}`)
        .join(", ");

      throw new AppError(`File Validation Error: ${message}`, 400);
    }

    next();
  };
};
