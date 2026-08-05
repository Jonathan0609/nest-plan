"use client";

import {
  AppShell,
  AppShellMain,
  AppShellNavbar,
  Box,
  Button,
  Container,
  Group,
  Modal,
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
import { notifications } from "@mantine/notifications";
import {
  IconAdjustmentsHorizontal,
  IconArrowsSort,
  IconPackage,
  IconSearch,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/use-products";
import type { Product, ProductDraft, Room } from "@/types/product";
import { ROOM_OPTIONS } from "@/types/product";
import { ProductCard } from "../products/Card";
import { ProductDetailsDrawer } from "../products/Drawer";
import { ProductForm } from "../products/Form";
import { BudgetOverview } from "./budget-overview";
import { PageHeader } from "./page-header";
import { Sidebar } from "./sidebar";
import { SummaryCards } from "./summary-cards";

type StatusTab = "all" | "pending" | "purchased";
type SortOption = "recent" | "price-high" | "price-low" | "purchase-date";

const sortOptions = [
  { value: "recent", label: "Mais recentes" },
  { value: "price-high", label: "Maior valor" },
  { value: "price-low", label: "Menor valor" },
  { value: "purchase-date", label: "Data de compra" },
];

export function Dashboard() {
  const {
    products,
    budget,
    totals,
    isReady,
    addProduct,
    updateProduct,
    deleteProduct,
    togglePurchased,
    setBudget,
  } = useProducts();

  const [selectedRoom, setSelectedRoom] = useState<Room | "Todos">("Todos");
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

  const handleFormSubmit = (draft: ProductDraft) => {
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, draft);
        notifications.show({
          title: "Produto atualizado",
          message: "As alterações já foram salvas neste dispositivo.",
          color: "teal",
        });
      } else {
        addProduct(draft);
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
      deleteProduct(productToDelete.id);
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
      togglePurchased(product.id);
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

  return (
    <AppShell
      navbar={{ width: 250, breakpoint: "lg", collapsed: { mobile: true } }}
      padding={0}
      styles={{ main: { background: "transparent" } }}
    >
      <AppShellNavbar withBorder={false}>
        <Sidebar products={products} selectedRoom={selectedRoom} onRoomChange={setSelectedRoom} />
      </AppShellNavbar>

      <AppShellMain>
        <Container size={1500} px={{ base: "md", sm: "lg", lg: 32 }} py={{ base: "lg", lg: 32 }}>
          <Stack gap="lg">
            <PageHeader
              products={products}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
              onAddProduct={openCreateForm}
            />

            <SummaryCards totals={totals} budget={budget} purchasedCount={purchasedCount} />

            <BudgetOverview
              products={products}
              budget={budget}
              planned={totals.planned}
              onBudgetChange={setBudget}
            />

            <Box component="section">
              <Group mb="md" justify="space-between" align="flex-end">
                <div>
                  <Title order={2} size="h4" c="#16261f" style={{ letterSpacing: "-0.025em" }}>
                    Produtos planejados
                  </Title>
                  <Text size="xs" c="dimmed">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "resultado" : "resultados"}
                  </Text>
                </div>

                <Group gap="xs" align="center">
                  <SegmentedControl
                    value={statusTab}
                    onChange={(value) => setStatusTab(value as StatusTab)}
                    data={[
                      { value: "all", label: `Todos ${products.length}` },
                      { value: "pending", label: `Pendentes ${pendingCount}` },
                      { value: "purchased", label: `Comprados ${purchasedCount}` },
                    ]}
                    bg="#ebe6de"
                    size="xs"
                  />

                  <TextInput
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                    placeholder="Buscar produto..."
                    leftSection={<IconSearch size={17} />}
                    w={{ base: "100%", sm: 220 }}
                  />
                  <Select
                    value={selectedRoom}
                    onChange={(value) => value && setSelectedRoom(value as Room | "Todos")}
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
                    value={sortBy}
                    onChange={(value) => value && setSortBy(value as SortOption)}
                    data={sortOptions}
                    leftSection={<IconArrowsSort size={16} />}
                    allowDeselect={false}
                    aria-label="Ordenar produtos"
                    w={{ base: "100%", sm: 170 }}
                  />
                </Group>
              </Group>

              {!isReady ? (
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
                  {["first", "second", "third", "fourth"].map((placeholder) => (
                    <Skeleton key={placeholder} h={350} radius="lg" />
                  ))}
                </SimpleGrid>
              ) : filteredProducts.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onView={(selectedProduct) => {
                        setViewedProduct(selectedProduct);
                        setDetailsOpen(true);
                      }}
                      onEdit={openEditForm}
                      onDelete={setProductToDelete}
                      onTogglePurchased={handleTogglePurchased}
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
                    <ThemeIcon
                      size={50}
                      radius="lg"
                      color="#98775f"
                      style={{ background: "#efe8de" }}
                    >
                      <IconPackage size={22} />
                    </ThemeIcon>
                    <Title order={3} size="h5" c="#203229">
                      Nenhum produto por aqui
                    </Title>
                    <Text size="sm" c="dimmed">
                      Ajuste os filtros ou adicione o primeiro item deste ambiente.
                    </Text>
                    <Button mt="xs" variant="default" onClick={openCreateForm}>
                      Adicionar produto
                    </Button>
                  </Stack>
                </Paper>
              )}
            </Box>
          </Stack>
        </Container>
      </AppShellMain>

      <Modal
        opened={formOpen}
        onClose={closeForm}
        title={editingProduct ? "Editar produto" : "Adicionar produto"}
        size="xl"
        centered
        overlayProps={{ backgroundOpacity: 0.45, blur: 2 }}
      >
        {formOpen ? (
          <ProductForm
            key={editingProduct?.id ?? "new-product"}
            product={editingProduct ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={closeForm}
          />
        ) : null}
      </Modal>

      <ProductDetailsDrawer
        product={viewedProduct}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={openEditForm}
      />

      <Modal
        opened={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        title="Excluir este produto?"
        centered
        size="sm"
      >
        <Stack>
          <Text size="sm" c="dimmed">
            “{productToDelete?.name}” será removido do planejamento salvo neste dispositivo.
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setProductToDelete(null)}>
              Cancelar
            </Button>
            <Button color="red" onClick={handleDelete}>
              Excluir produto
            </Button>
          </Group>
        </Stack>
      </Modal>
    </AppShell>
  );
}
