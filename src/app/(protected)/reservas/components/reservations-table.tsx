'use client';

import {
  ActionIcon,
  Group,
  ScrollArea,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import Link from 'next/link';
import { Check, Eye, UserCheck, X } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/date-utils';
import { formatSoles } from '@/lib/format';
import type { Reservation, ReservationStatus } from '@/types/api';
import { ReservationStatusBadge } from './reservation-status-badge';

interface ReservationsTableProps {
  items: Reservation[];
  customerNames: Record<number, string>;
  branchNames: Record<number, string>;
  canUpdate: boolean;
  onQuickStatus: (id: number, status: ReservationStatus) => void;
  updatingId: number | null;
}

export function ReservationsTable({
  items,
  customerNames,
  branchNames,
  canUpdate,
  onQuickStatus,
  updatingId,
}: ReservationsTableProps) {
  return (
    <ScrollArea type="auto">
      <Table striped highlightOnHover miw={880}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Fecha</Table.Th>
            <Table.Th>Cliente</Table.Th>
            <Table.Th>Local</Table.Th>
            <Table.Th>Horario</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Estado</Table.Th>
            <Table.Th w={120}>Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((reservation) => {
            const firstService = reservation.services[0];
            const timeLabel = firstService
              ? `${formatTime(firstService.startTime)}${
                  reservation.services.length > 1
                    ? ` (+${reservation.services.length - 1})`
                    : ''
                }`
              : '—';

            return (
              <Table.Tr key={reservation.id}>
                <Table.Td>{formatDate(reservation.date)}</Table.Td>
                <Table.Td fw={500}>
                  {customerNames[reservation.customerId] ??
                    `#${reservation.customerId}`}
                </Table.Td>
                <Table.Td>
                  {branchNames[reservation.branchId] ??
                    `Local ${reservation.branchId}`}
                </Table.Td>
                <Table.Td>{timeLabel}</Table.Td>
                <Table.Td>
                  {formatSoles(parseFloat(reservation.totalAmount))}
                </Table.Td>
                <Table.Td>
                  <ReservationStatusBadge status={reservation.status} />
                </Table.Td>
                <Table.Td>
                  <Group gap={4} wrap="nowrap">
                    <Tooltip label="Ver detalle">
                      <ActionIcon
                        variant="subtle"
                        component={Link}
                        href={`/reservas/${reservation.id}`}
                        aria-label="Ver detalle"
                      >
                        <Eye size={16} />
                      </ActionIcon>
                    </Tooltip>
                    {canUpdate &&
                    reservation.status === 'pending_confirmation' ? (
                      <Tooltip label="Confirmar">
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          loading={updatingId === reservation.id}
                          onClick={() =>
                            onQuickStatus(reservation.id, 'confirmed')
                          }
                          aria-label="Confirmar"
                        >
                          <Check size={16} />
                        </ActionIcon>
                      </Tooltip>
                    ) : null}
                    {canUpdate && reservation.status === 'confirmed' ? (
                      <Tooltip label="Marcar presente">
                        <ActionIcon
                          variant="subtle"
                          color="indigo"
                          loading={updatingId === reservation.id}
                          onClick={() =>
                            onQuickStatus(reservation.id, 'client_present')
                          }
                          aria-label="Marcar presente"
                        >
                          <UserCheck size={16} />
                        </ActionIcon>
                      </Tooltip>
                    ) : null}
                    {canUpdate &&
                    (reservation.status === 'pending_confirmation' ||
                      reservation.status === 'confirmed') ? (
                      <Tooltip label="Cancelar">
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          loading={updatingId === reservation.id}
                          onClick={() =>
                            onQuickStatus(reservation.id, 'cancelled')
                          }
                          aria-label="Cancelar"
                        >
                          <X size={16} />
                        </ActionIcon>
                      </Tooltip>
                    ) : null}
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
