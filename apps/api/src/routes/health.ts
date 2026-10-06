import { Router } from "express";
import { env } from "@/config/env";
import prisma from "@/lib/prisma";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
    },
  });
});

router.get("/ready", async (_req, res) => {
  let database: "up" | "down" = "down";
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "up";
  } catch {
    database = "down";
  }

  const ok = database === "up";
  res.status(ok ? 200 : 503).json({
    success: ok,
    data: { database },
  });
});

export default router;