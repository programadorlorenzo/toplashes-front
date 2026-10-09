"use client";

import { Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { UserCircle } from "lucide-react";
import { formatTime } from "@/lib/date-utils";
import type { ReservationResponseDtoStatusEnum } from "@/generated-client";
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";

export interface EmployeeBooking {
  startTime: string;
  endTime: string;
  serviceName: string;
  status: ReservationResponseDtoStatusEnum;
}

interface EmployeeDayCardProps {
  name: string;
  bookings: EmployeeBooking[];
  time: string;
  onTimeChange: (value: string) => void;
  onSelect: () => void;
  isSelected: boolean;
  serviceDuration?: number;
}

export function EmployeeDayCard({
  name,
  bookings,
  time,
  onTimeChange,
  onSelect,
  isSelected,
  serviceDuration,
}: EmployeeDayCardProps) {
  const activeBookings = bookings.filter(
    (b) => b.status !== "cancelled" && b.status !== "no_show",
  );

  return (
    <Paper
      withBorder
      p="sm"
      radius="md"
      style={{
        border: isSelected
          ? "2px solid hsl(var(--tl-taupe))"
          : "1px solid hsl(var(--border))",
        backgroundColor: isSelected ? "hsl(var(--muted) / 0.3)" : undefined,
        transition: "border-color 0.15s",
      }}
    >
      <Stack gap="xs">
        <Group gap="xs">
          <UserCircle size={16} style={{ opacity: 0.6 }} />
          <Text fw={600} size="sm">
            {name}
          </Text>
        </Group>

        {activeBookings.length > 0 ? (
          <Stack gap={4}>
            {activeBookings.map((b, i) => (
              <Group key={i} gap={6} wrap="nowrap">
                <Badge
                  size="xs"
                  color={RESERVATION_STATUS_COLORS[b.status] ?? "gray"}
                  variant="dot"
                  style={{ flexShrink: 0 }}
                >
                  {formatTime(b.startTime)}–{formatTime(b.endTime)}
                </Badge>
                <Text size="xs" truncate style={{ flex: 1, minWidth: 0 }}>
                  {b.serviceName}
                </Text>
                <Badge size="xs" color={RESERVATION_STATUS_COLORS[b.status]}>
                  {RESERVATION_STATUS_LABELS[b.status]}
                </Badge>
              </Group>
            ))}
          </Stack>
        ) : (
          <Text size="xs" c="dimmed" fs="italic">
            Sin citas hoy
          </Text>
        )}

        <Group gap="xs" align="flex-end" mt={4}>
          <TimeInput
            size="xs"
            value={time}
            onChange={(e) => onTimeChange(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Button
            size="compact-xs"
            variant="light"
            onClick={onSelect}
            disabled={!time}
          >
            + Reservar
          </Button>
        </Group>
        {time && serviceDuration ? (
          <Text size="xs" c="dimmed">
            Fin est. ~{serviceDuration} min
          </Text>
        ) : null}
      </Stack>
    </Paper>
  );
}
