import type { Priority, ProductStatus } from "@/types/product";

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatShortDate = (value: string) => {
  if (!value) {
    return "Sem data";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
};

export const getProductTotal = (price: number, quantity: number) => price * quantity;

export const priorityColors: Record<Priority, string> = {
  Alta: "red",
  Média: "yellow",
  Baixa: "gray",
};

export const statusColors: Record<ProductStatus, string> = {
  Pesquisando: "violet",
  Planejado: "blue",
  "Pronto para comprar": "yellow",
  Comprado: "teal",
};
