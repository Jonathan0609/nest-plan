"use client";

import {
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { schemaResolver, useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPencil, IconTrendingUp } from "@tabler/icons-react";
import { useMemo } from "react";
import { type BudgetFormValues, budgetFormSchema } from "@/lib/form-schemas";
import { formatCurrency } from "@/lib/formatters";
import type { Product } from "@/types/product";

interface BudgetOverviewProps {
  products: Product[];
  budget: number;
  planned: number;
  onBudgetChange: (value: number) => void;
}

const roomColors = ["#e88753", "#78a38f", "#d2a959", "#8f91b8"];

export function BudgetOverview({ products, budget, planned, onBudgetChange }: BudgetOverviewProps) {
  const [dialogOpen, { open: openDialog, close: closeDialog }] = useDisclosure(false);
  const form = useForm<BudgetFormValues>({
    mode: "controlled",
    initialValues: { budget },
    validate: schemaResolver(budgetFormSchema, { sync: true }),
  });
  const usagePercent = Math.min((planned / Math.max(budget, 1)) * 100, 100);

  const roomTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const product of products) {
      totals.set(product.room, (totals.get(product.room) ?? 0) + product.price * product.quantity);
    }

    return Array.from(totals.entries())
      .sort(([, first], [, second]) => second - first)
      .slice(0, 4);
  }, [products]);

  const handleOpen = () => {
    form.setValues({ budget });
    form.clearErrors();
    openDialog();
  };

  const handleSave = ({ budget: nextBudget }: BudgetFormValues) => {
    onBudgetChange(Number(nextBudget));
    closeDialog();
  };

  return (
    <>
      <Paper withBorder radius="lg" style={{ borderColor: "#e8e2d8", overflow: "hidden" }}>
        <Group
          justify="space-between"
          align="flex-start"
          wrap="nowrap"
          p="lg"
          style={{ borderBottom: "1px solid #eee8df" }}
        >
          <Box style={{ minWidth: 0, flex: 1 }}>
            <Title order={2} size="h5" c="#16261f">
              Orçamento da casa
            </Title>
            <Text mt={4} size="xs" c="dimmed">
              Distribuição do valor planejado por ambiente
            </Text>
          </Box>
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            leftSection={<IconPencil size={15} />}
            onClick={handleOpen}
          >
            Editar
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" p="lg">
          <Paper radius="lg" p="lg" bg="#16261f" c="white">
            <Group justify="space-between">
              <Text size="xs" c="rgba(255,255,255,0.58)">
                Comprometido
              </Text>

              <IconTrendingUp size={18} color="#f2a46f" />
            </Group>

            <Text mt="sm" fz={26} fw={600} style={{ letterSpacing: "-0.04em" }}>
              {formatCurrency(planned)}
            </Text>

            <Text mt={3} size="xs" c="rgba(255,255,255,0.48)">
              de {formatCurrency(budget)} disponíveis
            </Text>

            <Progress
              mt="lg"
              value={usagePercent}
              color="#f2a46f"
              bg="rgba(255,255,255,0.1)"
              radius="xl"
            />

            <Text mt={7} size="xs" ta="right" c="rgba(255,255,255,0.48)">
              {Math.round(usagePercent)}% utilizado
            </Text>
          </Paper>

          <Stack gap="md" justify="center">
            {roomTotals.length === 0 ? (
              <Text size="sm" c="dimmed">
                Adicione produtos para ver a distribuição.
              </Text>
            ) : (
              roomTotals.map(([room, total], index) => {
                const percent = Math.min((total / Math.max(planned, 1)) * 100, 100);
                return (
                  <Box key={room}>
                    <Group mb={6} justify="space-between">
                      <Text size="xs" fw={600} c="#33433c">
                        {room}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {formatCurrency(total)}
                      </Text>
                    </Group>
                    <Progress
                      value={percent}
                      color={roomColors[index]}
                      bg="#f0ece5"
                      radius="xl"
                      size="sm"
                    />
                  </Box>
                );
              })
            )}
          </Stack>
        </SimpleGrid>
      </Paper>

      <Modal opened={dialogOpen} onClose={closeDialog} title="Definir orçamento" centered size="sm">
        <form onSubmit={form.onSubmit(handleSave)}>
          <Stack>
            <Text size="sm" c="dimmed">
              Informe o valor total reservado para compras da casa.
            </Text>
            <NumberInput
              label="Valor em reais"
              min={1}
              step={100}
              decimalScale={2}
              prefix="R$ "
              autoFocus
              {...form.getInputProps("budget")}
            />
            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button type="submit">Salvar orçamento</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
