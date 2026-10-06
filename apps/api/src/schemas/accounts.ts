import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Account name is required").trim(),
  currency: z
    .string()
    .length(3, "Currency code must be 3 characters")
    .regex(/^[a-zA-Z]{3}$/, "Currency must be 3 letters")
    .optional(),
  initialBalance: z
    .number()
    .min(0, "Initial balance cannot be negative")
    .optional()
    .default(0),
});

export const updateAccountSchema = z.object({
  name: z
    .string()
    .min(1, "Account name cannot be empty")
    .trim()
    .optional(),
  currency: z
    .string()
    .length(3, "Currency code must be 3 characters")
    .regex(/^[a-zA-Z]{3}$/, "Currency must be 3 letters")
    .optional(),
  initialBalance: z
    .number()
    .min(0, "Initial balance cannot be negative")
    .optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "No update data provided", path: [] }
);

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;