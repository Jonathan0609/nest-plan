"use client";

import { AppShell, AppShellMain, AppShellNavbar, Container } from "@mantine/core";
import { type ReactNode, useState } from "react";
import { AppLayoutContext } from "@/hooks/use-app-layout";
import { useProducts } from "@/hooks/use-products";
import type { Room } from "@/types/product";
import { Navbar } from "./Navbar";

type Props = {
  children: ReactNode;
};

export default function AppLayoutContent(props: Props) {
  const productStore = useProducts();
  const [selectedRoom, setSelectedRoom] = useState<Room | "Todos">("Todos");

  return (
    <AppLayoutContext.Provider
      value={{ ...productStore, selectedRoom, onRoomChange: setSelectedRoom }}
    >
      <AppShell
        navbar={{ width: 250, breakpoint: "lg", collapsed: { mobile: true } }}
        padding={0}
        styles={{ main: { background: "transparent" } }}
      >
        <AppShellNavbar withBorder={false}>
          <Navbar
            products={productStore.products}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
          />
        </AppShellNavbar>

        <AppShellMain>
          <Container size={1500} px={{ base: "md", sm: "lg", lg: 32 }} py={{ base: "lg", lg: 32 }}>
            {props.children}
          </Container>
        </AppShellMain>
      </AppShell>
    </AppLayoutContext.Provider>
  );
}
