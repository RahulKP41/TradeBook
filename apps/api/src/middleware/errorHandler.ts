import { Request, Response, NextFunction } from "express";
import { env } from "@/config/env";

export class ApiError extends Error {
  statusCode?: number;
  code?: string;

  constructor(
    statusCode: number,
    message: string,
    code?: string
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized") {
    super(401, message, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }

  static missing() {
    return new UnauthorizedError("Missing authentication token");
  }
  static invalid() {
    return new UnauthorizedError("Invalid or expired token");
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Forbidden") {
    super(403, message, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Not found") {
    super(404, message, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class ConflictError extends ApiError {
  constructor(message = "Conflict") {
    super(409, message, "CONFLICT");
    this.name = "ConflictError";
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const error = err as ApiError;
  const statusCode = error.statusCode ?? 500;
  const code = error.code;

  if (env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: code ?? "INTERNAL_ERROR",
      message:
        statusCode >= 500 && env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
    },
  });
}