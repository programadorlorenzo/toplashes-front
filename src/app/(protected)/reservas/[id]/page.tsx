'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Anchor,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Timeline,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { PaymentModal } from './components/payment-modal';
import { ReservationStatusBadge } from '../components/reservation-status-badge';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle, pageTitleStyle, primaryButtonStyles } from '@/lib/crud-styles';
import { formatDate, formatDateTime, formatTime } from '@/lib/date-utils';
import { formatSoles, whatsappUrl } from '@/lib/format';
import { hasAnyPermission } from '@/lib/permissions';
import {
  getAllowedStatusTransitions,
  RESERVATION_CHANNEL_LABELS,
  RESERVATION_STATUS_ACTION_LABELS,
  RESERVATION_STATUS_LABELS,
} from '@/lib/reservation-utils';
import { useAuthStore } from '@/stores/auth-store';
import type {
  Branch,
  Customer,
  Employee,
  Payment,
  Reservation,
  ReservationBalance,
  ReservationStatus,
  Service,
} from '@/types/api';

export default function ReservaDetallePage() {
  const params = useParams();
  const reservationId = parseInt(String(params.id), 10);
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canUpdate = hasAnyPermission(permissions, ['reservations.update']);
  const canCancel = hasAnyPermission(permissions, ['reservations.cancel']);
  const canPay = hasAnyPermission(permissions, ['payments.create']);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [balance, setBalance] = useState<ReservationBalance | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentOpened, paymentHandlers] = useDisclosure(false);

  const servicesById = useMemo(
    () => Object.fromEntries(services.map((s) => [s.id, s])),
    [services],
  );
  const employeeNames = useMemo(
    () =>
      Object.fromEntries(
        employees.map((e) => [e.id, `${e.firstName} ${e.lastName}`]),
      ),
    [employees],
  );

  const load = useCallback(async () => {
    if (!Number.isFinite(reservationId)) return;
    setLoading(true);
    try {
      const [reservationRes, servicesRes, employeesRes] = await Promise.all([
        api.get<Reservation>(`/reservations/${reservationId}`),
        api.get<Service[]>('/services'),
        api.get<Employee[]>('/employees'),
      ]);
      const resData = reservationRes.data;
      setReservation(resData);
      setServices(servicesRes.data);
      setEmployees(employeesRes.data);

      const [customerRes, branchRes] = await Promise.all([
        api.get<Customer>(`/customers/${resData.customerId}`),
        api.get<Branch>(`/branches/${resData.branchId}`),
      ]);
      setCustomer(customerRes.data);
      setBranch(branchRes.data);

      try {
        const [balanceRes, paymentsRes] = await Promise.all([
          api.get<ReservationBalance>(
            `/payments/reservations/${reservationId}/balance`,
          ),
          api.get<Payment[]>(`/payments/reservations/${reservationId}`),
        ]);
        setBalance(balanceRes.data);
        setPayments(paymentsRes.data);
      } catch {
        setBalance({
          totalAmount: resData.totalAmount,
          discount: resData.discount,
          totalPaid: '0.00',
          balance: resData.totalAmount,
        });
        setPayments([]);
      }
    } catch (error) {
      notifications.show({
        title: 'Error al cargar reserva',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleStatus = async (status: ReservationStatus) => {
    if (!reservation) return;
    setUpdating(true);
    try {
      if (status === 'cancelled') {
        await api.post(`/reservations/${reservation.id}/cancel`, {});
      } else {
        await api.put(`/reservations/${reservation.id}/status`, { status });
      }
      notifications.show({
        title: 'Estado actualizado',
        color: 'green',
        message: RESERVATION_STATUS_LABELS[status],
      });
      await load();
    } catch (error) {
      notifications.show({
        title: 'No se pudo cambiar el estado',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Center py="xl">
        <Loader color="gray" type="dots" />
      </Center>
    );
  }

  if (!reservation) {
    return (
      <Text c="dimmed" ta="center" py="xl">
        Reserva no encontrada.
      </Text>
    );
  }

  const transitions = getAllowedStatusTransitions(reservation.status).filter(
    (status) => status !== 'cancelled' || canCancel,
  );

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Stack gap={4}>
          <Anchor component={Link} href="/reservas" size="sm">
            <Group gap={4}>
              <ArrowLeft size={14} />
              Volver a reservas
            </Group>
          </Anchor>
          <Title order={2} style={pageTitleStyle}>
            Reserva #{reservation.id}
          </Title>
          <Group gap="sm">
            <ReservationStatusBadge status={reservation.status} />
            <Text c="dimmed" size="sm">
              {formatDate(reservation.date)} ·{' '}
              {RESERVATION_CHANNEL_LABELS[reservation.channel]}
            </Text>
          </Group>
        </Stack>

        <Group gap="sm">
          {canPay ? (
            <Button
              variant="light"
              leftSection={<CreditCard size={16} />}
              onClick={paymentHandlers.open}
            >
              Registrar pago
            </Button>
          ) : null}
          {canUpdate
            ? transitions.map((status) => (
                <Button
                  key={status}
                  variant={status === 'cancelled' ? 'outline' : 'filled'}
                  color={status === 'cancelled' ? 'red' : undefined}
                  styles={status === 'cancelled' ? undefined : primaryButtonStyles}
                  loading={updating}
                  onClick={() => void handleStatus(status)}
                >
                  {RESERVATION_STATUS_ACTION_LABELS[status] ??
                    RESERVATION_STATUS_LABELS[status]}
                </Button>
              ))
            : null}
        </Group>
      </Group>

      <Group align="stretch" grow wrap="wrap">
        <Paper withBorder p="md" radius="md" style={cardPaperStyle}>
          <Stack gap="xs">
            <Text fw={600}>Clienta</Text>
            {customer ? (
              <>
                <Text>
                  {customer.firstName} {customer.lastName}
                </Text>
                <Anchor href={whatsappUrl(customer.whatsapp)} target="_blank">
                  {customer.whatsapp}
                </Anchor>
                {customer.notes ? (
                  <Text size="sm" c="dimmed">
                    {customer.notes}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text c="dimmed">—</Text>
            )}
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md" style={cardPaperStyle}>
          <Stack gap="xs">
            <Text fw={600}>Local</Text>
            <Text>{branch?.name ?? `Local ${reservation.branchId}`}</Text>
            {branch?.address ? (
              <Text size="sm" c="dimmed">
                {branch.address}
              </Text>
            ) : null}
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md" style={cardPaperStyle}>
          <Stack gap="xs">
            <Text fw={600}>Pagos</Text>
            <Text size="sm">
              Total: {formatSoles(parseFloat(balance?.totalAmount ?? reservation.totalAmount))}
            </Text>
            <Text size="sm">
              Pagado: {formatSoles(parseFloat(balance?.totalPaid ?? '0'))}
            </Text>
            <Text size="sm" fw={600}>
              Saldo: {formatSoles(parseFloat(balance?.balance ?? reservation.totalAmount))}
            </Text>
            {payments.length > 0 ? (
              <Stack gap={4} mt="xs">
                {payments.map((payment) => (
                  <Text key={payment.id} size="xs" c="dimmed">
                    {formatDateTime(payment.createdAt)} ·{' '}
                    {formatSoles(parseFloat(payment.amount))}
                  </Text>
                ))}
              </Stack>
            ) : null}
          </Stack>
        </Paper>
      </Group>

      <Paper withBorder p="md" radius="md" style={cardPaperStyle}>
        <Text fw={600} mb="sm">
          Servicios agendados
        </Text>
        <Stack gap="xs">
          {reservation.services.map((line) => (
            <Text key={line.id} size="sm">
              {servicesById[line.serviceId]?.name ?? `Servicio #${line.serviceId}`} ·{' '}
              {employeeNames[line.employeeId] ?? 'Colaboradora'} ·{' '}
              {formatTime(line.startTime)} – {formatTime(line.endTime)} ·{' '}
              {formatSoles(parseFloat(line.agreedPrice))}
            </Text>
          ))}
        </Stack>
        {reservation.notes ? (
          <Text size="sm" c="dimmed" mt="md">
            Notas: {reservation.notes}
          </Text>
        ) : null}
      </Paper>

      <Paper withBorder p="md" radius="md" style={cardPaperStyle}>
        <Text fw={600} mb="md">
          Historial de estados
        </Text>
        {(reservation.statusHistory?.length ?? 0) === 0 ? (
          <Text c="dimmed" size="sm">
            Sin movimientos registrados.
          </Text>
        ) : (
          <Timeline active={reservation.statusHistory!.length - 1} bulletSize={20}>
            {reservation.statusHistory!.map((entry) => (
              <Timeline.Item
                key={entry.id}
                title={RESERVATION_STATUS_LABELS[entry.toStatus]}
              >
                <Text size="xs" c="dimmed">
                  {formatDateTime(entry.changedAt)}
                  {entry.fromStatus
                    ? ` · desde ${RESERVATION_STATUS_LABELS[entry.fromStatus]}`
                    : ''}
                </Text>
                {entry.reason ? (
                  <Text size="sm">{entry.reason}</Text>
                ) : null}
              </Timeline.Item>
            ))}
          </Timeline>
        )}
      </Paper>

      <PaymentModal
        opened={paymentOpened}
        onClose={paymentHandlers.close}
        reservationId={reservation.id}
        suggestedAmount={
          balance ? parseFloat(balance.balance) : parseFloat(reservation.totalAmount)
        }
        onSaved={() => void load()}
      />
    </Stack>
  );
}
