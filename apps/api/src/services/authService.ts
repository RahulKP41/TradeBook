import prisma from "@/lib/prisma";
import { signToken, verifyToken } from "@/lib/jwt";
import { hashPassword, verifyPassword } from "@/lib/password";
import { ValidationError, ConflictError } from "@/middleware/errorHandler";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export async function register(
  email: string,
  password: string
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ConflictError("Email already in use");
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  const tokens = await issueTokens(user.id);
  return { user, tokens };
}

export async function login(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ValidationError("Invalid email or password");
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new ValidationError("Invalid email or password");
  }

  const tokens = await issueTokens(user.id);
  return { user, tokens };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    const payload = verifyToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) throw new Error("user not found");
    const accessToken = signToken({ userId: user.id });
    return { accessToken };
  } catch (err) {
    throw new ValidationError("Invalid refresh token");
  }
}

async function issueTokens(userId: string) {
  const accessToken = signToken({ userId });
  const refreshToken = signToken(
    { userId },
    { expiresIn: "30d" }
  );
  return { accessToken, refreshToken };
}