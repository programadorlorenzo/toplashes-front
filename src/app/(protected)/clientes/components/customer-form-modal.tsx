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
import type { CustomerResponseDto } from "@/generated-client";
import { clientesApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";
import {
  chain,
  correoOpcional,
  maxLength,
  requerido,
  telefono,
  telefonoOpcional,
} from "@/lib/validations";
interface CustomerFormModalProps {
  opened: boolean;
  onClose: () => void;
  customer: CustomerResponseDto | null;
  onSaved: () => void;
}

function CustomerForm({
  customer,
  onClose,
  onSaved,
}: {
  customer: CustomerResponseDto | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = Boolean(customer);
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: customer?.firstName ?? "",
      lastName: customer?.lastName ?? "",
      whatsapp: customer?.whatsapp ?? "",
      phone: customer?.phone ?? "",
      email: customer?.email ?? "",
      notes: customer?.notes ?? "",
    },
    validate: {
      firstName: chain(requerido("Nombres"), maxLength("Nombres", 80)),
      lastName: chain(requerido("Apellidos"), maxLength("Apellidos", 80)),
      whatsapp: telefono,
      phone: telefonoOpcional,
      email: correoOpcional,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        whatsapp: values.whatsapp,
        phone: values.phone || undefined,
        email: values.email || undefined,
        notes: values.notes || undefined,
      };
      if (isEdit && customer) {
        await clientesApi.customerControllerUpdate(customer.id, payload);
      } else {
        await clientesApi.customerControllerCreate(payload);
      }
      notifications.show({
        title: isEdit ? "Cliente actualizado" : "Cliente creado",
        color: "green",
        message: `${values.firstName} ${values.lastName}`,
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
        <Group grow>
          <TextInput
            label="Nombres"
            required
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Apellidos"
            required
            {...form.getInputProps("lastName")}
          />
        </Group>
        <TextInput
          label="WhatsApp"
          required
          {...form.getInputProps("whatsapp")}
        />
        <TextInput
          label="Teléfono alternativo"
          {...form.getInputProps("phone")}
        />
        <TextInput label="Correo" {...form.getInputProps("email")} />
        <Textarea label="Notas" minRows={3} {...form.getInputProps("notes")} />
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

export function CustomerFormModal({
  opened,
  onClose,
  customer,
  onSaved,
}: CustomerFormModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={customer ? "Editar cliente" : "Nuevo cliente"}
      size="lg"
    >
      {opened ? (
        <CustomerForm
          key={customer?.id ?? "new"}
          customer={customer}
          onClose={onClose}
          onSaved={onSaved}
        />
      ) : null}
    </Modal>
  );
}
