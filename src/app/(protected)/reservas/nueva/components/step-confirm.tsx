"use client";

import { useState } from "react";
import {
  Button,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import type {
  CreateReservationDto,
  CreateReservationDtoChannelEnum,
  CustomerResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { reservasApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";
import { formatDate, formatTime } from "@/lib/date-utils";
import { formatSoles } from "@/lib/format";
import { RESERVATION_CHANNEL_LABELS } from "@/lib/reservation-utils";
import type { SelectedServiceSlot } from "./step-availability";

interface StepConfirmProps {
  customer: CustomerResponseDto;
  branchName: string;
  branchId: number;
  date: string;
  selections: SelectedServiceSlot[];
  servicesById: Record<number, ServiceResponseDto>;
  onBack: () => void;
}

const channelOptions = Object.entries(RESERVATION_CHANNEL_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function StepConfirm({
  customer,
  branchName,
  branchId,
  date,
  selections,
  servicesById,
  onBack,
}: StepConfirmProps) {
  const router = useRouter();
  const [channel, setChannel] =
    useState<CreateReservationDtoChannelEnum>("whatsapp");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState<number | string>(0);
  const [prices, setPrices] = useState<Record<number, number>>(() =>
    Object.fromEntries(selections.map((s) => [s.serviceId, s.agreedPrice])),
  );
  const [submitting, setSubmitting] = useState(false);

  const subtotal = selections.reduce(
    (sum, line) => sum + (prices[line.serviceId] ?? line.agreedPrice),
    0,
  );
  const discountNum =
    typeof discount === "number" ? discount : parseFloat(discount || "0");
  const total = Math.max(
    subtotal - (Number.isFinite(discountNum) ? discountNum : 0),
    0,
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: CreateReservationDto = {
        customerId: customer.id,
        branchId,
        date,
        channel,
        notes: notes.trim() || undefined,
        discount: discountNum > 0 ? discountNum : undefined,
        services: selections.map((line) => ({
          serviceId: line.serviceId,
          employeeId: line.employeeId ?? undefined,
          startTime: line.startTime,
          agreedPrice: prices[line.serviceId] ?? line.agreedPrice,
        })),
      };
      const { data } = await reservasApi.reservationControllerCreate(payload);
      notifications.show({
        title: "Reserva creada",
        color: "green",
        message: "La cita se registró correctamente.",
      });
      router.push("/reservas");
    } catch (error) {
      notifications.show({
        title: "No se pudo crear la reserva",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack gap="md">
      <Text>
        <strong>
          {customer.firstName} {customer.lastName}
        </strong>{" "}
        · {branchName} · {formatDate(date)}
      </Text>

      <Stack gap="xs">
        {selections.map((line) => {
          const service = servicesById[line.serviceId];
          return (
            <Group
              key={line.serviceId}
              justify="space-between"
              align="flex-end"
            >
              <Stack gap={0}>
                <Text size="sm" fw={500}>
                  {service?.name ?? `Servicio #${line.serviceId}`}
                </Text>
                <Text size="xs" c="dimmed">
                  {line.employeeName} · {formatTime(line.startTime)} –{" "}
                  {formatTime(line.endTime)}
                </Text>
              </Stack>
              <NumberInput
                label="Precio"
                prefix="S/ "
                decimalScale={2}
                fixedDecimalScale
                min={0}
                w={120}
                value={prices[line.serviceId] ?? line.agreedPrice}
                onChange={(value) =>
                  setPrices((prev) => ({
                    ...prev,
                    [line.serviceId]:
                      typeof value === "number" ? value : line.agreedPrice,
                  }))
                }
              />
            </Group>
          );
        })}
      </Stack>

      <Select
        label="Canal de reserva"
        data={channelOptions}
        value={channel}
        onChange={(value) =>
          setChannel((value as CreateReservationDtoChannelEnum) ?? "whatsapp")
        }
        comboboxProps={{ withinPortal: true }}
      />
      <NumberInput
        label="Descuento (opcional)"
        prefix="S/ "
        decimalScale={2}
        fixedDecimalScale
        min={0}
        value={discount}
        onChange={setDiscount}
      />
      <Textarea
        label="Notas"
        minRows={2}
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
      />

      <Text fw={600}>Total estimado: {formatSoles(total)}</Text>

      <Group justify="space-between">
        <Button variant="default" onClick={onBack}>
          Atrás
        </Button>
        <Button
          styles={primaryButtonStyles}
          loading={submitting}
          onClick={() => void handleSubmit()}
        >
          Confirmar reserva
        </Button>
      </Group>
    </Stack>
  );
}
