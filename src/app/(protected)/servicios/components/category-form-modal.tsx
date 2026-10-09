"use client";

import {
  Button,
  Group,
  Modal,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { ServiceCategoryResponseDto } from "@/generated-client";
import { categoriasApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";
import { chain, maxLength, requerido } from "@/lib/validations";

interface CategoryFormModalProps {
  opened: boolean;
  onClose: () => void;
  category: ServiceCategoryResponseDto | null;
  onSaved: () => void;
}

function CategoryForm({
  category,
  onClose,
  onSaved,
}: {
  category: ServiceCategoryResponseDto | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(category);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
    validate: {
      name: chain(requerido("Nombre"), maxLength("Nombre", 80)),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || undefined,
      };
      if (isEdit && category) {
        await categoriasApi.serviceCategoryControllerUpdate(
          category.id,
          payload,
        );
      } else {
        await categoriasApi.serviceCategoryControllerCreate({
          ...payload,
          isActive: true,
        });
      }
      notifications.show({
        title: isEdit ? "Categoría actualizada" : "Categoría creada",
        message: values.name,
        color: "green",
      });
      onSaved();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: getApiErrorMessage(error),
        color: "red",
      });
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput label="Nombre" required {...form.getInputProps("name")} />
        <Textarea
          label="Descripción"
          minRows={2}
          {...form.getInputProps("description")}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button type="submit" styles={primaryButtonStyles}>
            Guardar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function CategoryFormModal({
  opened,
  onClose,
  category,
  onSaved,
}: CategoryFormModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={category ? "Editar categoría" : "Nueva categoría"}
    >
      {opened ? (
        <CategoryForm
          key={category?.id ?? "new"}
          category={category}
          onClose={onClose}
          onSaved={onSaved}
        />
      ) : null}
    </Modal>
  );
}
