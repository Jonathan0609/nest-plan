"use client";

import { ActionIcon, Button, Drawer, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconPlus } from "@tabler/icons-react";
import type { Product, Room } from "@/types/product";
import { Sidebar } from "./sidebar";

interface PageHeaderProps {
  products: Product[];
  selectedRoom: Room | "Todos";
  onRoomChange: (room: Room | "Todos") => void;
  onAddProduct: () => void;
}

export function PageHeader({
  products,
  selectedRoom,
  onRoomChange,
  onAddProduct,
}: PageHeaderProps) {
  const [menuOpen, { open: openMenu, close: closeMenu }] = useDisclosure(false);

  return (
    <>
      <Group component="header" justify="space-between" align="flex-start" wrap="nowrap" gap="md">
        <Group align="flex-start" wrap="nowrap" gap="sm">
          <ActionIcon
            hiddenFrom="lg"
            variant="default"
            size="lg"
            mt={3}
            aria-label="Abrir menu"
            onClick={openMenu}
          >
            <IconMenu2 size={19} />
          </ActionIcon>
          <Stack gap={4}>
            <Text size="xs" fw={700} tt="uppercase" c="#bf7047" lts="0.16em">
              Planejamento da casa
            </Text>
            <Title
              order={1}
              fz={{ base: 25, sm: 32 }}
              c="#16261f"
              style={{ letterSpacing: "-0.035em" }}
            >
              {selectedRoom === "Todos" ? "Tudo para o seu novo lar" : selectedRoom}
            </Title>
            <Text size="sm" c="dimmed" maw={680}>
              Organize decisões, compare valores e compre no momento certo.
            </Text>
          </Stack>
        </Group>

        <ActionIcon
          hiddenFrom="sm"
          size="lg"
          aria-label="Adicionar produto"
          onClick={onAddProduct}
          style={{ boxShadow: "0 8px 24px rgba(232, 135, 83, 0.25)" }}
        >
          <IconPlus size={20} />
        </ActionIcon>
        <Button
          visibleFrom="sm"
          onClick={onAddProduct}
          leftSection={<IconPlus size={18} />}
          style={{ boxShadow: "0 8px 24px rgba(232, 135, 83, 0.25)" }}
        >
          Adicionar produto
        </Button>
      </Group>

      <Drawer
        opened={menuOpen}
        onClose={closeMenu}
        title="Menu principal"
        size={280}
        padding={0}
        styles={{
          header: { background: "#16261f", color: "white" },
          body: { height: "calc(100% - 60px)", background: "#16261f" },
        }}
      >
        <Sidebar
          products={products}
          selectedRoom={selectedRoom}
          onRoomChange={(room) => {
            onRoomChange(room);
            closeMenu();
          }}
        />
      </Drawer>
    </>
  );
}
