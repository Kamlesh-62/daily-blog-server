// Centralized error normalization. Throw AppError for custom status codes.
import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  status: number;
  constructor(message = "Internal Server Error", status = 500) {
    super(message);
    this.status = status;
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const status = (err as AppError).status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ status, success: false, message });
};
