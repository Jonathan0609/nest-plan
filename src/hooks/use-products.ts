"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { readBudget, readProducts, writeBudget, writeProducts } from "@/lib/product-storage";
import type { Product, ProductDraft } from "@/types/product";

const DEFAULT_BUDGET = 45000;

const createProductId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `product-${Date.now()}`;
};

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [budget, setBudgetState] = useState(DEFAULT_BUDGET);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedProducts = readProducts();
    const initialProducts = storedProducts ?? [];

    if (!storedProducts) {
      writeProducts(initialProducts);
    }

    setProducts(initialProducts);
    setBudgetState(readBudget(DEFAULT_BUDGET));
    setIsReady(true);
  }, []);

  const persistProducts = useCallback((nextProducts: Product[]) => {
    writeProducts(nextProducts);
    setProducts(nextProducts);
  }, []);

  const addProduct = useCallback(
    (draft: ProductDraft) => {
      const now = new Date().toISOString();
      const product: Product = {
        ...draft,
        id: createProductId(),
        createdAt: now,
        updatedAt: now,
      };

      persistProducts([product, ...products]);
      return product;
    },
    [persistProducts, products],
  );

  const updateProduct = useCallback(
    (id: string, draft: ProductDraft) => {
      const nextProducts = products.map((product) =>
        product.id === id ? { ...product, ...draft, updatedAt: new Date().toISOString() } : product,
      );
      persistProducts(nextProducts);
    },
    [persistProducts, products],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persistProducts(products.filter((product) => product.id !== id));
    },
    [persistProducts, products],
  );

  const togglePurchased = useCallback(
    (id: string) => {
      const nextProducts = products.map((product) =>
        product.id === id
          ? {
              ...product,
              status:
                product.status === "Comprado" ? ("Planejado" as const) : ("Comprado" as const),
              updatedAt: new Date().toISOString(),
            }
          : product,
      );
      persistProducts(nextProducts);
    },
    [persistProducts, products],
  );

  const setBudget = useCallback((nextBudget: number) => {
    writeBudget(nextBudget);
    setBudgetState(nextBudget);
  }, []);

  const totals = useMemo(() => {
    const planned = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const purchased = products
      .filter((product) => product.status === "Comprado")
      .reduce((sum, product) => sum + product.price * product.quantity, 0);

    return {
      planned,
      purchased,
      remaining: Math.max(budget - planned, 0),
      itemCount: products.reduce((sum, product) => sum + product.quantity, 0),
    };
  }, [budget, products]);

  return {
    products,
    budget,
    totals,
    isReady,
    addProduct,
    updateProduct,
    deleteProduct,
    togglePurchased,
    setBudget,
  };
}
