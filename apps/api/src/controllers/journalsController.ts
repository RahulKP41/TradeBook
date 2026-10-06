import { Request, Response } from "express";
import { createJournal, getJournal, updateJournal, deleteJournal } from "@/services/journalsService";
import { createJournalSchema } from "@/schemas/journals";

export async function create(req: Request, res: Response) {
  const { id: tradeId } = req.params as { id: string };
  const parsed = createJournalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const journal = await createJournal((req as any).user.userId, tradeId, parsed.data);
  res.status(201).json({ success: true, data: journal });
}

export async function get(req: Request, res: Response) {
  const { id: tradeId } = req.params as { id: string };
  const journal = await getJournal((req as any).user.userId, tradeId);
  res.json({ success: true, data: journal });
}

export async function update(req: Request, res: Response) {
  const { id: tradeId } = req.params as { id: string };
  const parsed = createJournalSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const journal = await updateJournal((req as any).user.userId, tradeId, parsed.data);
  res.json({ success: true, data: journal });
}

export async function remove(req: Request, res: Response) {
  const { id: tradeId } = req.params as { id: string };
  await deleteJournal((req as any).user.userId, tradeId);
  res.json({ success: true, data: null });
}