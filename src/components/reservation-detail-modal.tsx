"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Anchor,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  Calendar,
  CalendarCheck,
  CalendarSync,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Scissors,
  Undo2,
  User,
} from "lucide-react";
import type {
  BranchResponseDto,
  CustomerResponseDto,
  EmployeeResponseDto,
  PaymentResponseDto,
  ReservationBalanceResponseDto,
  ReservationResponseDto,
  ReservationResponseDtoStatusEnum,
  ServiceResponseDto,
} from "@/generated-client";
import {
  clientesApi,
  colaboradorasApi,
  pagosApi,
  reservasApi,
  serviciosApi,
  sucursalesApi,
} from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";
import { formatDate, formatDateTime, formatTime } from "@/lib/date-utils";
import { formatSoles, whatsappUrl } from "@/lib/format";
import { hasAnyPermission } from "@/lib/permissions";
import {
  getAllowedStatusTransitions,
  RESERVATION_CHANNEL_LABELS,
  RESERVATION_STATUS_ACTION_LABELS,
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
  REVERT_TRANSITIONS,
} from "@/lib/reservation-utils";
import { useAuthStore } from "@/stores/auth-store";
import { PaymentModal } from "@/components/payment-modal";

interface ReservationDetailModalProps {
  opened: boolean;
  onClose: () => void;
  reservationId: number | null;
  onUpdated?: () => void;
}

