import { Drawer } from "@mantine/core";
import { ProductForm } from "@/components/products/Form";
import type { Product, ProductDraft } from "@/types/product";

interface ProductFormDrawerProps {
  opened: boolean;
  product: Product | null;
  onClose: () => void;
  onSubmit: (draft: ProductDraft) => boolean;
}

export function ProductFormDrawer({ opened, product, onClose, onSubmit }: ProductFormDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={product ? "Editar produto" : "Adicionar produto"}
      position="right"
      size="xl"
      overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
    >
      {opened ? (
        <ProductForm
          key={product?.id ?? "new-product"}
          product={product ?? undefined}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      ) : null}
    </Drawer>
  );
}
