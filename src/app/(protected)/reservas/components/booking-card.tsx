"use client";

import { useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { CalendarCheck, CalendarSync, Timer } from "lucide-react";
import { DateTime } from "luxon";
import type { ReservationResponseDtoStatusEnum } from "@/generated-client";
import { reservasApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatTime } from "@/lib/date-utils";
import {
  RESERVATION_STATUS_BG,
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";
import type { BookingItem } from "./use-reservas-dashboard";

interface BookingCardProps {
  item: BookingItem;
  onClick: (reservationId: number) => void;
  onSynced?: () => void;
  compact?: boolean;
}

function ElapsedTimer({ since }: { since: string }) {
  const [elapsed, setElapsed] = useState("");

  useEffect(() => {
    function calc() {
      const start = DateTime.fromISO(since, { zone: "America/Lima" });
      const now = DateTime.now().setZone("America/Lima");
      const diff = now.diff(start, ["hours", "minutes", "seconds"]);
      const h = Math.floor(diff.hours);
      const m = Math.floor(diff.minutes);
      const s = Math.floor(diff.seconds);
      if (h > 0) setElapsed(`${h}h ${String(m).padStart(2, "0")}m`);
      else setElapsed(`${m}m ${String(s).padStart(2, "0")}s`);
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [since]);

  return (
    <Group gap={4}>
      <Timer size={12} color="var(--mantine-color-grape-6)" />
      <Text size="xs" fw={700} c="grape">
        {elapsed}
      </Text>
    </Group>
  );
}

export function BookingCard({
  item,
  onClick,
  onSynced,
  compact,
}: BookingCardProps) {
  const [syncing, setSyncing] = useState(false);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `booking-${item.lineId}`, data: item });

  const statusKey = item.status as ReservationResponseDtoStatusEnum;
  const bg = RESERVATION_STATUS_BG[statusKey] ?? "transparent";

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 999,
        opacity: 0.85,
      }
    : undefined;

  const handleSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncing(true);
    try {
      const { data } = await reservasApi.reservationControllerSyncCalendar(
        item.reservationId,
      );
      notifications.show({
        title: data.synced ? "Sincronizado" : "Sin conexión",
        message: data.synced
          ? "Reserva enviada a Google Calendar."
          : "No hay cuenta de Calendar conectada.",
        color: data.synced ? "green" : "orange",
      });
      onSynced?.();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <Paper
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      p={compact ? "xs" : "sm"}
      radius="sm"
      withBorder
      style={{
        cursor: "grab",
        background: bg,
        ...(compact ? {} : { minWidth: 220 }),
        ...style,
        ...(isDragging ? { boxShadow: "var(--mantine-shadow-md)" } : {}),
      }}
      onClick={() => onClick(item.reservationId)}
    >
      <Stack gap={2} style={{ minWidth: 0 }}>
        <Group gap={4} justify="space-between" wrap="nowrap">
          <Text size="sm" fw={700} truncate style={{ flex: 1 }}>
            {item.customerName}
          </Text>
          <Tooltip
            label={
              item.hasCalendarEvent ? "En Calendar ✓" : "Sincronizar Calendar"
            }
            withArrow
            position="top"
          >
            <ActionIcon
              size="xs"
              variant="subtle"
              color={item.hasCalendarEvent ? "teal" : "gray"}
              loading={syncing}
              onClick={(e) => void handleSync(e)}
            >
              {item.hasCalendarEvent ? (
                <CalendarCheck size={13} />
              ) : (
                <CalendarSync size={13} />
              )}
            </ActionIcon>
          </Tooltip>
        </Group>
        <Group gap={6} justify="space-between" wrap="nowrap">
          <Group gap={6} wrap="nowrap" style={{ minWidth: 0 }}>
            <Text size="xs" c="dimmed">
              {formatTime(item.startTime)}–{formatTime(item.endTime)}
            </Text>
            <Badge
              size="xs"
              color={RESERVATION_STATUS_COLORS[statusKey] ?? "gray"}
            >
              {RESERVATION_STATUS_LABELS[statusKey] ?? item.status}
            </Badge>
          </Group>
          {item.status === "in_service" && (
            <ElapsedTimer since={item.startTime} />
          )}
        </Group>
        <Text size="xs" truncate>
          {item.serviceName}
        </Text>
      </Stack>
    </Paper>
  );
}
