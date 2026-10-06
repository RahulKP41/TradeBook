import { z } from "zod";

export const createStrategySchema = z.object({
  name: z.string().min(1, "Strategy name is required").trim(),
  description: z.string().optional(),
  rules: z.string().optional(),
});

export const updateStrategySchema = z.object({
  name: z.string().min(1, "Strategy name cannot be empty").trim().optional(),
  description: z.string().optional(),
  rules: z.string().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "No update data provided", path: [] }
);

export type CreateStrategyInput = z.infer<typeof createStrategySchema>;
export type UpdateStrategyInput = z.infer<typeof updateStrategySchema>;