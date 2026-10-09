"use client";

import { useDroppable } from "@dnd-kit/core";
import { Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { Plus, UserCircle } from "lucide-react";
import type { ReservationResponseDtoStatusEnum } from "@/generated-client";
import { formatTime } from "@/lib/date-utils";
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";
import type { BookingItem } from "./use-reservas-dashboard";

interface ScheduleCardProps {
  employeeId: number;
  employeeName: string;
  bookings: BookingItem[];
  onBookingClick: (reservationId: number) => void;
  onNewReservation: () => void;
}

export function ScheduleCard({
  employeeId,
  employeeName,
  bookings,
  onBookingClick,
  onNewReservation,
}: ScheduleCardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `employee-${employeeId}`,
    data: { employeeId },
  });

  const active = bookings.filter(
    (b) => b.status !== "cancelled" && b.status !== "no_show",
  );
  const pending = active.filter(
    (b) => b.status === "pending_confirmation" || b.status === "confirmed",
  ).length;
  const inService = active.filter(
    (b) => b.status === "in_service" || b.status === "client_present",
  ).length;

  return (
    <Paper
      ref={setNodeRef}
      withBorder
      p="md"
      radius="md"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 150ms ease, border-color 150ms ease",
        ...(isOver
          ? {
              borderColor: "var(--mantine-color-green-5)",
              boxShadow: "0 0 0 2px var(--mantine-color-green-2)",
            }
          : {}),
      }}
    >
      <Stack gap="sm" style={{ flex: 1 }}>
        <Group justify="space-between">
          <Group gap="xs">
            <UserCircle size={20} style={{ opacity: 0.6 }} />
            <Text fw={700}>{employeeName}</Text>
          </Group>
          <Group gap={4}>
            {pending > 0 && (
              <Badge size="xs" color="yellow" variant="filled">
                {pending} pend.
              </Badge>
            )}
            {inService > 0 && (
              <Badge size="xs" color="grape" variant="filled">
                {inService} en serv.
              </Badge>
            )}
          </Group>
        </Group>

        {active.length === 0 ? (
          <Text size="sm" c="dimmed" fs="italic" py="lg" ta="center">
            {isOver ? "Soltar aquí para asignar" : "Día libre — sin citas"}
          </Text>
        ) : (
          <Stack gap={6}>
            {active.map((b) => (
              <Paper
                key={b.lineId}
                p="xs"
                radius="sm"
                withBorder
                style={{ cursor: "pointer" }}
                onClick={() => onBookingClick(b.reservationId)}
              >
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                    <Group gap={6}>
                      <Text size="sm" fw={600}>
                        {formatTime(b.startTime)}–{formatTime(b.endTime)}
                      </Text>
                      <Badge
                        size="xs"
                        color={
                          RESERVATION_STATUS_COLORS[
                            b.status as ReservationResponseDtoStatusEnum
                          ] ?? "gray"
                        }
                      >
                        {RESERVATION_STATUS_LABELS[
                          b.status as ReservationResponseDtoStatusEnum
                        ] ?? b.status}
                      </Badge>
                    </Group>
                    <Text size="xs" truncate>
                      {b.serviceName}
                    </Text>
                    <Text size="xs" c="dimmed" truncate>
                      {b.customerName}
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            ))}
          </Stack>
        )}

        {isOver && active.length > 0 && (
          <Text size="xs" c="green" ta="center" fw={600}>
            Soltar para asignar a {employeeName}
          </Text>
        )}

        <Button
          variant="light"
          size="xs"
          leftSection={<Plus size={14} />}
          onClick={onNewReservation}
          fullWidth
          mt="auto"
        >
          Nueva reserva
        </Button>
      </Stack>
    </Paper>
  );
}
