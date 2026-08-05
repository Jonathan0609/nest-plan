export const ROOM_OPTIONS = [
  "Casa toda",
  "Sala",
  "Cozinha",
  "Quarto",
  "Banheiro",
  "Escritório",
  "Lavanderia",
  "Área externa",
] as const;

export const CATEGORY_OPTIONS = [
  "Móveis",
  "Eletrodomésticos",
  "Iluminação",
  "Revestimentos",
  "Materiais",
  "Decoração",
  "Outros",
] as const;

export const PRIORITY_OPTIONS = ["Alta", "Média", "Baixa"] as const;

export const STATUS_OPTIONS = [
  "Pesquisando",
  "Planejado",
  "Pronto para comprar",
  "Comprado",
] as const;

export type Room = (typeof ROOM_OPTIONS)[number];
export type Category = (typeof CATEGORY_OPTIONS)[number];
export type Priority = (typeof PRIORITY_OPTIONS)[number];
export type ProductStatus = (typeof STATUS_OPTIONS)[number];

export interface Product {
  id: string;
  name: string;
  description: string;
  room: Room;
  category: Category;
  priority: Priority;
  status: ProductStatus;
  price: number;
  quantity: number;
  store: string;
  productUrl: string;
  imageUrl: string;
  purchaseDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductDraft = Omit<Product, "id" | "createdAt" | "updatedAt">;
