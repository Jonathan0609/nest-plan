"use client";

import { Stack } from "@mantine/core";
import { ProductDetailsDrawer } from "@/components/products/Drawer";
import { useDashboard } from "@/hooks/use-dashboard";
import { BudgetOverview } from "./BudgetOverview";
import { DeleteProductModal } from "./DeleteProductModal";
import { PageHeader } from "./PageHeader";
import { ProductFormDrawer } from "./ProductFormDrawer";
import { ProductsSection } from "./ProductsSection";
import { SummaryCards } from "./SummaryCards";

export function Dashboard() {
  const dashboard = useDashboard();

  return (
    <>
      <Stack gap="lg">
        <PageHeader
          products={dashboard.products}
          selectedRoom={dashboard.selectedRoom}
          onRoomChange={dashboard.onRoomChange}
          onAddProduct={dashboard.onCreateProduct}
        />

        <SummaryCards
          totals={dashboard.totals}
          budget={dashboard.budget}
          purchasedCount={dashboard.purchasedCount}
        />

        <BudgetOverview
          products={dashboard.products}
          budget={dashboard.budget}
          planned={dashboard.totals.planned}
          onBudgetChange={dashboard.setBudget}
        />

        <ProductsSection
          products={dashboard.products}
          filteredProducts={dashboard.filteredProducts}
          isReady={dashboard.isReady}
          pendingCount={dashboard.pendingCount}
          purchasedCount={dashboard.purchasedCount}
          selectedRoom={dashboard.selectedRoom}
          statusTab={dashboard.statusTab}
          sortBy={dashboard.sortBy}
          search={dashboard.search}
          onRoomChange={dashboard.onRoomChange}
          onStatusChange={dashboard.onStatusChange}
          onSortChange={dashboard.onSortChange}
          onSearchChange={dashboard.onSearchChange}
          onCreateProduct={dashboard.onCreateProduct}
          onViewProduct={dashboard.onViewProduct}
          onEditProduct={dashboard.onEditProduct}
          onRequestDelete={dashboard.onRequestDelete}
          onTogglePurchased={dashboard.onTogglePurchased}
        />
      </Stack>

      <ProductFormDrawer
        opened={dashboard.formOpen}
        product={dashboard.editingProduct}
        onClose={dashboard.onCloseForm}
        onSubmit={dashboard.onFormSubmit}
      />

      <ProductDetailsDrawer
        product={dashboard.viewedProduct}
        open={dashboard.detailsOpen}
        onOpenChange={dashboard.onDetailsOpenChange}
        onEdit={dashboard.onEditProduct}
      />

      <DeleteProductModal
        product={dashboard.productToDelete}
        onCancel={dashboard.onCancelDelete}
        onConfirm={dashboard.onConfirmDelete}
      />
    </>
  );
}
