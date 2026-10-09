"use client";

import { useState } from "react";
import { Anchor, Button, Drawer, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";
import { CalendarDays, Eye } from "lucide-react";
import { CustomerReservationsModal } from "@/components/customer-reservations-modal";
import { ReservationDetailModal } from "@/components/reservation-detail-modal";
import { formatDate, formatTime } from "@/lib/date-utils";
import { formatSoles } from "@/lib/format";
import {
  RESERVATION_CHANNEL_LABELS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";
import { ReservationStatusBadge } from "@/app/(protected)/reservas/components/reservation-status-badge";
import type {
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { primaryButtonStyles } from "@/lib/crud-styles";

interface ReservationPreviewDrawerProps {
  opened: boolean;
  onClose: () => void;
  reservation: ReservationResponseDto | null;
  customerName?: string;
  servicesById: Record<number, ServiceResponseDto>;
  employeeNames: Record<number, string>;
}

export function ReservationPreviewDrawer({
  opened,
  onClose,
  reservation,
  customerName,
  servicesById,
  employeeNames,
}: ReservationPreviewDrawerProps) {
  if (!reservation) {
    return (
      <Drawer
        opened={opened}
        onClose={onClose}
        title="Reserva"
        position="right"
      >
        <Text c="dimmed">Selecciona una reserva.</Text>
      </Drawer>
    );
  }

  const customerLabel = customerName ?? `Cliente #${reservation.customerId}`;
  const [detailId, setDetailId] = useState<number | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <>
      <ReservationDetailModal
        opened={detailId !== null}
        onClose={() => setDetailId(null)}
        reservationId={detailId}
      />
      <Drawer
        opened={opened}
        onClose={onClose}
        title="Detalle rápido"
        position="right"
        size="md"
      >
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600}>{customerLabel}</Text>
            <ReservationStatusBadge status={reservation.status} />
          </Group>

          <Text size="sm" c="dimmed">
            {formatDate(reservation.date)} ·{" "}
            {RESERVATION_CHANNEL_LABELS[reservation.channel] ??
              reservation.channel}
          </Text>

          <Stack gap="xs">
            {reservation.services.map((line) => (
              <Text key={line.id} size="sm">
                {servicesById[line.serviceId]?.name ??
                  `Servicio #${line.serviceId}`}{" "}
                ·{" "}
                {line.employeeId !== null
                  ? (employeeNames[line.employeeId] ?? "Colaboradora")
                  : "Sin asignar"}{" "}
                · {formatTime(line.startTime)} – {formatTime(line.endTime)} ·{" "}
                {formatSoles(parseFloat(line.agreedPrice))}
              </Text>
            ))}
          </Stack>

          <Text size="sm">
            Total:{" "}
            <strong>{formatSoles(parseFloat(reservation.totalAmount))}</strong>
          </Text>

          {reservation.notes ? (
            <Text size="sm" c="dimmed">
              {reservation.notes}
            </Text>
          ) : null}

          <Text size="xs" c="dimmed">
            Estado: {RESERVATION_STATUS_LABELS[reservation.status]}
          </Text>

          <Button
            leftSection={<Eye size={16} />}
            styles={primaryButtonStyles}
            onClick={() => setDetailId(reservation.id)}
          >
            Ver reserva completa
          </Button>
          <Button
            variant="light"
            leftSection={<CalendarDays size={16} />}
            onClick={() => setHistoryOpen(true)}
          >
            Historial de clienta
          </Button>
          <Anchor component={Link} href="/reservas" size="sm" onClick={onClose}>
            Ir al listado de reservas
          </Anchor>
        </Stack>
      </Drawer>

      <CustomerReservationsModal
        opened={historyOpen}
        onClose={() => setHistoryOpen(false)}
        customerId={reservation.customerId}
        customerName={customerLabel}
        onSelectReservation={(id) => {
          setHistoryOpen(false);
          setDetailId(id);
        }}
      />
    </>
  );
}
