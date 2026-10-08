'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Center,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle } from '@/lib/crud-styles';
import { formatDateTime, todayISO, toISODate } from '@/lib/date-utils';
import { formatSoles } from '@/lib/format';
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_TYPE_LABELS,
} from '@/lib/reservation-utils';
import { useBranchStore } from '@/stores/branch-store';
import type { Customer, Payment, PaymentMethod, Reservation, User } from '@/types/api';

export default function PagosPage() {
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const branches = useBranchStore((s) => s.branches);

  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [branchFilter, setBranchFilter] = useState<number | null>(
    selectedBranch?.id ?? null,
  );
  const [payments, setPayments] = useState<Payment[]>([]);
  const [customerNames, setCustomerNames] = useState<Record<number, string>>({});
  const [reservationCustomerMap, setReservationCustomerMap] = useState<
    Record<number, number>
  >({});
  const [userNames, setUserNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedBranch && branchFilter == null) {
      setBranchFilter(selectedBranch.id);
    }
  }, [selectedBranch, branchFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Payment[]>('/payments', {
        params: {
          ...(branchFilter ? { branchId: branchFilter } : {}),
          ...(startDate ? { fromDate: startDate } : {}),
          ...(endDate ? { toDate: endDate } : {}),
          ...(method ? { method } : {}),
        },
      });
      setPayments(data);

      const reservationIds = [...new Set(data.map((p) => p.reservationId))];
      const reservations = await Promise.all(
        reservationIds.map(async (id) => {
          try {
            const { data: reservation } = await api.get<Reservation>(`/reservations/${id}`);
            return reservation;
          } catch {
            return null;
          }
        }),
      );

      const validReservations = reservations.filter((r): r is Reservation => r != null);
      const customerIds = [...new Set(validReservations.map((r) => r.customerId))];
      const reservationCustomer = Object.fromEntries(
        validReservations.map((r) => [r.id, r.customerId]),
      );
      setReservationCustomerMap(reservationCustomer);

      const [customers, users] = await Promise.all([
        Promise.all(
          customerIds.map(async (id) => {
            try {
              const { data: customer } = await api.get<Customer>(`/customers/${id}`);
              return [id, `${customer.firstName} ${customer.lastName}`] as const;
            } catch {
              return [id, `Cliente #${id}`] as const;
            }
          }),
        ),
        Promise.all(
          [...new Set(data.map((p) => p.registeredById))].map(async (id) => {
            try {
              const { data: user } = await api.get<User>(`/users/${id}`);
              return [id, user.name] as const;
            } catch {
              return [id, `Usuario #${id}`] as const;
            }
          }),
        ),
      ]);

      setCustomerNames(Object.fromEntries(customers));
      setUserNames(Object.fromEntries(users));
    } catch (error) {
      notifications.show({
        title: 'Error al cargar pagos',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [branchFilter, startDate, endDate, method]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalNet = useMemo(() => {
    return payments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount);
      if (payment.type === 'refund') return sum - amount;
      return sum + amount;
    }, 0);
  }, [payments]);

  const methodOptions = [
    { value: '', label: 'Todos los métodos' },
    ...Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  const branchOptions = [
    { value: '', label: 'Todos los locales' },
    ...branches.map((b) => ({ value: String(b.id), label: b.name })),
  ];

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title
          order={2}
          style={{
            fontFamily: 'var(--font-heading), Georgia, serif',
            color: 'hsl(var(--tl-brown-dark))',
            fontWeight: 500,
          }}
        >
          Pagos
        </Title>
        <Text c="dimmed">Registro de cobros y devoluciones por periodo.</Text>
      </Stack>

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        <Group align="flex-end" wrap="wrap">
          <DatePickerInput
            label="Desde"
            value={new Date(`${startDate}T12:00:00`)}
            onChange={(value) => {
              if (value) setStartDate(toISODate(value));
            }}
            w={{ base: '100%', sm: 180 }}
          />
          <DatePickerInput
            label="Hasta"
            value={new Date(`${endDate}T12:00:00`)}
            onChange={(value) => {
              if (value) setEndDate(toISODate(value));
            }}
            w={{ base: '100%', sm: 180 }}
          />
          <Select
            label="Local"
            data={branchOptions}
            value={branchFilter ? String(branchFilter) : ''}
            onChange={(value) => setBranchFilter(value ? parseInt(value, 10) : null)}
            w={{ base: '100%', sm: 220 }}
            allowDeselect
          />
          <Select
            label="Método"
            data={methodOptions}
            value={method ?? ''}
            onChange={(value) => setMethod((value as PaymentMethod) || null)}
            w={{ base: '100%', sm: 200 }}
            allowDeselect
          />
        </Group>
      </Paper>

      <Paper withBorder radius="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="grape" />
          </Center>
        ) : payments.length === 0 ? (
          <Text p="lg" c="dimmed">
            No hay pagos en el rango seleccionado.
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={960}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Fecha</Table.Th>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Reserva</Table.Th>
                  <Table.Th>Monto</Table.Th>
                  <Table.Th>Método</Table.Th>
                  <Table.Th>Tipo</Table.Th>
                  <Table.Th>Registrado por</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {payments.map((payment) => (
                  <Table.Tr key={payment.id}>
                    <Table.Td>{formatDateTime(payment.createdAt)}</Table.Td>
                    <Table.Td>
                      {reservationCustomerMap[payment.reservationId]
                        ? customerNames[reservationCustomerMap[payment.reservationId]]
                        : '—'}
                    </Table.Td>
                    <Table.Td>#{payment.reservationId}</Table.Td>
                    <Table.Td>
                      {payment.type === 'refund' ? '−' : ''}
                      {formatSoles(parseFloat(payment.amount))}
                    </Table.Td>
                    <Table.Td>
                      {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
                    </Table.Td>
                    <Table.Td>
                      {PAYMENT_TYPE_LABELS[payment.type] ?? payment.type}
                    </Table.Td>
                    <Table.Td>
                      {userNames[payment.registeredById] ?? `#${payment.registeredById}`}
                    </Table.Td>
                  </Table.Tr>
                ))}
                <Table.Tr>
                  <Table.Td colSpan={3} fw={600}>
                    Total neto
                  </Table.Td>
                  <Table.Td fw={600} colSpan={4}>
                    {formatSoles(totalNet)}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>
    </Stack>
  );
}
