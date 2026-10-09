"use client";

import {
  Button,
  Checkbox,
  Group,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type { BranchResponseDto } from "@/generated-client";
import { sucursalesApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { WORK_DAYS } from "@/lib/constants";
import { primaryButtonStyles } from "@/lib/crud-styles";
import {
  chain,
  horaHHmm,
  maxLength,
  requerido,
  telefonoOpcional,
} from "@/lib/validations";
interface BranchFormModalProps {
  opened: boolean;
  onClose: () => void;
  branch: BranchResponseDto | null;
  onSaved: () => void;
}

function BranchForm({
  branch,
  onClose,
  onSaved,
}: {
  branch: BranchResponseDto | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(branch);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: branch?.name ?? "",
      address: branch?.address ?? "",
      phone: branch?.phone ?? "",
      openTime: branch?.openTime ?? "09:00",
      closeTime: branch?.closeTime ?? "20:00",
      workDays: (branch?.workDays ?? [1, 2, 3, 4, 5, 6]).map(String),
    },
    validate: {
      name: chain(requerido("El nombre"), maxLength("El nombre", 120)),
      address: chain(requerido("La dirección"), maxLength("La dirección", 255)),
      phone: telefonoOpcional,
      openTime: horaHHmm,
      closeTime: horaHHmm,
      workDays: (value) =>
        value.length > 0 ? null : "Selecciona al menos un día",
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const payload = {
        name: values.name,
        address: values.address,
        phone: values.phone || undefined,
        openTime: values.openTime,
        closeTime: values.closeTime,
        workDays: values.workDays.map((d) => Number(d)),
      };
      if (isEdit && branch) {
        await sucursalesApi.branchControllerUpdate(branch.id, payload);
        notifications.show({
          title: "Local actualizado",
          message: "Los cambios se guardaron correctamente.",
          color: "green",
        });
      } else {
        await sucursalesApi.branchControllerCreate({
          ...payload,
          isActive: true,
        });
        notifications.show({
          title: "Local creado",
          message: "El local se registró correctamente.",
          color: "green",
        });
      }
      onSaved();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error al guardar",
        message: getApiErrorMessage(error, "No se pudo guardar el local"),
        color: "red",
      });
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Nombre"
          required
          maxLength={120}
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Dirección"
          required
          maxLength={255}
          {...form.getInputProps("address")}
        />
        <TextInput
          label="Teléfono"
          placeholder="Opcional"
          {...form.getInputProps("phone")}
        />
        <Group grow align="flex-start">
          <TextInput
            label="Apertura"
            placeholder="09:00"
            required
            {...form.getInputProps("openTime")}
          />
          <TextInput
            label="Cierre"
            placeholder="20:00"
            required
            {...form.getInputProps("closeTime")}
          />
        </Group>
        <Checkbox.Group
          label="Días de atención"
          {...form.getInputProps("workDays")}
        >
          <Group mt="xs" gap="md">
            {WORK_DAYS.map((day) => (
              <Checkbox
                key={day.value}
                value={String(day.value)}
                label={day.label}
              />
            ))}
          </Group>
        </Checkbox.Group>
        <Group justify="flex-end" mt="md">
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

export function BranchFormModal({
  opened,
  onClose,
  branch,
  onSaved,
}: BranchFormModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={branch ? "Editar local" : "Nuevo local"}
      size="lg"
    >
      {opened ? (
        <BranchForm
          key={branch?.id ?? "new"}
          branch={branch}
          onClose={onClose}
          onSaved={onSaved}
        />
      ) : null}
    </Modal>
  );
}
