import prisma from "@/lib/prisma";
import { Strategy, Prisma } from "@prisma/client";

export type StrategyWithTradeCount = Omit<Strategy, "user" | "trades">;

export async function createStrategy(data: Prisma.StrategyUncheckedCreateInput) {
  return prisma.strategy.create({ data });
}

export async function findStrategiesByUserId(userId: string) {
  return prisma.strategy.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findStrategyByIdAndUserId(id: string, userId: string) {
  return prisma.strategy.findFirst({
    where: { id, userId },
  });
}

export async function updateStrategy(
  id: string,
  userId: string,
  data: Prisma.StrategyUpdateInput
) {
  return prisma.strategy.update({
    where: { id, userId },
    data,
  });
}

export async function deleteStrategy(id: string, userId: string) {
  return prisma.strategy.delete({
    where: { id, userId },
  });
}

export function toPublicStrategy(strategy: Strategy): StrategyWithTradeCount {
  return strategy as unknown as StrategyWithTradeCount;
}