import { ConflictError, NotFoundError, ValidationError } from "@/middleware/errorHandler";
import {
  createJournal as createJournalRepo,
  findJournalByTradeIdAndUserId,
  updateJournal as updateJournalRepo,
  deleteJournal as deleteJournalRepo,
  toPublicJournal,
} from "@/repositories/journalsRepo";
import { findTradeByIdAndUserId } from "@/repositories/tradesRepo";

export interface CreateJournalData {
  entryReason?: string;
  exitReason?: string;
  emotionBefore?: string;
  emotionDuring?: string;
  emotionAfter?: string;
  confidence?: number;
  marketObs?: string;
  ruleFollowed?: string;
  mistakes?: string;
  lessons?: string;
  notes?: string;
}

export async function createJournal(userId: string, tradeId: string, data: CreateJournalData) {
  const trade = await findTradeByIdAndUserId(tradeId, userId);
  if (!trade) {
    throw new NotFoundError("Trade not found or access denied");
  }

  if (data.confidence !== undefined && (data.confidence < 0 || data.confidence > 100)) {
    throw new ValidationError("Confidence must be between 0 and 100");
  }

  const existing = await findJournalByTradeIdAndUserId(tradeId, userId);
  if (existing) {
    throw new ConflictError("Journal already exists for this trade");
  }

  const journal = await createJournalRepo({
    tradeId,
    userId,
    entryReason: data.entryReason,
    exitReason: data.exitReason,
    emotionBefore: data.emotionBefore,
    emotionDuring: data.emotionDuring,
    emotionAfter: data.emotionAfter,
    confidence: data.confidence,
    marketObs: data.marketObs,
    ruleFollowed: data.ruleFollowed,
    mistakes: data.mistakes,
    lessons: data.lessons,
    notes: data.notes,
  });

  return toPublicJournal(journal);
}

export async function getJournal(userId: string, tradeId: string) {
  const journal = await findJournalByTradeIdAndUserId(tradeId, userId);
  if (!journal) {
    throw new NotFoundError("Journal not found");
  }
  return toPublicJournal(journal);
}

export async function updateJournal(userId: string, tradeId: string, data: CreateJournalData) {
  const existing = await findJournalByTradeIdAndUserId(tradeId, userId);
  if (!existing) {
    throw new NotFoundError("Journal not found");
  }

  if (data.confidence !== undefined && (data.confidence < 0 || data.confidence > 100)) {
    throw new ValidationError("Confidence must be between 0 and 100");
  }

  const journal = await updateJournalRepo(tradeId, userId, {
    entryReason: data.entryReason,
    exitReason: data.exitReason,
    emotionBefore: data.emotionBefore,
    emotionDuring: data.emotionDuring,
    emotionAfter: data.emotionAfter,
    confidence: data.confidence,
    marketObs: data.marketObs,
    ruleFollowed: data.ruleFollowed,
    mistakes: data.mistakes,
    lessons: data.lessons,
    notes: data.notes,
  });

  return toPublicJournal(journal);
}

export async function deleteJournal(userId: string, tradeId: string) {
  const existing = await findJournalByTradeIdAndUserId(tradeId, userId);
  if (!existing) {
    throw new NotFoundError("Journal not found");
  }

  await deleteJournalRepo(tradeId, userId);
  return { id: existing.id };
}