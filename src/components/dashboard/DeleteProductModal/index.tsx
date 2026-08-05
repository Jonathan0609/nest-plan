import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import type { Product } from "@/types/product";

interface DeleteProductModalProps {
  product: Product | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteProductModal({ product, onCancel, onConfirm }: DeleteProductModalProps) {
  return (
    <Modal
      opened={Boolean(product)}
      onClose={onCancel}
      title="Excluir este produto?"
      centered
      size="sm"
    >
      <Stack>
        <Text size="sm" c="dimmed">
          “{product?.name}” será removido do planejamento salvo neste dispositivo.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel}>
            Cancelar
          </Button>
          <Button color="red" onClick={onConfirm}>
            Excluir produto
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
