import { z } from "zod";

export const createJournalSchema = z.object({
  entryReason: z.string().optional(),
  exitReason: z.string().optional(),
  emotionBefore: z.string().optional(),
  emotionDuring: z.string().optional(),
  emotionAfter: z.string().optional(),
  confidence: z.number().min(0, "Confidence must be at least 0").max(100, "Confidence must be at most 100").optional(),
  marketObs: z.string().optional(),
  ruleFollowed: z.string().optional(),
  mistakes: z.string().optional(),
  lessons: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateJournalInput = z.infer<typeof createJournalSchema>;