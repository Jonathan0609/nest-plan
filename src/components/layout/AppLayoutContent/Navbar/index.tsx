import { Box, Group, Image, NavLink, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import {
  IconArmchair,
  IconBath,
  IconBed,
  IconBriefcase,
  IconChefHat,
  IconHome,
  IconLayoutDashboard,
  IconSparkles,
  IconTrees,
  IconWashMachine,
} from "@tabler/icons-react";
import type { Product, Room } from "@/types/product";

const roomIcons: Record<Room, typeof IconHome> = {
  "Casa toda": IconHome,
  Sala: IconArmchair,
  Cozinha: IconChefHat,
  Quarto: IconBed,
  Banheiro: IconBath,
  Escritório: IconBriefcase,
  Lavanderia: IconWashMachine,
  "Área externa": IconTrees,
};

interface NavbarProps {
  products: Product[];
  selectedRoom: Room | "Todos";
  onRoomChange: (room: Room | "Todos") => void;
}

const navigationStyles = (active: boolean) => ({
  root: {
    borderRadius: 12,
    color: active ? "#ffffff" : "rgba(255, 255, 255, 0.68)",
    background: active ? "rgba(255, 255, 255, 0.1)" : "transparent",
  },
  label: { color: "inherit", fontWeight: active ? 600 : 400 },
  section: { color: "inherit" },
});

export function Navbar({ products, selectedRoom, onRoomChange }: NavbarProps) {
  const rooms = Array.from(new Set(products.map((product) => product.room)));

  return (
    <Box component="aside" h="100%" bg="#16261f" c="white" style={{ overflowY: "auto" }}>
      <Group h={80} px="lg" gap="sm" wrap="nowrap">
        <Image
          src="/nestplan-logo.png"
          alt="Logo do NestPlan"
          w={42}
          h={42}
          radius="lg"
          fit="cover"
        />

        <Stack gap={4}>
          <Text fw={600} lh={1}>
            NestPlan
          </Text>
          <Text size="xs" c="rgba(255, 255, 255, 0.5)">
            Reforma sem improviso
          </Text>
        </Stack>
      </Group>

      <Stack gap="xs" px="sm" mt="lg">
        <Text px="sm" size="10px" fw={700} tt="uppercase" c="dimmed" lts="0.18em">
          Planejamento
        </Text>

        <NavLink
          label="Visão geral"
          leftSection={<IconLayoutDashboard size={18} />}
          rightSection={<Text size="xs">{products.length}</Text>}
          active={selectedRoom === "Todos"}
          onClick={() => onRoomChange("Todos")}
          styles={navigationStyles(selectedRoom === "Todos")}
        />
      </Stack>

      <Stack gap="xs" px="sm" mt="xl">
        <Text
          px="sm"
          size="10px"
          fw={700}
          tt="uppercase"
          c="rgba(255, 255, 255, 0.38)"
          lts="0.18em"
        >
          Ambientes
        </Text>

        {rooms.map((room) => {
          const Icon = roomIcons[room];
          const count = products.filter((product) => product.room === room).length;
          const active = selectedRoom === room;

          return (
            <NavLink
              key={room}
              label={room}
              leftSection={<Icon size={18} />}
              rightSection={<Text size="xs">{count}</Text>}
              active={active}
              onClick={() => onRoomChange(room)}
              styles={navigationStyles(active)}
            />
          );
        })}
      </Stack>

      <Box p="md" mt="xl">
        <Paper
          p="md"
          radius="lg"
          bg="rgba(255, 255, 255, 0.06)"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <ThemeIcon mb="sm" radius="md" color="terracotta" variant="light">
            <IconSparkles size={17} />
          </ThemeIcon>
          <Text size="sm" fw={600}>
            Tudo fica neste dispositivo
          </Text>
          <Text mt={5} size="xs" c="rgba(255, 255, 255, 0.48)" lh={1.55}>
            Seus produtos são salvos localmente e poderão migrar para a API depois.
          </Text>
        </Paper>
      </Box>
    </Box>
  );
}
