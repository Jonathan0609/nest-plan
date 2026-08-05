"use client";

import {
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import {
  IconBuildingStore,
  IconCalendar,
  IconExternalLink,
  IconMapPin,
  IconPackage,
  IconPencil,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { formatCurrency, getProductTotal, priorityColors, statusColors } from "@/lib/formatters";
import type { Product } from "@/types/product";
import { ProductImage } from "../Image";

interface ProductDetailsProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
}

export function ProductDetailsDrawer({ product, open, onOpenChange, onEdit }: ProductDetailsProps) {
  if (!product) {
    return null;
  }

  const details = [
    { label: "Ambiente", value: product.room, icon: IconMapPin },
    { label: "Categoria", value: product.category, icon: IconPackage },
    { label: "Loja", value: product.store || "Não informada", icon: IconBuildingStore },
    {
      label: "Data desejada",
      value: dayjs(product.purchaseDate).format("DD/MM/YYYY"),
      icon: IconCalendar,
    },
  ];

  return (
    <Drawer
      opened={open}
      onClose={() => onOpenChange(false)}
      position="right"
      size="md"
      title="Detalhes do produto"
      padding={0}
      styles={{ body: { padding: 0 } }}
    >
      <ProductImage
        name={product.name}
        category={product.category}
        imageUrl={product.imageUrl}
        height={224}
      />

      <Stack p="lg" gap="lg">
        <div>
          <Group gap="xs">
            <Badge variant="light" color={statusColors[product.status]}>
              {product.status}
            </Badge>
            <Badge variant="light" color={priorityColors[product.priority]}>
              Prioridade {product.priority.toLowerCase()}
            </Badge>
          </Group>
          <Title order={2} mt="sm" c="#16261f" style={{ letterSpacing: "-0.035em" }}>
            {product.name}
          </Title>
          <Text mt={6} size="sm" c="dimmed" lh={1.6}>
            {product.description || "Nenhuma descrição adicionada."}
          </Text>
        </div>

        <Paper radius="lg" p="md" bg="#f7f3ed">
          <Text size="xs" c="dimmed">
            Valor estimado
          </Text>
          <Text mt={3} fz={26} fw={600} c="#16261f" style={{ letterSpacing: "-0.04em" }}>
            {formatCurrency(getProductTotal(product.price, product.quantity))}
          </Text>
          <Text mt={3} size="xs" c="dimmed">
            {product.quantity} {product.quantity === 1 ? "unidade" : "unidades"} ·{" "}
            {formatCurrency(product.price)} cada
          </Text>
        </Paper>

        <SimpleGrid component="dl" cols={2} spacing="lg" m={0}>
          {details.map((detail) => (
            <Box key={detail.label}>
              <Group component="dt" gap={5} c="dimmed">
                <detail.icon size={15} />
                <Text size="xs">{detail.label}</Text>
              </Group>
              <Text component="dd" m={0} mt={6} size="sm" fw={600} c="#33433c">
                {detail.value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {product.notes ? (
          <>
            <Divider />
            <div>
              <Text size="xs" fw={600} tt="uppercase" c="dimmed" lts="0.12em">
                Observações
              </Text>
              <Text mt="xs" size="sm" c="#4c5b54" lh={1.6}>
                {product.notes}
              </Text>
            </div>
          </>
        ) : null}

        <Group grow>
          <Button
            variant="default"
            leftSection={<IconPencil size={17} />}
            onClick={() => onEdit(product)}
          >
            Editar
          </Button>
          {product.productUrl ? (
            <Button
              component="a"
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              leftSection={<IconExternalLink size={17} />}
            >
              Ver na loja
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Drawer>
  );
}
