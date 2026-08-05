"use client";

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Group,
  Menu,
  Text,
} from "@mantine/core";
import {
  IconCalendar,
  IconDots,
  IconExternalLink,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { formatCurrency, getProductTotal, priorityColors, statusColors } from "@/lib/formatters";
import type { Product } from "@/types/product";
import { ProductImage } from "../Image";

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onTogglePurchased: (product: Product) => void;
}

export function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
  onTogglePurchased,
}: ProductCardProps) {
  const isPurchased = product.status === "Comprado";

  return (
    <Card
      withBorder
      radius="lg"
      padding="md"
      style={{
        borderColor: "#e8e2d8",
        overflow: "hidden",
        transition: "transform 160ms ease, box-shadow 160ms ease",
      }}
    >
      <Card.Section>
        <ProductImage
          name={product.name}
          category={product.category}
          imageUrl={product.imageUrl}
          height={144}
        />
      </Card.Section>

      <Group mt="md" align="flex-start" justify="space-between" wrap="nowrap" gap="xs">
        <Box style={{ minWidth: 0 }}>
          <Group gap={6} mb="xs">
            <Badge variant="light" color={statusColors[product.status]} size="sm">
              {product.status}
            </Badge>
            <Badge variant="light" color={priorityColors[product.priority]} size="sm">
              {product.priority}
            </Badge>
          </Group>
          <Text fw={600} c="#203229" truncate style={{ letterSpacing: "-0.02em" }}>
            {product.name}
          </Text>
          <Text mt={4} size="xs" c="dimmed" truncate>
            {product.room} · {product.store || "Loja não informada"}
          </Text>
        </Box>

        <Menu position="bottom-end" shadow="md" width={180}>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" aria-label={`Opções de ${product.name}`}>
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconPencil size={16} />} onClick={() => onEdit(product)}>
              Editar
            </Menu.Item>
            {product.productUrl ? (
              <Menu.Item
                leftSection={<IconExternalLink size={16} />}
                onClick={() => window.open(product.productUrl, "_blank", "noopener,noreferrer")}
              >
                Abrir link
              </Menu.Item>
            ) : null}
            <Menu.Divider />
            <Menu.Item
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={() => onDelete(product)}
            >
              Excluir
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Group mt="lg" align="flex-end" justify="space-between" wrap="nowrap">
        <div>
          <Text fz="lg" fw={600} c="#16261f" style={{ letterSpacing: "-0.03em" }}>
            {formatCurrency(getProductTotal(product.price, product.quantity))}
          </Text>
          {product.quantity > 1 ? (
            <Text size="xs" c="dimmed">
              {product.quantity} × {formatCurrency(product.price)}
            </Text>
          ) : null}
        </div>

        <Group gap={5} wrap="nowrap" c="dimmed">
          <IconCalendar size={15} />

          <Text size="xs">
            {product.purchaseDate
              ? dayjs(product.purchaseDate).format("DD/MM/YYYY")
              : "Não informada"}
          </Text>
        </Group>
      </Group>

      <Divider my="md" color="#eee8df" />

      <Group justify="space-between" wrap="nowrap">
        <Checkbox
          id={`purchased-${product.id}`}
          checked={isPurchased}
          onChange={() => onTogglePurchased(product)}
          label={isPurchased ? "Comprado" : "Marcar como comprado"}
          size="sm"
          styles={{
            label: {
              fontSize: "var(--mantine-font-size-xs)",
              color: "var(--mantine-color-dimmed)",
            },
          }}
        />
        <Button variant="subtle" size="compact-sm" onClick={() => onView(product)}>
          Ver detalhes
        </Button>
      </Group>
    </Card>
  );
}
