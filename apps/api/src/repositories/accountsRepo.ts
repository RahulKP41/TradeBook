import prisma from "@/lib/prisma";
import { TradingAccount } from "@prisma/client";

export type AccountWithoutUser = Omit<TradingAccount, "user">;

export async function createAccount(data: {
  userId: string;
  name: string;
  currency?: string;
  initialBalance?: number;
}) {
  return prisma.tradingAccount.create({
    data: {
      userId: data.userId,
      name: data.name,
      currency: data.currency || "USD",
      initialBalance: data.initialBalance || 0,
    },
  });
}

export async function findAccountsByUserId(userId: string) {
  return prisma.tradingAccount.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findAccountByIdAndUserId(id: string, userId: string) {
  return prisma.tradingAccount.findFirst({
    where: { id, userId },
  });
}

export async function updateAccount(
  id: string,
  userId: string,
  data: Partial<Pick<TradingAccount, "name" | "currency" | "initialBalance">>
) {
  return prisma.tradingAccount.update({
    where: { id, userId },
    data,
  });
}

export async function deleteAccount(id: string, userId: string) {
  return prisma.tradingAccount.delete({
    where: { id, userId },
  });
}

export function toPublicAccount(account: TradingAccount): AccountWithoutUser {
  return account as unknown as AccountWithoutUser;
}