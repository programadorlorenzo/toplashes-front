"use client";

import { useDraggable } from "@dnd-kit/core";
import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import type { ReservationResponseDtoStatusEnum } from "@/generated-client";
import { formatTime } from "@/lib/date-utils";
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";
import type { BookingItem } from "./use-reservas-dashboard";

interface DraggableBookingCompactProps {
  item: BookingItem;
  onClick: (id: number) => void;
}

export function DraggableBookingCompact({
  item,
  onClick,
}: DraggableBookingCompactProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `booking-${item.lineId}`, data: item });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 999,
        opacity: 0.85,
      }
    : undefined;

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      p="xs"
      radius="sm"
      withBorder
      style={{
        cursor: "grab",
        ...style,
        ...(isDragging ? { boxShadow: "var(--mantine-shadow-md)" } : {}),
      }}
      onClick={() => onClick(item.reservationId)}
    >
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
          <Group gap={6}>
            <Text size="sm" fw={600}>
              {formatTime(item.startTime)}–{formatTime(item.endTime)}
            </Text>
            <Badge
              size="xs"
              color={
                RESERVATION_STATUS_COLORS[
                  item.status as ReservationResponseDtoStatusEnum
                ] ?? "gray"
              }
            >
              {RESERVATION_STATUS_LABELS[
                item.status as ReservationResponseDtoStatusEnum
              ] ?? item.status}
            </Badge>
          </Group>
          <Text size="xs" truncate>
            {item.serviceName}
          </Text>
          <Text size="xs" c="dimmed" truncate>
            {item.customerName}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
