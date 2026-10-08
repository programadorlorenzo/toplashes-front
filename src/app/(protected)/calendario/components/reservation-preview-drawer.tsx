'use client';

import {
  Anchor,
  Button,
  Drawer,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/date-utils';
import { formatSoles } from '@/lib/format';
import {
  RESERVATION_CHANNEL_LABELS,
  RESERVATION_STATUS_LABELS,
} from '@/lib/reservation-utils';
import { ReservationStatusBadge } from '@/app/(protected)/reservas/components/reservation-status-badge';
import type { Reservation, Service } from '@/types/api';
import { primaryButtonStyles } from '@/lib/crud-styles';

interface ReservationPreviewDrawerProps {
  opened: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  customerName?: string;
  servicesById: Record<number, Service>;
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
      <Drawer opened={opened} onClose={onClose} title="Reserva" position="right">
        <Text c="dimmed">Selecciona una reserva.</Text>
      </Drawer>
    );
  }

  const customerLabel =
    customerName ?? `Cliente #${reservation.customerId}`;

  return (
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
          {formatDate(reservation.date)} ·{' '}
          {RESERVATION_CHANNEL_LABELS[reservation.channel] ?? reservation.channel}
        </Text>

        <Stack gap="xs">
          {reservation.services.map((line) => (
            <Text key={line.id} size="sm">
              {servicesById[line.serviceId]?.name ?? `Servicio #${line.serviceId}`}{' '}
              · {employeeNames[line.employeeId] ?? 'Colaboradora'} ·{' '}
              {formatTime(line.startTime)} – {formatTime(line.endTime)} ·{' '}
              {formatSoles(parseFloat(line.agreedPrice))}
            </Text>
          ))}
        </Stack>

        <Text size="sm">
          Total: <strong>{formatSoles(parseFloat(reservation.totalAmount))}</strong>
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
          component={Link}
          href={`/reservas/${reservation.id}`}
          rightSection={<ExternalLink size={16} />}
          styles={primaryButtonStyles}
        >
          Ver reserva completa
        </Button>
        <Anchor component={Link} href="/reservas" size="sm" onClick={onClose}>
          Ir al listado de reservas
        </Anchor>
      </Stack>
    </Drawer>
  );
}
