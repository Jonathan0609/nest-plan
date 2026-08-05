"use client";

import { notifications } from "@mantine/notifications";
import { useMemo, useState } from "react";
import { useAppLayout } from "@/hooks/use-app-layout";
import type { Product, ProductDraft } from "@/types/product";

export type StatusTab = "all" | "pending" | "purchased";
export type SortOption = "recent" | "price-high" | "price-low" | "purchase-date";

export function useDashboard() {
  const productStore = useAppLayout();
  const { products, selectedRoom } = productStore;
  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewedProduct, setViewedProduct] = useState<Product | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const purchasedCount = products.filter((product) => product.status === "Comprado").length;
  const pendingCount = products.length - purchasedCount;

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
    const matchingProducts = products.filter((product) => {
      const matchesRoom = selectedRoom === "Todos" || product.room === selectedRoom;
      const matchesStatus =
        statusTab === "all" ||
        (statusTab === "purchased" && product.status === "Comprado") ||
        (statusTab === "pending" && product.status !== "Comprado");
      const matchesSearch =
        !normalizedSearch ||
        [product.name, product.description, product.store, product.category].some((value) =>
          value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
        );

      return matchesRoom && matchesStatus && matchesSearch;
    });

    return matchingProducts.toSorted((first, second) => {
      if (sortBy === "price-high") {
        return second.price * second.quantity - first.price * first.quantity;
      }
      if (sortBy === "price-low") {
        return first.price * first.quantity - second.price * second.quantity;
      }
      if (sortBy === "purchase-date") {
        return (first.purchaseDate || "9999").localeCompare(second.purchaseDate || "9999");
      }
      return second.updatedAt.localeCompare(first.updatedAt);
    });
  }, [products, search, selectedRoom, sortBy, statusTab]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setDetailsOpen(false);
    setEditingProduct(product);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProduct(null);
  };

  const openDetails = (product: Product) => {
    setViewedProduct(product);
    setDetailsOpen(true);
  };

  const handleFormSubmit = (draft: ProductDraft) => {
    try {
      if (editingProduct) {
        productStore.updateProduct(editingProduct.id, draft);
        notifications.show({
          title: "Produto atualizado",
          message: "As alterações já foram salvas neste dispositivo.",
          color: "teal",
        });
      } else {
        productStore.addProduct(draft);
        notifications.show({
          title: "Produto adicionado",
          message: "Ele já aparece no seu planejamento.",
          color: "teal",
        });
      }
      closeForm();
      return true;
    } catch {
      notifications.show({
        title: "Não foi possível salvar",
        message: "O armazenamento local pode estar cheio. Tente uma imagem menor.",
        color: "red",
      });
      return false;
    }
  };

  const handleDelete = () => {
    if (!productToDelete) {
      return;
    }

    try {
      productStore.deleteProduct(productToDelete.id);
      notifications.show({
        title: "Produto removido",
        message: "O item saiu do planejamento.",
        color: "teal",
      });
      setProductToDelete(null);
    } catch {
      notifications.show({
        title: "Não foi possível remover",
        message: "Tente novamente.",
        color: "red",
      });
    }
  };

  const handleTogglePurchased = (product: Product) => {
    try {
      productStore.togglePurchased(product.id);
      notifications.show({
        title:
          product.status === "Comprado" ? "Produto voltou ao planejamento" : "Compra concluída",
        message: "A alteração foi salva neste dispositivo.",
        color: "teal",
      });
    } catch {
      notifications.show({
        title: "Não foi possível atualizar",
        message: "Tente novamente.",
        color: "red",
      });
    }
  };

  return {
    ...productStore,
    purchasedCount,
    pendingCount,
    filteredProducts,
    statusTab,
    onStatusChange: setStatusTab,
    sortBy,
    onSortChange: setSortBy,
    search,
    onSearchChange: setSearch,
    formOpen,
    editingProduct,
    onCreateProduct: openCreateForm,
    onEditProduct: openEditForm,
    onCloseForm: closeForm,
    onFormSubmit: handleFormSubmit,
    viewedProduct,
    detailsOpen,
    onDetailsOpenChange: setDetailsOpen,
    onViewProduct: openDetails,
    productToDelete,
    onRequestDelete: setProductToDelete,
    onCancelDelete: () => setProductToDelete(null),
    onConfirmDelete: handleDelete,
    onTogglePurchased: handleTogglePurchased,
  };
}
