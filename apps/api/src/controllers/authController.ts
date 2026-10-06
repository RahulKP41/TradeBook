import { Request, Response } from "express";
import { register as registerService, login as loginService, refreshAccessToken } from "@/services/authService";
import { registerSchema, loginSchema } from "@/schemas/auth";
import prisma from "@/lib/prisma";

export async function register(req: Request, res: Response) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const { user, tokens } = await registerService(parsed.data.email, parsed.data.password);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, data: { user: { id: user.id, email: user.email }, tokens } });
}

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const { user, tokens } = await loginService(parsed.data.email, parsed.data.password);

  res.cookie("refreshToken", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({ success: true, data: { user: { id: user.id, email: user.email }, tokens } });
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: "NO_TOKEN", message: "No refresh token" },
    });
  }

  const { accessToken } = await refreshAccessToken(token);
  res.json({ success: true, data: { accessToken } });
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("refreshToken");
  res.json({ success: true, data: null });
}

export async function me(req: Request, res: Response) {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Not authenticated" },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, createdAt: true },
  });

  res.json({ success: true, data: user });
}