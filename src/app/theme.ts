import { createTheme, type MantineColorsTuple } from "@mantine/core";

const terracotta: MantineColorsTuple = [
  "#fff4ed",
  "#ffe6d8",
  "#f8cbb2",
  "#f0ad88",
  "#eb9468",
  "#e88753",
  "#d9713d",
  "#bd5e30",
  "#9d4e2a",
  "#813f24",
];

export const theme = createTheme({
  primaryColor: "terracotta",
  colors: { terracotta },
  defaultRadius: "md",
  fontFamily: '"Segoe UI", Arial, sans-serif',
  headings: {
    fontFamily: '"Segoe UI", Arial, sans-serif',
    fontWeight: "600",
  },
  cursorType: "pointer",
});
