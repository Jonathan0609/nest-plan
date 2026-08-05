"use client";

import {
  ActionIcon,
  Button,
  Drawer,
  Grid,
  GridCol,
  Group,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconPlus } from "@tabler/icons-react";
import { Navbar } from "@/components/layout/AppLayoutContent/Navbar";
import type { Product, Room } from "@/types/product";

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
      <Grid align="center" gap="md">
        <GridCol span={{ base: 12, sm: "content" }} mr="auto">
          <Group wrap="nowrap" gap="sm">
            <ActionIcon
              hiddenFrom="lg"
              variant="default"
              size="lg"
              aria-label="Abrir menu"
              onClick={openMenu}
            >
              <IconMenu2 size={19} />
            </ActionIcon>

            <Stack gap={4}>
              <Text size="xs" fw={700} tt="uppercase" c="#bf7047" lts="0.16em">
                Planejamento da casa
              </Text>

              <Title order={1} fz={{ base: 25, sm: 32 }} c="#16261f" lh={1}>
                {selectedRoom === "Todos" ? "Tudo para o seu novo lar" : selectedRoom}
              </Title>

              <Text size="sm" c="dimmed" fw={680} lh={1}>
                Organize decisões, compare valores e compre no momento certo.
              </Text>
            </Stack>
          </Group>
        </GridCol>

        <GridCol span={{ base: 12, sm: "content" }}>
          <Button
            onClick={onAddProduct}
            leftSection={<IconPlus size={18} />}
            style={{ boxShadow: "0 8px 24px rgba(232, 135, 83, 0.25)" }}
            fullWidth
          >
            Adicionar produto
          </Button>
        </GridCol>
      </Grid>

      <Drawer
        opened={menuOpen}
        onClose={closeMenu}
        title="Menu principal"
        size={280}
        padding={0}
        styles={{
          header: { background: "#16261f", color: "white", padding: 10 },
          body: { height: "calc(100% - 60px)", background: "#16261f" },
        }}
      >
        <Navbar
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
