"use client";

import {
  Anchor,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
} from "@mantine/core";
import {
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Scissors,
  User,
} from "lucide-react";
import type {
  BranchResponseDto,
  CustomerResponseDto,
  PaymentResponseDto,
  ReservationBalanceResponseDto,
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { formatDate, formatDateTime, formatTime } from "@/lib/date-utils";
import { formatSoles, whatsappUrl } from "@/lib/format";
import { RESERVATION_STATUS_LABELS } from "@/lib/reservation-utils";

const borderStyle = { borderColor: "hsl(30 14% 88%)" };

interface ReservationDetailBodyProps {
  reservation: ReservationResponseDto;
  customer: CustomerResponseDto | null;
  branch: BranchResponseDto | null;
  balance: ReservationBalanceResponseDto | null;
  payments: PaymentResponseDto[];
  servicesById: Record<number, ServiceResponseDto>;
  employeeNames: Record<number, string>;
  isPaid: boolean;
  balanceAmount: number;
}

export function ReservationDetailBody({
  reservation,
  customer,
  branch,
  balance,
  payments,
  servicesById,
  employeeNames,
  isPaid,
  balanceAmount,
}: ReservationDetailBodyProps) {
  return (
    <>
      <Group grow wrap="wrap" gap="sm" mb="md">
        <Paper p="sm" radius="sm" withBorder style={borderStyle}>
          <Group gap="xs" mb={4}>
            <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
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

        <Paper p="sm" radius="sm" withBorder style={borderStyle}>
          <Group gap="xs" mb={4}>
            <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
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

        <Paper p="sm" radius="sm" withBorder style={borderStyle}>
          <Group gap="xs" mb={4}>
            <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
              <CreditCard size={12} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" fw={600}>
              Pago
            </Text>
          </Group>
          <Text size="sm" fw={600}>
            {formatSoles(
              parseFloat(balance?.totalAmount ?? reservation.totalAmount),
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

      <Paper p="sm" radius="sm" mb="md" withBorder style={borderStyle}>
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
                    {formatTime(line.startTime)} – {formatTime(line.endTime)}
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

      {payments.length > 0 ? (
        <Paper p="sm" radius="sm" mb="md" withBorder style={borderStyle}>
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

      {(reservation.statusHistory?.length ?? 0) > 0 ? (
        <Paper p="sm" radius="sm" mb="md" withBorder style={borderStyle}>
          <Group gap="xs" mb="xs">
            <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
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
                {entry.reason ? <Text size="xs">{entry.reason}</Text> : null}
              </Timeline.Item>
            ))}
          </Timeline>
        </Paper>
      ) : null}
    </>
  );
}
