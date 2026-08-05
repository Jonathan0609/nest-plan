import type { Product } from "@/types/product";

const PRODUCTS_STORAGE_KEY = "nestplan:products:v1";
const BUDGET_STORAGE_KEY = "nestplan:budget:v1";

const isProduct = (value: unknown): value is Product => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const product = value as Partial<Product>;
  return (
    typeof product.id === "string" &&
    typeof product.name === "string" &&
    typeof product.price === "number" &&
    typeof product.quantity === "number" &&
    typeof product.room === "string" &&
    typeof product.status === "string"
  );
};

export const readProducts = (): Product[] | null => {
  const storedValue = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
  if (!storedValue) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(storedValue);
    return Array.isArray(parsed) && parsed.every(isProduct) ? parsed : null;
  } catch {
    return null;
  }
};

export const writeProducts = (products: Product[]) => {
  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
};

export const readBudget = (fallback: number) => {
  const storedValue = window.localStorage.getItem(BUDGET_STORAGE_KEY);
  const parsedValue = Number(storedValue);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
};

export const writeBudget = (budget: number) => {
  window.localStorage.setItem(BUDGET_STORAGE_KEY, String(budget));
};
