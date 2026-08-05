"use client";

import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import "dayjs/locale/pt-br";
import type { ReactNode } from "react";
import { theme } from "./theme";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <DatesProvider
        settings={{
          locale: "pt-br",
          firstDayOfWeek: 0,
          weekendDays: [0, 6],
        }}
      >
        <Notifications position="top-right" />
        {children}
      </DatesProvider>
    </MantineProvider>
  );
}
