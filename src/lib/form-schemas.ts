import { z } from "zod/v4";

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const numericInputSchema = z.union([z.number(), z.string()]);

export const productImageUrlSchema = z
  .string()
  .trim()
  .refine((value) => !value || value.startsWith("data:image/") || isHttpUrl(value), {
    error: "Informe uma URL válida.",
  });

export const budgetFormSchema = z.object({
  budget: numericInputSchema.refine(
    (value) => String(value).trim() !== "" && Number.isFinite(Number(value)) && Number(value) > 0,
    { error: "Informe um orçamento maior que zero." },
  ),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
