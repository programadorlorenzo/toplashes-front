"use client";

import { useDraggable } from "@dnd-kit/core";
import { Badge, Group, Paper, Stack, Text } from "@mantine/core";
import { GripVertical } from "lucide-react";
import type { ReservationResponseDtoStatusEnum } from "@/generated-client";
import { formatTime } from "@/lib/date-utils";
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";
import type { BookingItem } from "./use-reservas-dashboard";

interface DraggableBookingProps {
  item: BookingItem;
  onClick: (id: number) => void;
}

export function DraggableBooking({ item, onClick }: DraggableBookingProps) {
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
      p="sm"
      radius="sm"
      withBorder
      style={{
        cursor: "grab",
        minWidth: 220,
        ...style,
        ...(isDragging ? { boxShadow: "var(--mantine-shadow-md)" } : {}),
      }}
      onClick={() => onClick(item.reservationId)}
    >
      <Group gap="xs" wrap="nowrap">
        <div {...listeners} {...attributes} style={{ cursor: "grab" }}>
          <GripVertical size={14} style={{ opacity: 0.4 }} />
        </div>
        <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
          <Group gap="xs">
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
          <Text size="xs" fw={500}>
            {item.serviceName}
          </Text>
          <Text size="xs" c="dimmed">
            {item.customerName}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
