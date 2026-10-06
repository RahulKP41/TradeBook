import { Request, Response } from "express";
import {
  createStrategy,
  getUserStrategies,
  getStrategyById,
  updateStrategy,
  deleteStrategy,
} from "@/services/strategiesService";
import { createStrategySchema, updateStrategySchema } from "@/schemas/strategies";

export async function create(req: Request, res: Response) {
  const parsed = createStrategySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const strategy = await createStrategy((req as any).user.userId, parsed.data);
  res.status(201).json({ success: true, data: strategy });
}

export async function list(req: Request, res: Response) {
  const strategies = await getUserStrategies((req as any).user.userId);
  res.json({ success: true, data: strategies });
}

export async function get(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const strategy = await getStrategyById((req as any).user.userId, id);
  res.json({ success: true, data: strategy });
}

export async function update(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const parsed = updateStrategySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const strategy = await updateStrategy((req as any).user.userId, id, parsed.data);
  res.json({ success: true, data: strategy });
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  await deleteStrategy((req as any).user.userId, id);
  res.json({ success: true, data: null });
}