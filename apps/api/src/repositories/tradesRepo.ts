import prisma from "@/lib/prisma";
import { Trade, Prisma } from "@prisma/client";

export type TradeCreateData = Prisma.TradeUncheckedCreateInput;

export type TradeWithoutRelations = Omit<
  Trade,
  "user" | "account" | "journal" | "strategies" | "behaviourEvents" | "aiInsights"
>;

export interface TradeFilters {
  userId: string;
  accountId?: string;
  symbol?: string;
  status?: string;
  assetType?: string;
  side?: string;
  search?: string;
}

export async function createTrade(data: Prisma.TradeUncheckedCreateInput) {
  return prisma.trade.create({ data });
}

export async function findTradesByUserId(filters: TradeFilters) {
  const where: Prisma.TradeWhereInput = { userId: filters.userId };

  if (filters.accountId) where.accountId = filters.accountId;
  if (filters.symbol) where.symbol = { contains: filters.symbol, mode: "insensitive" };
  if (filters.status) where.status = filters.status;
  if (filters.assetType) where.assetType = filters.assetType;
  if (filters.side) where.side = filters.side;

  return prisma.trade.findMany({
    where,
    include: { account: true },
    orderBy: { entryTime: "desc" },
  });
}

export async function findTradeByIdAndUserId(id: string, userId: string) {
  return prisma.trade.findFirst({
    where: { id, userId },
    include: { account: true },
  });
}

export async function updateTrade(
  id: string,
  userId: string,
  data: Prisma.TradeUpdateInput
) {
  return prisma.trade.update({
    where: { id, userId },
    data,
    include: { account: true },
  });
}

export async function deleteTrade(id: string, userId: string) {
  return prisma.trade.delete({
    where: { id, userId },
  });
}

export function toPublicTrade(trade: Trade): TradeWithoutRelations {
  return trade as unknown as TradeWithoutRelations;
}