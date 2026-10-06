import { Request, Response } from "express";
import {
  createTrade,
  getUserTrades,
  getTradeById,
  updateTrade,
  deleteTrade,
} from "@/services/tradesService";
import { createTradeSchema, updateTradeSchema } from "@/schemas/trades";

export async function create(req: Request, res: Response) {
  const parsed = createTradeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const trade = await createTrade((req as any).user.userId, {
    ...parsed.data,
    entryTime: parsed.data.entryTime instanceof Date ? parsed.data.entryTime : new Date(parsed.data.entryTime),
  });
  res.status(201).json({ success: true, data: trade });
}

export async function list(req: Request, res: Response) {
  const filters = {
    accountId: req.query.accountId as string,
    symbol: req.query.symbol as string,
    status: req.query.status as string,
    assetType: req.query.assetType as string,
    side: req.query.side as string,
    search: req.query.search as string,
  };

  const trades = await getUserTrades((req as any).user.userId, filters);
  res.json({ success: true, data: trades });
}

export async function get(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const trade = await getTradeById((req as any).user.userId, id);
  res.json({ success: true, data: trade });
}

export async function update(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const parsed = updateTradeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const trade = await updateTrade((req as any).user.userId, id, {
    ...parsed.data,
    exitTime: parsed.data.exitTime instanceof Date ? parsed.data.exitTime : parsed.data.exitTime ? new Date(parsed.data.exitTime) : undefined,
  });
  res.json({ success: true, data: trade });
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  await deleteTrade((req as any).user.userId, id);
  res.json({ success: true, data: null });
}