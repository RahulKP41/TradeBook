import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/lib/jwt";
import { UnauthorizedError } from "./errorHandler";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) {
    throw UnauthorizedError.missing();
  }

  const token = header.startsWith("Bearer ")
    ? header.slice(7)
    : header;

  try {
    const payload = verifyToken(token);
    req.user = { userId: payload.userId };
    next();
  } catch {
    throw UnauthorizedError.invalid();
  }
}