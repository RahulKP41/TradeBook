import { ConflictError, NotFoundError, ValidationError } from "@/middleware/errorHandler";
import {
  createStrategy as createStrategyRepo,
  findStrategiesByUserId,
  findStrategyByIdAndUserId,
  updateStrategy as updateStrategyRepo,
  deleteStrategy as deleteStrategyRepo,
  toPublicStrategy,
} from "@/repositories/strategiesRepo";

export interface CreateStrategyData {
  name: string;
  description?: string;
  rules?: string;
}

export interface UpdateStrategyData {
  name?: string;
  description?: string;
  rules?: string;
}

export async function createStrategy(userId: string, data: CreateStrategyData) {
  if (!data.name?.trim()) {
    throw new ValidationError("Strategy name is required");
  }

  const existing = await findStrategiesByUserId(userId);
  const nameConflict = existing.some(
    (s) => s.name.toLowerCase() === data.name.trim().toLowerCase()
  );
  if (nameConflict) {
    throw new ConflictError("A strategy with this name already exists");
  }

  const strategy = await createStrategyRepo({
    userId,
    name: data.name.trim(),
    description: data.description,
    rules: data.rules,
  });

  return toPublicStrategy(strategy);
}

export async function getUserStrategies(userId: string) {
  return findStrategiesByUserId(userId);
}

export async function getStrategyById(userId: string, strategyId: string) {
  const strategy = await findStrategyByIdAndUserId(strategyId, userId);
  if (!strategy) {
    throw new NotFoundError("Strategy not found or access denied");
  }
  return toPublicStrategy(strategy);
}

export async function updateStrategy(
  userId: string,
  strategyId: string,
  data: UpdateStrategyData
) {
  const existing = await findStrategyByIdAndUserId(strategyId, userId);
  if (!existing) {
    throw new NotFoundError("Strategy not found or access denied");
  }

  if (data.name !== undefined) {
    if (!data.name.trim()) {
      throw new ValidationError("Strategy name cannot be empty");
    }
    const allStrategies = await findStrategiesByUserId(userId);
    const newName = data.name.trim();
    const nameConflict = allStrategies.some(
      (s) => s.id !== strategyId &&
        s.name.toLowerCase() === newName.toLowerCase()
    );
    if (nameConflict) {
      throw new ConflictError("A strategy with this name already exists");
    }
  }

  const updated = await updateStrategyRepo(strategyId, userId, data as any);
  return toPublicStrategy(updated);
}

export async function deleteStrategy(userId: string, strategyId: string) {
  const existing = await findStrategyByIdAndUserId(strategyId, userId);
  if (!existing) {
    throw new NotFoundError("Strategy not found or access denied");
  }

  await deleteStrategyRepo(strategyId, userId);
  return { id: strategyId };
}