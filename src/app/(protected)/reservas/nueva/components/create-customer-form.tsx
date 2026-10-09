"use client";

import { useState } from "react";
import { Button, Group, Paper, Stack, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { CustomerResponseDto } from "@/generated-client";
import { clientesApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";
import { chain, maxLength, requerido, telefono } from "@/lib/validations";

interface CreateCustomerFormProps {
  onCreated: (customer: CustomerResponseDto) => void;
}

export function CreateCustomerForm({ onCreated }: CreateCustomerFormProps) {
  const [creating, setCreating] = useState(false);
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    whatsapp: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    const first = chain(
      requerido("Nombres"),
      maxLength("Nombres", 80),
    )(values.firstName);
    const last = chain(
      requerido("Apellidos"),
      maxLength("Apellidos", 80),
    )(values.lastName);
    const wa = telefono(values.whatsapp);
    if (first) next.firstName = first;
    if (last) next.lastName = last;
    if (wa) next.whatsapp = wa;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setCreating(true);
    try {
      const { data } = await clientesApi.customerControllerCreate({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        whatsapp: values.whatsapp.trim(),
      });
      notifications.show({
        title: "Cliente creado",
        color: "green",
        message: `${data.firstName} ${data.lastName}`,
      });
      onCreated(data);
    } catch (error) {
      notifications.show({
        title: "No se pudo crear",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="sm">
        <TextInput
          label="Nombres"
          required
          value={values.firstName}
          error={errors.firstName}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setValues((c) => ({ ...c, firstName: val }));
          }}
        />
        <TextInput
          label="Apellidos"
          required
          value={values.lastName}
          error={errors.lastName}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setValues((c) => ({ ...c, lastName: val }));
          }}
        />
        <TextInput
          label="WhatsApp"
          required
          value={values.whatsapp}
          error={errors.whatsapp}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setValues((c) => ({ ...c, whatsapp: val }));
          }}
        />
        <Group justify="flex-end">
          <Button
            styles={primaryButtonStyles}
            loading={creating}
            onClick={() => void handleCreate()}
          >
            Crear y continuar
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
