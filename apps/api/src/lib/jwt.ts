import jwt from "jsonwebtoken";
import { env } from "@/config/env";

export interface TokenPayload {
  userId: string;
}

export function signToken(payload: TokenPayload, options?: jwt.SignOptions): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: options?.expiresIn || env.JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}