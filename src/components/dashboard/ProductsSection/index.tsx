import {
  Box,
  Button,
  Group,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsSort,
  IconPackage,
  IconSearch,
} from "@tabler/icons-react";
import { ProductCard } from "@/components/products/Card";
import type { SortOption, StatusTab } from "@/hooks/use-dashboard";
import type { Product, Room } from "@/types/product";
import { ROOM_OPTIONS } from "@/types/product";

interface ProductsSectionProps {
  products: Product[];
  filteredProducts: Product[];
  isReady: boolean;
  pendingCount: number;
  purchasedCount: number;
  selectedRoom: Room | "Todos";
  statusTab: StatusTab;
  sortBy: SortOption;
  search: string;
  onRoomChange: (room: Room | "Todos") => void;
  onStatusChange: (status: StatusTab) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (search: string) => void;
  onCreateProduct: () => void;
  onViewProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
  onTogglePurchased: (product: Product) => void;
}

const sortOptions = [
  { value: "recent", label: "Mais recentes" },
  { value: "price-high", label: "Maior valor" },
  { value: "price-low", label: "Menor valor" },
  { value: "purchase-date", label: "Data de compra" },
];

export function ProductsSection(props: ProductsSectionProps) {
  return (
    <Box component="section">
      <Group mb="md" justify="space-between" align="flex-end">
        <div>
          <Title order={2} size="h4" c="#16261f" style={{ letterSpacing: "-0.025em" }}>
            Produtos planejados
          </Title>

          <Text size="xs" c="dimmed">
            {props.filteredProducts.length}{" "}
            {props.filteredProducts.length === 1 ? "resultado" : "resultados"}
          </Text>
        </div>

        <Group gap="xs" align="center">
          <SegmentedControl
            value={props.statusTab}
            onChange={(value) => props.onStatusChange(value as StatusTab)}
            data={[
              { value: "all", label: `Todos ${props.products.length}` },
              { value: "pending", label: `Pendentes ${props.pendingCount}` },
              { value: "purchased", label: `Comprados ${props.purchasedCount}` },
            ]}
            bg="#ebe6de"
            size="xs"
          />

          <TextInput
            value={props.search}
            onChange={(event) => props.onSearchChange(event.currentTarget.value)}
            placeholder="Buscar produto..."
            leftSection={<IconSearch size={17} />}
            w={{ base: "100%", sm: 220 }}
          />
          <Select
            value={props.selectedRoom}
            onChange={(value) => value && props.onRoomChange(value as Room | "Todos")}
            data={[
              { value: "Todos", label: "Todos os ambientes" },
              ...ROOM_OPTIONS.map((room) => ({ value: room, label: room })),
            ]}
            leftSection={<IconAdjustmentsHorizontal size={16} />}
            allowDeselect={false}
            aria-label="Filtrar ambiente"
            w={{ base: "100%", sm: 180 }}
          />
          <Select
            value={props.sortBy}
            onChange={(value) => value && props.onSortChange(value as SortOption)}
            data={sortOptions}
            leftSection={<IconArrowsSort size={16} />}
            allowDeselect={false}
            aria-label="Ordenar produtos"
            w={{ base: "100%", sm: 170 }}
          />
        </Group>
      </Group>

      {!props.isReady ? (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
          {["first", "second", "third", "fourth"].map((placeholder) => (
            <Skeleton key={placeholder} h={350} radius="lg" />
          ))}
        </SimpleGrid>
      ) : props.filteredProducts.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
          {props.filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={props.onViewProduct}
              onEdit={props.onEditProduct}
              onDelete={props.onRequestDelete}
              onTogglePurchased={props.onTogglePurchased}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Paper
          withBorder
          radius="lg"
          p="xl"
          mih={288}
          bg="rgba(255,255,255,0.55)"
          style={{
            borderStyle: "dashed",
            borderColor: "#dcd3c7",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Stack align="center" gap="xs" ta="center">
            <ThemeIcon size={50} radius="lg" color="#98775f" style={{ background: "#efe8de" }}>
              <IconPackage size={22} />
            </ThemeIcon>
            <Title order={3} size="h5" c="#203229">
              Nenhum produto por aqui
            </Title>
            <Text size="sm" c="dimmed">
              Ajuste os filtros ou adicione o primeiro item deste ambiente.
            </Text>
            <Button mt="xs" variant="default" onClick={props.onCreateProduct}>
              Adicionar produto
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
