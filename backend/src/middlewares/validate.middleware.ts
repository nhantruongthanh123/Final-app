import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validateBody = (schema: z.ZodTypeAny) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const result = await schema.safeParseAsync(req.body);

    if (!result.success) {
      res.status(400).json({
        massage: "Validation failed",
        errors: result.error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });

      return;
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
