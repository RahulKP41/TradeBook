import { z } from "zod";

export const createTradeSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  symbol: z.string().min(1, "Symbol is required").trim(),
  assetType: z.enum(["STOCK", "CRYPTO", "FOREX", "OPTION", "FUTURE"]),
  side: z.enum(["LONG", "SHORT"]),
  quantity: z.number().positive("Quantity must be positive"),
  entryPrice: z.number().positive("Entry price must be positive"),
  entryTime: z.union([z.date(), z.string().datetime()]).optional().default(new Date()),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  fees: z.number().min(0).optional().default(0),
  status: z.enum(["OPEN", "CLOSED", "CANCELLED"]).optional().default("OPEN"),
});

export const updateTradeSchema = z.object({
  exitPrice: z.number().positive().optional(),
  exitTime: z.union([z.date(), z.string().datetime()]).optional(),
  status: z.enum(["OPEN", "CLOSED", "CANCELLED"]).optional(),
  fees: z.number().min(0).optional(),
});

export type CreateTradeInput = z.infer<typeof createTradeSchema>;
export type UpdateTradeInput = z.infer<typeof updateTradeSchema>;