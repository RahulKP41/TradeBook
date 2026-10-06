import { Request, Response } from "express";
import { createAccount, getUserAccounts, getAccountById, updateAccount, deleteAccount } from "@/services/accountsService";
import { createAccountSchema, updateAccountSchema } from "@/schemas/accounts";

export async function create(req: Request, res: Response) {
  const parsed = createAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const account = await createAccount((req as any).user.userId, parsed.data);
  res.status(201).json({ success: true, data: account });
}

export async function list(req: Request, res: Response) {
  const accounts = await getUserAccounts((req as any).user.userId);
  res.json({ success: true, data: accounts });
}

export async function get(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const account = await getAccountById((req as any).user.userId, id);
  res.json({ success: true, data: account });
}

export async function update(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  const parsed = updateAccountSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: { code: "VALIDATION_ERROR", message: parsed.error.errors[0].message },
    });
  }

  const account = await updateAccount((req as any).user.userId, id, parsed.data);
  res.json({ success: true, data: account });
}

export async function remove(req: Request, res: Response) {
  const { id } = req.params as { id: string };
  await deleteAccount((req as any).user.userId, id);
  res.json({ success: true, data: null });
}