"use client";

import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type {
  CreatePaymentDtoMethodEnum,
  CreatePaymentDtoTypeEnum,
} from "@/generated-client";
import { pagosApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_TYPE_LABELS,
} from "@/lib/reservation-utils";

interface PaymentModalProps {
  opened: boolean;
  onClose: () => void;
  reservationId: number;
  suggestedAmount?: number;
  onSaved: () => void;
}

const methodOptions = Object.entries(PAYMENT_METHOD_LABELS).map(
  ([value, label]) => ({ value, label }),
);
const typeOptions = Object.entries(PAYMENT_TYPE_LABELS)
  .filter(([value]) => value !== "refund")
  .map(([value, label]) => ({ value, label }));

export function PaymentModal({
  opened,
  onClose,
  reservationId,
  suggestedAmount,
  onSaved,
}: PaymentModalProps) {
  const form = useForm({
    initialValues: {
      amount: suggestedAmount ?? 0,
      method: "cash" as CreatePaymentDtoMethodEnum,
      type: "partial" as CreatePaymentDtoTypeEnum,
      reference: "",
      notes: "",
    },
    validate: {
      amount: (value) => (value > 0 ? null : "Ingresa un monto válido"),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await pagosApi.paymentControllerCreate({
        reservationId,
        amount: values.amount,
        method: values.method,
        type: values.type,
        reference: values.reference.trim() || undefined,
        notes: values.notes.trim() || undefined,
      });
      notifications.show({
        title: "Pago registrado",
        color: "green",
        message: "El pago se guardó correctamente.",
      });
      onSaved();
      onClose();
      form.reset();
    } catch (error) {
      notifications.show({
        title: "Error al registrar pago",
        message: getApiErrorMessage(error),
        color: "red",
      });
    }
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Registrar pago" centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <NumberInput
            label="Monto"
            prefix="S/ "
            decimalScale={2}
            fixedDecimalScale
            min={0.01}
            required
            {...form.getInputProps("amount")}
          />
          <Select
            label="Método"
            data={methodOptions}
            comboboxProps={{ withinPortal: true }}
            {...form.getInputProps("method")}
          />
          <Select
            label="Tipo"
            data={typeOptions}
            comboboxProps={{ withinPortal: true }}
            {...form.getInputProps("type")}
          />
          <TextInput label="Referencia" {...form.getInputProps("reference")} />
          <Textarea
            label="Notas"
            minRows={2}
            {...form.getInputProps("notes")}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit" styles={primaryButtonStyles}>
              Guardar pago
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
