"use client";

import { Badge, Box, Image, ThemeIcon } from "@mantine/core";
import {
  IconArmchair,
  IconLamp2,
  IconPackages,
  IconPaint,
  IconPlugConnected,
  IconShape,
  IconTool,
} from "@tabler/icons-react";
import { useState } from "react";
import type { Category } from "@/types/product";

const categoryPresentation: Record<
  Category,
  { icon: typeof IconArmchair; background: string; color: string }
> = {
  Móveis: { icon: IconArmchair, background: "#e9ddd2", color: "#8a664e" },
  Eletrodomésticos: { icon: IconPlugConnected, background: "#dfe8e4", color: "#547767" },
  Iluminação: { icon: IconLamp2, background: "#f1e6c8", color: "#a07a2f" },
  Revestimentos: { icon: IconShape, background: "#dce6d2", color: "#5e7a4a" },
  Materiais: { icon: IconTool, background: "#e5e1dc", color: "#74685e" },
  Decoração: { icon: IconPaint, background: "#eadde5", color: "#8a5e78" },
  Outros: { icon: IconPackages, background: "#dfe3ec", color: "#5e6880" },
};

interface ProductImageProps {
  name: string;
  category: Category;
  imageUrl: string;
  height?: number;
}

export function ProductImage({ name, category, imageUrl, height = 144 }: ProductImageProps) {
  const [failedUrl, setFailedUrl] = useState("");
  const presentation = categoryPresentation[category];
  const Icon = presentation.icon;

  if (imageUrl && failedUrl !== imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={`Imagem de ${name}`}
        h={height}
        w="100%"
        fit="cover"
        onError={() => setFailedUrl(imageUrl)}
      />
    );
  }

  return (
    <Box
      h={height}
      pos="relative"
      c={presentation.color}
      style={{
        display: "grid",
        placeItems: "center",
        overflow: "hidden",
        background: presentation.background,
      }}
    >
      <Box
        pos="absolute"
        top={-34}
        right={-34}
        w={112}
        h={112}
        style={{ borderRadius: "50%", border: "1px solid currentColor", opacity: 0.1 }}
      />
      <Box
        pos="absolute"
        bottom={-48}
        left={-24}
        w={128}
        h={128}
        bg="rgba(255,255,255,0.2)"
        style={{ borderRadius: "50%" }}
      />
      <ThemeIcon
        size={64}
        radius={20}
        color={presentation.color}
        style={{
          border: "1px solid rgba(255,255,255,0.45)",
          background: "rgba(255,255,255,0.35)",
          boxShadow: "var(--mantine-shadow-xs)",
        }}
      >
        <Icon size={29} stroke={1.6} />
      </ThemeIcon>
      <Badge
        pos="absolute"
        bottom={12}
        left={12}
        size="sm"
        radius="xl"
        c={presentation.color}
        bg="rgba(255,255,255,0.6)"
      >
        {category}
      </Badge>
    </Box>
  );
}
