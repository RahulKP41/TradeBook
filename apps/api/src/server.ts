import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "@/config/env";
import healthRouter from "@/routes/health";
import authRouter from "@/routes/auth";
import accountsRouter from "@/routes/accounts";
import { authMiddleware } from "@/middleware/auth";
import { errorHandler } from "@/middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.NODE_ENV === "production" ? false : "http://localhost:3000",
      credentials: true,
    })
  );
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.json({ success: true, data: { name: "TradeBook API", version: "0.1.0" } });
  });

  app.use("/health", healthRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/accounts", authMiddleware, accountsRouter);

  app.use(errorHandler);

  return app;
}