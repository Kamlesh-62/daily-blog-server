import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
    status?: number;
}

exports.module = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
  err.status = err.status || 500;
  return res.status(err.status).json({ error: err.message || "Something went wrong" });
};