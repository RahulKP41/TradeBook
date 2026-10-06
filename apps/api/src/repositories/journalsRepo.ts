import prisma from "@/lib/prisma";
import { Journal, Prisma } from "@prisma/client";

export type JournalWithoutRelations = Omit<Journal, "trade" | "user">;

export async function createJournal(data: Prisma.JournalUncheckedCreateInput) {
  return prisma.journal.create({ data });
}

export async function findJournalByTradeIdAndUserId(tradeId: string, userId: string) {
  return prisma.journal.findFirst({
    where: { tradeId, userId },
  });
}

export async function findJournalByTradeId(tradeId: string) {
  return prisma.journal.findUnique({
    where: { tradeId },
  });
}

export async function updateJournal(
  tradeId: string,
  userId: string,
  data: Prisma.JournalUpdateInput
) {
  return prisma.journal.update({
    where: { tradeId },
    data,
  });
}

export async function deleteJournal(tradeId: string, userId: string) {
  return prisma.journal.delete({
    where: { tradeId },
  });
}

export function toPublicJournal(journal: Journal): JournalWithoutRelations {
  return journal as unknown as JournalWithoutRelations;
}