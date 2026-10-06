import { ConflictError, NotFoundError, ValidationError } from "@/middleware/errorHandler";
import { createAccount as createAccountRepo, findAccountsByUserId, findAccountByIdAndUserId, updateAccount as updateAccountRepo, deleteAccount as deleteAccountRepo, toPublicAccount } from "@/repositories/accountsRepo";

export interface CreateAccountData {
  name: string;
  currency?: string;
  initialBalance?: number;
}

export interface UpdateAccountData {
  name?: string;
  currency?: string;
  initialBalance?: number;
}

export async function createAccount(userId: string, data: CreateAccountData) {
  if (!data.name?.trim()) {
    throw new ValidationError("Account name is required");
  }

  if (data.currency && data.currency.length !== 3) {
    throw new ValidationError("Currency code must be 3 characters");
  }

  if (data.initialBalance !== undefined && data.initialBalance < 0) {
    throw new ValidationError("Initial balance cannot be negative");
  }

  const existing = await findAccountsByUserId(userId);
  const nameConflict = existing.some(
    (acc) => acc.name.toLowerCase() === data.name.trim().toLowerCase()
  );
  if (nameConflict) {
    throw new ConflictError("An account with this name already exists");
  }

  const account = await createAccountRepo({
    userId,
    name: data.name.trim(),
    currency: data.currency?.toUpperCase() || "USD",
    initialBalance: data.initialBalance || 0,
  });

  return toPublicAccount(account);
}

export async function getUserAccounts(userId: string) {
  return findAccountsByUserId(userId);
}

export async function getAccountById(userId: string, accountId: string) {
  const account = await findAccountByIdAndUserId(accountId, userId);
  if (!account) {
    throw new NotFoundError("Account not found or access denied");
  }
  return toPublicAccount(account);
}

export async function updateAccount(
  userId: string,
  accountId: string,
  data: UpdateAccountData
) {
  if (Object.keys(data).length === 0) {
    throw new ValidationError("No update data provided");
  }

  if (data.name !== undefined) {
    if (!data.name.trim()) {
      throw new ValidationError("Account name cannot be empty");
    }
    const existing = await findAccountsByUserId(userId);
    const newName = data.name.trim();
    const nameConflict = existing.some(
      (acc) => acc.id !== accountId &&
        acc.name.toLowerCase() === newName.toLowerCase()
    );
    if (nameConflict) {
      throw new ConflictError("An account with this name already exists");
    }
  }

  if (data.currency !== undefined) {
    if (data.currency.length !== 3) {
      throw new ValidationError("Currency code must be 3 characters");
    }
  }

  if (data.initialBalance !== undefined && data.initialBalance < 0) {
    throw new ValidationError("Initial balance cannot be negative");
  }

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name.trim();
  if (data.currency !== undefined) updateData.currency = data.currency.toUpperCase();
  if (data.initialBalance !== undefined) updateData.initialBalance = data.initialBalance;

  return updateAccountRepo(accountId, userId, updateData);
}

export async function deleteAccount(userId: string, accountId: string) {
  const account = await findAccountByIdAndUserId(accountId, userId);
  if (!account) {
    throw new NotFoundError("Account not found or access denied");
  }

  await deleteAccountRepo(accountId, userId);
  return { id: accountId };
}