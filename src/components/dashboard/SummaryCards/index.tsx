import { Group, Paper, SimpleGrid, Text, ThemeIcon } from "@mantine/core";
import {
  IconCircleCheck,
  IconCurrencyDollar,
  IconShoppingBagCheck,
  IconWallet,
} from "@tabler/icons-react";
import { formatCurrency } from "@/lib/formatters";

interface SummaryCardsProps {
  totals: {
    planned: number;
    purchased: number;
    remaining: number;
    itemCount: number;
  };
  budget: number;
  purchasedCount: number;
}

export function SummaryCards({ totals, budget, purchasedCount }: SummaryCardsProps) {
  const cards = [
    {
      label: "Total planejado",
      value: formatCurrency(totals.planned),
      hint: `${totals.itemCount} ${totals.itemCount === 1 ? "item" : "itens"} na lista`,
      icon: IconCurrencyDollar,
      color: "#c96c3d",
    },
    {
      label: "Já comprado",
      value: formatCurrency(totals.purchased),
      hint: `${purchasedCount} concluídos`,
      icon: IconShoppingBagCheck,
      color: "#2f7d55",
    },
    {
      label: "Saldo do orçamento",
      value: formatCurrency(totals.remaining),
      hint: `de ${formatCurrency(budget)}`,
      icon: IconWallet,
      color: "#35749a",
    },
    {
      label: "Progresso",
      value: `${Math.round((totals.purchased / Math.max(totals.planned, 1)) * 100)}%`,
      hint: "do valor planejado",
      icon: IconCircleCheck,
      color: "#6c55a3",
    },
  ];

  return (
    <SimpleGrid
      component="section"
      cols={{ base: 1, sm: 2, xl: 4 }}
      spacing="md"
      aria-label="Resumo"
    >
      {cards.map((card) => (
        <Paper key={card.label} withBorder radius="lg" p="md" style={{ borderColor: "#e8e2d8" }}>
          <Group justify="space-between" align="flex-start" wrap="nowrap">
            <div>
              <Text size="xs" fw={500} c="dimmed">
                {card.label}
              </Text>

              <Text mt={8} size="xl" fw={600} c="#16261f" style={{ letterSpacing: "-0.03em" }}>
                {card.value}
              </Text>

              <Text mt={4} size="xs" c="dimmed">
                {card.hint}
              </Text>
            </div>

            <ThemeIcon radius="md" size={38} color={card.color}>
              <card.icon size={18} />
            </ThemeIcon>
          </Group>
        </Paper>
      ))}
    </SimpleGrid>
  );
}