export function ReservationDetailModal({
  opened,
  onClose,
  reservationId,
  onUpdated,
}: ReservationDetailModalProps) {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canUpdate = hasAnyPermission(permissions, ["reservations.update"]);
  const canCancel = hasAnyPermission(permissions, ["reservations.cancel"]);
  const canPay = hasAnyPermission(permissions, ["payments.create"]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [reservation, setReservation] = useState<ReservationResponseDto | null>(
    null,
  );
  const [customer, setCustomer] = useState<CustomerResponseDto | null>(null);
  const [branch, setBranch] = useState<BranchResponseDto | null>(null);
  const [services, setServices] = useState<ServiceResponseDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [balance, setBalance] = useState<ReservationBalanceResponseDto | null>(
    null,
  );
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
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
    if (!reservationId) return;
    setLoading(true);
    try {
      const [reservationRes, servicesRes, employeesRes] = await Promise.all([
        reservasApi.reservationControllerFindOne(reservationId),
        serviciosApi.serviceControllerFindAll(),
        colaboradorasApi.employeeControllerFindAll(),
      ]);
      const resData = reservationRes.data;
      setReservation(resData);
      setServices(servicesRes.data);
      setEmployees(employeesRes.data);

      const [customerRes, branchRes] = await Promise.all([
        clientesApi.customerControllerFindOne(resData.customerId),
        sucursalesApi.branchControllerFindOne(resData.branchId),
      ]);
      setCustomer(customerRes.data);
      setBranch(branchRes.data);

      try {
        const [balanceRes, paymentsRes] = await Promise.all([
          pagosApi.paymentControllerGetReservationBalance(reservationId),
          pagosApi.paymentControllerFindByReservation(reservationId),
        ]);
        setBalance(balanceRes.data);
        setPayments(paymentsRes.data);
      } catch {
        setBalance({
          totalAmount: resData.totalAmount,
          discount: resData.discount,
          totalPaid: "0.00",
          balance: resData.totalAmount,
        });
        setPayments([]);
      }
    } catch (error) {
      notifications.show({
        title: "Error al cargar reserva",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    if (opened && reservationId) {
      void load();
    }
  }, [opened, reservationId, load]);

  const handleStatus = async (status: ReservationResponseDtoStatusEnum) => {
    if (!reservation) return;
    setUpdating(true);
    try {
      if (status === "cancelled") {
        await reservasApi.reservationControllerCancel(reservation.id, {});
      } else {
        await reservasApi.reservationControllerUpdateStatus(reservation.id, {
          status,
        });
      }
      notifications.show({
        title: "Estado actualizado",
        color: "green",
        message: RESERVATION_STATUS_LABELS[status],
      });
      await load();
      onUpdated?.();
    } catch (error) {
      notifications.show({
        title: "No se pudo cambiar el estado",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSyncCalendar = async () => {
    if (!reservation) return;
    setSyncing(true);
    try {
      const { data } = await reservasApi.reservationControllerSyncCalendar(
        reservation.id,
      );
      if (data.synced) {
        notifications.show({
          title: "Sincronizado",
          message: "Reserva sincronizada con Google Calendar.",
          color: "green",
        });
      } else {
        notifications.show({
          title: "No sincronizado",
          message:
            "No hay cuenta de Google Calendar conectada para este local.",
          color: "orange",
        });
      }
      await load();
    } catch (error) {
      notifications.show({
        title: "Error de sincronización",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setSyncing(false);
    }
  };

  const transitions = reservation
    ? getAllowedStatusTransitions(reservation.status).filter(
        (status) =>
          (status !== "cancelled" || canCancel) &&
          status !== REVERT_TRANSITIONS[reservation.status],
      )
    : [];

  const revertTo = reservation
    ? REVERT_TRANSITIONS[reservation.status]
    : undefined;

  const balanceAmount = parseFloat(
    balance?.balance ?? reservation?.totalAmount ?? "0",
  );
  const isPaid = balanceAmount <= 0;

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        size="lg"
        centered
        withCloseButton={false}
        padding={0}
        radius="md"
        styles={{
          body: { padding: 0 },
        }}
      >
        {loading || !reservation ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : (
          <>
            {/* Header con logo y estado */}
            <Box
              px="lg"
              py="md"
              style={{
                background:
                  "linear-gradient(135deg, hsl(28 11% 60%) 0%, hsl(24 10% 48%) 100%)",
                borderRadius:
                  "var(--mantine-radius-md) var(--mantine-radius-md) 0 0",
              }}
            >
              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <Box
                    style={{
                      width: 36,
                      height: 36,
                      position: "relative",
                      filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.2))",
                    }}
                  >
                    <Image
                      src="/brand/logo-toplashes.jpg"
                      alt="Top Lashes"
                      fill
                      sizes="36px"
                      style={{
                        objectFit: "contain",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                  <Stack gap={0}>
                    <Text size="sm" fw={600} c="white">
                      Reserva #{reservation.id}
                    </Text>
                    <Text size="xs" c="rgba(255,255,255,0.7)">
                      {formatDate(reservation.date)} ·{" "}
                      {RESERVATION_CHANNEL_LABELS[reservation.channel]}
                    </Text>
                  </Stack>
                </Group>
                <Group gap="xs">
                  <Badge
                    color={RESERVATION_STATUS_COLORS[reservation.status]}
                    size="lg"
                    variant="filled"
                    radius="sm"
                  >
                    {RESERVATION_STATUS_LABELS[reservation.status]}
                  </Badge>
                  {reservation.googleCalendarEventId ? (
                    <Badge
                      color="teal"
                      size="lg"
                      variant="light"
                      radius="sm"
                      leftSection={<CalendarCheck size={12} />}
                    >
                      Calendar
                    </Badge>
                  ) : null}
                  {isPaid ? (
                    <Badge color="green" size="lg" variant="filled" radius="sm">
                      Pagado
                    </Badge>
                  ) : null}
                </Group>
              </Group>
            </Box>

            <Stack gap={0} px="lg" py="md">
              {/* Info cards */}
              <Group grow wrap="wrap" gap="sm" mb="md">
                <Paper
                  p="sm"
                  radius="sm"
                  withBorder
                  style={{ borderColor: "hsl(30 14% 88%)" }}
                >
                  <Group gap="xs" mb={4}>
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color="gray"
                      radius="xl"
                    >
                      <User size={12} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" fw={600}>
                      Clienta
                    </Text>
                  </Group>
                  {customer ? (
                    <>
                      <Text size="sm" fw={500}>
                        {customer.firstName} {customer.lastName}
                      </Text>
                      <Anchor
                        href={whatsappUrl(customer.whatsapp)}
                        target="_blank"
                        size="xs"
                      >
                        <Group gap={4}>
                          <Phone size={11} />
                          {customer.whatsapp}
                        </Group>
                      </Anchor>
                    </>
                  ) : (
                    <Text size="sm" c="dimmed">
                      —
                    </Text>
                  )}
                </Paper>

                <Paper
                  p="sm"
                  radius="sm"
                  withBorder
                  style={{ borderColor: "hsl(30 14% 88%)" }}
                >
                  <Group gap="xs" mb={4}>
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color="gray"
                      radius="xl"
                    >
                      <MapPin size={12} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" fw={600}>
                      Local
                    </Text>
                  </Group>
                  <Text size="sm" fw={500}>
                    {branch?.name ?? `Local ${reservation.branchId}`}
                  </Text>
                </Paper>

                <Paper
                  p="sm"
                  radius="sm"
                  withBorder
                  style={{ borderColor: "hsl(30 14% 88%)" }}
                >
                  <Group gap="xs" mb={4}>
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color="gray"
                      radius="xl"
                    >
                      <CreditCard size={12} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" fw={600}>
                      Pago
                    </Text>
                  </Group>
                  <Text size="sm" fw={600}>
                    {formatSoles(
                      parseFloat(
                        balance?.totalAmount ?? reservation.totalAmount,
                      ),
                    )}
                  </Text>
                  {isPaid ? (
                    <Group gap={4}>
                      <CheckCircle size={12} color="green" />
                      <Text size="xs" c="green" fw={500}>
                        Pagado completo
                      </Text>
                    </Group>
                  ) : (
                    <Text size="xs" c="red" fw={500}>
                      Saldo: {formatSoles(balanceAmount)}
                    </Text>
                  )}
                </Paper>
              </Group>

              {/* Servicios */}
              <Paper
                p="sm"
                radius="sm"
                mb="md"
                withBorder
                style={{ borderColor: "hsl(30 14% 88%)" }}
              >
                <Group gap="xs" mb="xs">
                  <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
                    <Scissors size={12} />
                  </ThemeIcon>
                  <Text size="xs" c="dimmed" fw={600}>
                    Servicios
                  </Text>
                </Group>
                <Stack gap={6}>
                  {reservation.services.map((line) => (
                    <Group key={line.id} justify="space-between" wrap="nowrap">
                      <Stack gap={0}>
                        <Text size="sm" fw={500}>
                          {servicesById[line.serviceId]?.name ??
                            `Servicio #${line.serviceId}`}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {line.employeeId !== null
                            ? (employeeNames[line.employeeId] ?? "Colaboradora")
                            : "Sin asignar"}
                        </Text>
                      </Stack>
                      <Stack gap={0} align="flex-end">
                        <Text size="sm" fw={500}>
                          {formatSoles(parseFloat(line.agreedPrice))}
                        </Text>
                        <Group gap={4}>
                          <Clock size={11} />
                          <Text size="xs" c="dimmed">
                            {formatTime(line.startTime)} –{" "}
                            {formatTime(line.endTime)}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
                {reservation.notes ? (
                  <>
                    <Divider my="xs" />
                    <Text size="xs" c="dimmed" fs="italic">
                      {reservation.notes}
                    </Text>
                  </>
                ) : null}
              </Paper>

              {/* Movimientos de pago */}
              {payments.length > 0 ? (
                <Paper
                  p="sm"
                  radius="sm"
                  mb="md"
                  withBorder
                  style={{ borderColor: "hsl(30 14% 88%)" }}
                >
                  <Text size="xs" c="dimmed" fw={600} mb="xs">
                    Movimientos de pago
                  </Text>
                  {payments.map((p) => (
                    <Group key={p.id} justify="space-between">
                      <Text size="xs" c="dimmed">
                        {formatDateTime(p.createdAt)}
                      </Text>
                      <Text size="xs" fw={500}>
                        {formatSoles(parseFloat(p.amount))}
                      </Text>
                    </Group>
                  ))}
                </Paper>
              ) : null}

              {/* Historial de estados */}
              {(reservation.statusHistory?.length ?? 0) > 0 ? (
                <Paper
                  p="sm"
                  radius="sm"
                  mb="md"
                  withBorder
                  style={{ borderColor: "hsl(30 14% 88%)" }}
                >
                  <Group gap="xs" mb="xs">
                    <ThemeIcon
                      size="sm"
                      variant="light"
                      color="gray"
                      radius="xl"
                    >
                      <Calendar size={12} />
                    </ThemeIcon>
                    <Text size="xs" c="dimmed" fw={600}>
                      Historial
                    </Text>
                  </Group>
                  <Timeline
                    active={reservation.statusHistory!.length - 1}
                    bulletSize={14}
                    lineWidth={2}
                    color="gray"
                  >
                    {reservation.statusHistory!.map((entry) => (
                      <Timeline.Item
                        key={entry.id}
                        title={
                          <Text size="xs" fw={500}>
                            {RESERVATION_STATUS_LABELS[entry.toStatus]}
                          </Text>
                        }
                      >
                        <Text size="xs" c="dimmed">
                          {formatDateTime(entry.changedAt)}
                          {entry.fromStatus
                            ? ` · desde ${RESERVATION_STATUS_LABELS[entry.fromStatus]}`
                            : ""}
                        </Text>
                        {entry.reason ? (
                          <Text size="xs">{entry.reason}</Text>
                        ) : null}
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Paper>
              ) : null}

              {/* Acciones */}
              <Divider mb="sm" />
              <Group justify="flex-end" gap="xs">
                {canUpdate && revertTo ? (
                  <Button
                    variant="subtle"
                    size="xs"
                    color="orange"
                    leftSection={<Undo2 size={14} />}
                    loading={updating}
                    onClick={() => void handleStatus(revertTo)}
                  >
                    Revertir a {RESERVATION_STATUS_LABELS[revertTo]}
                  </Button>
                ) : null}
                {canUpdate ? (
                  <Button
                    variant="subtle"
                    size="xs"
                    color={reservation.googleCalendarEventId ? "teal" : "gray"}
                    leftSection={<CalendarSync size={14} />}
                    loading={syncing}
                    onClick={() => void handleSyncCalendar()}
                  >
                    {reservation.googleCalendarEventId
                      ? "Resincronizar"
                      : "Sincronizar Calendar"}
                  </Button>
                ) : null}
                <div style={{ flex: 1 }} />
                {canPay && !isPaid ? (
                  <Button
                    variant="light"
                    size="xs"
                    leftSection={<CreditCard size={14} />}
                    onClick={paymentHandlers.open}
                  >
                    Registrar pago
                  </Button>
                ) : null}
                {canUpdate
                  ? transitions.map((status) => (
                      <Button
                        key={status}
                        size="xs"
                        variant={status === "cancelled" ? "outline" : "filled"}
                        color={status === "cancelled" ? "red" : undefined}
                        styles={
                          status === "cancelled"
                            ? undefined
                            : primaryButtonStyles
                        }
                        loading={updating}
                        onClick={() => void handleStatus(status)}
                      >
                        {RESERVATION_STATUS_ACTION_LABELS[status] ??
                          RESERVATION_STATUS_LABELS[status]}
                      </Button>
                    ))
                  : null}
                <Button variant="default" size="xs" onClick={onClose}>
                  Cerrar
                </Button>
              </Group>
            </Stack>
          </>
        )}
      </Modal>

      <PaymentModal
        opened={paymentOpened}
        onClose={paymentHandlers.close}
        reservationId={reservationId ?? 0}
        suggestedAmount={
          balance
            ? parseFloat(balance.balance)
            : parseFloat(reservation?.totalAmount ?? "0")
        }
        onSaved={() => void load()}
      />
    </>
  );
}
