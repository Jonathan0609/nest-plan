import { createContext, useContext } from "react";
import type { useProducts } from "@/hooks/use-products";
import type { Room } from "@/types/product";

type ProductStore = ReturnType<typeof useProducts>;

export interface AppLayoutState extends ProductStore {
  selectedRoom: Room | "Todos";
  onRoomChange: (room: Room | "Todos") => void;
}

export const AppLayoutContext = createContext<AppLayoutState | null>(null);

export function useAppLayout() {
  const context = useContext(AppLayoutContext);

  if (!context) {
    throw new Error("useAppLayout deve ser usado dentro de AppLayoutContent.");
  }

  return context;
}
