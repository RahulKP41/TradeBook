import { ConflictError, NotFoundError, ValidationError } from "@/middleware/errorHandler";
import {
  createTrade as createTradeRepo,
  findTradeByIdAndUserId,
  findTradesByUserId,
  updateTrade as updateTradeRepo,
  deleteTrade as deleteTradeRepo,
  toPublicTrade,
} from "@/repositories/tradesRepo";
import { findAccountByIdAndUserId } from "@/repositories/accountsRepo";

export interface CreateTradeData {
  accountId: string;
  symbol: string;
  assetType: string;
  side: string;
  quantity: number;
  entryPrice: number;
  entryTime: Date;
  stopLoss?: number;
  takeProfit?: number;
  fees?: number;
  status?: string;
}

export interface UpdateTradeData {
  exitPrice?: number;
  exitTime?: Date;
  status?: string;
  fees?: number;
}

function calculatePnl(
  side: string,
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  fees: number = 0
) {
  const gross =
    side === "LONG"
      ? (exitPrice - entryPrice) * quantity
      : (entryPrice - exitPrice) * quantity;
  return {
    grossPnl: gross - fees,
    netPnl: gross - fees,
  };
}

function calculateRMultiple(netPnl: number, riskAmount: number) {
  if (!riskAmount || riskAmount === 0) return null;
  return netPnl / riskAmount;
}

export async function createTrade(userId: string, data: CreateTradeData) {
  if (!data.symbol?.trim()) {
    throw new ValidationError("Symbol is required");
  }

  if (data.quantity <= 0) {
    throw new ValidationError("Quantity must be positive");
  }

  if (data.entryPrice <= 0) {
    throw new ValidationError("Entry price must be positive");
  }

  if (!["LONG", "SHORT"].includes(data.side)) {
    throw new ValidationError("Side must be LONG or SHORT");
  }

  if (!["STOCK", "CRYPTO", "FOREX", "OPTION", "FUTURE"].includes(data.assetType)) {
    throw new ValidationError("Invalid asset type");
  }

  // Verify account belongs to user
  const account = await findAccountByIdAndUserId(data.accountId, userId);
  if (!account) {
    throw new NotFoundError("Account not found or access denied");
  }

  const trade = await createTradeRepo({
    userId,
    accountId: data.accountId,
    symbol: data.symbol,
    assetType: data.assetType,
    side: data.side,
    quantity: data.quantity,
    entryPrice: data.entryPrice,
    entryTime: data.entryTime,
    stopLoss: data.stopLoss,
    takeProfit: data.takeProfit,
    fees: data.fees || 0,
    status: data.status || "OPEN",
  });

  return toPublicTrade(trade);
}

export async function getUserTrades(userId: string, filters: any = {}) {
  return findTradesByUserId({ ...filters, userId });
}

export async function getTradeById(userId: string, tradeId: string) {
  const trade = await findTradeByIdAndUserId(tradeId, userId);
  if (!trade) {
    throw new NotFoundError("Trade not found or access denied");
  }
  return toPublicTrade(trade);
}

export async function updateTrade(
  userId: string,
  tradeId: string,
  data: UpdateTradeData
) {
  const existing = await findTradeByIdAndUserId(tradeId, userId);
  if (!existing) {
    throw new NotFoundError("Trade not found or access denied");
  }

  const updateData: any = { ...data };

  if (data.exitPrice !== undefined && data.exitPrice > 0) {
    const pnl = calculatePnl(
      existing.side,
      Number(existing.entryPrice),
      data.exitPrice,
      Number(existing.quantity),
      data.fees !== undefined ? data.fees : Number(existing.fees || 0)
    );
    updateData.exitTime = data.exitTime || new Date();
    updateData.status = data.status || "CLOSED";
    updateData.grossPnl = pnl.grossPnl;
    updateData.netPnl = pnl.netPnl;
    updateData.rMultiple = calculateRMultiple(pnl.netPnl, Number(existing.riskAmount || 0));
  }

  const updated = await updateTradeRepo(tradeId, userId, updateData);
  return toPublicTrade(updated);
}

export async function deleteTrade(userId: string, tradeId: string) {
  const trade = await findTradeByIdAndUserId(tradeId, userId);
  if (!trade) {
    throw new NotFoundError("Trade not found or access denied");
  }

  await deleteTradeRepo(tradeId, userId);
  return { id: tradeId };
}