import z from "zod";
import { productImageUrlSchema } from "@/lib/form-schemas";
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  type ProductDraft,
  ROOM_OPTIONS,
  STATUS_OPTIONS,
} from "@/types/product";

export const productInitialValues: ProductDraft = {
  name: "",
  description: "",
  room: "Sala",
  category: "Móveis",
  priority: "Média",
  status: "Planejado",
  price: 0,
  quantity: 1,
  store: "",
  productUrl: "",
  imageUrl: "",
  purchaseDate: "",
  notes: "",
};

const numericInputSchema = z.union([z.number(), z.string()]);

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

export const productFormSchema = z.object({
  name: z.string().trim().min(1, { error: "Informe o nome do produto." }),
  description: z.string(),
  room: z.enum(ROOM_OPTIONS),
  category: z.enum(CATEGORY_OPTIONS),
  priority: z.enum(PRIORITY_OPTIONS),
  status: z.enum(STATUS_OPTIONS),
  price: numericInputSchema.refine(
    (value) => String(value).trim() !== "" && Number.isFinite(Number(value)) && Number(value) >= 0,
    { error: "O preço precisa ser maior ou igual a zero." },
  ),
  quantity: numericInputSchema.refine(
    (value) => Number.isInteger(Number(value)) && Number(value) >= 1,
    { error: "A quantidade precisa ser um número inteiro maior ou igual a 1." },
  ),
  store: z.string(),
  productUrl: z
    .string()
    .trim()
    .refine((value) => !value || isHttpUrl(value), {
      error: "Informe uma URL válida.",
    }),
  imageUrl: productImageUrlSchema,
  purchaseDate: z.string().optional(),
  notes: z.string(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
