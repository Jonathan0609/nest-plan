"use client";

import {
  ActionIcon,
  Button,
  Divider,
  FileButton,
  Group,
  Image,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { schemaResolver, useForm } from "@mantine/form";
import { IconLink, IconPhotoPlus, IconUpload, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { productImageUrlSchema } from "@/lib/form-schemas";
import {
  CATEGORY_OPTIONS,
  PRIORITY_OPTIONS,
  type Product,
  type ProductDraft,
  ROOM_OPTIONS,
  STATUS_OPTIONS,
} from "@/types/product";
import { type ProductFormValues, productFormSchema, productInitialValues } from "./types";

const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024;

const productToFormValues = (product?: Product): ProductFormValues => {
  if (!product) {
    return {
      ...productInitialValues,
      price: "",
    };
  }

  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...draft } = product;

  return draft;
};

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Não foi possível ler esta imagem."));
    reader.readAsDataURL(file);
  });

interface ProductFormProps {
  product?: Product;
  onSubmit: (draft: ProductDraft) => boolean;
  onCancel: () => void;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [imageError, setImageError] = useState("");
  const [isReadingImage, setIsReadingImage] = useState(false);

  const form = useForm<ProductFormValues>({
    mode: "controlled",
    initialValues: productToFormValues(product),
    validateInputOnChange: true,
    validate: schemaResolver(productFormSchema),
  });

  const imageUrl = form.values.imageUrl;
  const hasImagePreview = Boolean(imageUrl && productImageUrlSchema.safeParse(imageUrl).success);

  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      return;
    }

    setImageError("");
    if (!file.type.startsWith("image/")) {
      setImageError("Selecione um arquivo de imagem válido.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("A imagem precisa ter no máximo 1,5 MB.");
      return;
    }

    try {
      setIsReadingImage(true);
      form.setFieldValue("imageUrl", await readFileAsDataUrl(file));
      form.clearFieldError("imageUrl");
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Erro ao ler a imagem.");
    } finally {
      setIsReadingImage(false);
    }
  };

  const submitProduct = (values: ProductFormValues) => {
    onSubmit({
      ...values,
      name: values.name.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      quantity: Number(values.quantity),
      store: values.store.trim(),
      productUrl: values.productUrl.trim(),
      imageUrl: values.imageUrl.trim(),
      notes: values.notes.trim(),
    });
  };

  return (
    <form onSubmit={form.onSubmit(submitProduct)} noValidate>
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Reúna o que importa para decidir a compra sem perder links ou referências.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput
            label="Nome do produto"
            placeholder="Ex.: Sofá modular 3 lugares"
            required
            data-autofocus
            styles={{ root: { gridColumn: "1 / -1" } }}
            {...form.getInputProps("name")}
          />

          <Textarea
            label="Descrição"
            placeholder="Cor, material, medidas e outros detalhes importantes"
            minRows={3}
            autosize
            styles={{ root: { gridColumn: "1 / -1" } }}
            {...form.getInputProps("description")}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="md">
          <Select
            label="Ambiente"
            data={[...ROOM_OPTIONS]}
            allowDeselect={false}
            {...form.getInputProps("room")}
          />

          <Select
            label="Categoria"
            data={[...CATEGORY_OPTIONS]}
            allowDeselect={false}
            {...form.getInputProps("category")}
          />

          <Select
            label="Prioridade"
            data={[...PRIORITY_OPTIONS]}
            allowDeselect={false}
            {...form.getInputProps("priority")}
          />

          <Select
            label="Status"
            data={[...STATUS_OPTIONS]}
            allowDeselect={false}
            {...form.getInputProps("status")}
          />
        </SimpleGrid>

        <Divider />

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
          <NumberInput
            label="Preço unitário"
            placeholder="0,00"
            prefix="R$"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            withAsterisk
            {...form.getInputProps("price")}
          />

          <NumberInput
            label="Quantidade"
            min={1}
            step={1}
            allowDecimal={false}
            withAsterisk
            {...form.getInputProps("quantity")}
          />

          <DateInput
            label="Data desejada"
            placeholder="DD/MM/AAAA"
            valueFormat="DD/MM/YYYY"
            clearable
            {...form.getInputProps("purchaseDate")}
          />
        </SimpleGrid>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <TextInput
            label="Loja ou fornecedor"
            placeholder="Nome da loja"
            {...form.getInputProps("store")}
          />

          <TextInput
            label="Link do produto"
            type="url"
            leftSection={<IconLink size={17} />}
            placeholder="https://loja.com/produto"
            {...form.getInputProps("productUrl")}
          />
        </SimpleGrid>

        <Stack gap="sm">
          <div>
            <Text size="sm" fw={500}>
              Imagem do produto
            </Text>
            <Text mt={3} size="xs" c="dimmed">
              Anexe uma imagem de até 1,5 MB ou cole uma URL direta.
            </Text>
          </div>

          {hasImagePreview ? (
            <Paper withBorder radius="lg" p="sm" bg="#faf8f4">
              <Group wrap="nowrap">
                <Image
                  src={imageUrl}
                  alt="Prévia do produto"
                  w={64}
                  h={64}
                  radius="md"
                  fit="cover"
                />

                <div style={{ minWidth: 0, flex: 1 }}>
                  <Text size="sm" fw={600} truncate>
                    Imagem adicionada
                  </Text>
                  <Text size="xs" c="dimmed">
                    Salva junto com o produto neste dispositivo.
                  </Text>
                </div>

                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label="Remover imagem"
                  onClick={() => form.setFieldValue("imageUrl", "")}
                >
                  <IconX size={18} />
                </ActionIcon>
              </Group>
            </Paper>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
              <FileButton
                onChange={handleImageUpload}
                accept="image/png,image/jpeg,image/webp,image/gif"
              >
                {(props) => (
                  <Button
                    {...props}
                    variant="light"
                    h={72}
                    loading={isReadingImage}
                    leftSection={<IconUpload size={19} />}
                  >
                    Enviar imagem
                  </Button>
                )}
              </FileButton>

              <TextInput
                type="url"
                leftSection={<IconPhotoPlus size={18} />}
                placeholder="Cole a URL da imagem"
                aria-label="URL da imagem"
                {...form.getInputProps("imageUrl")}
              />
            </SimpleGrid>
          )}
          {imageError ? (
            <Text size="xs" c="red">
              {imageError}
            </Text>
          ) : null}
        </Stack>

        <Textarea
          label="Observações"
          placeholder="Medidas, condições de entrega, cupom, cor preferida..."
          minRows={3}
          autosize
          {...form.getInputProps("notes")}
        />

        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" loading={isReadingImage}>
            {product ? "Salvar alterações" : "Adicionar à lista"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
