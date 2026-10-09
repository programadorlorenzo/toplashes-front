"use client";

import {
  Badge,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { CalendarCheck, Hash, Scissors } from "lucide-react";
import type {
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { formatDate, formatTime } from "@/lib/date-utils";
import { formatSoles } from "@/lib/format";
import {
  RESERVATION_CHANNEL_LABELS,
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";

const borderStyle = { borderColor: "hsl(30 14% 88%)" };
const iconColor = { color: "hsl(var(--tl-brown-medium))" };

export function MiniStat({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Paper p="xs" radius="sm" withBorder style={borderStyle}>
      <Group gap="xs" wrap="nowrap">
        <ThemeIcon size="sm" variant="light" color={color} radius="xl">
          {icon}
        </ThemeIcon>
        <Stack gap={0}>
          <Text size="xs" c="dimmed" lh={1.2}>
            {label}
          </Text>
          <Text size="sm" fw={600} lh={1.2}>
            {value}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}

export function ReservationCard({
  r,
  servicesById,
  onClick,
}: {
  r: ReservationResponseDto;
  servicesById: Record<number, ServiceResponseDto>;
  onClick?: () => void;
}) {
  const timeLabel = r.services[0] ? formatTime(r.services[0].startTime) : "—";
  return (
    <UnstyledButton
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <Paper p="sm" radius="sm" withBorder style={borderStyle}>
        <Group justify="space-between" align="flex-start">
          <Stack gap={4} style={{ flex: 1 }}>
            <Group gap="xs" wrap="nowrap">
              <CalendarCheck size={13} style={iconColor} />
              <Text size="sm" fw={600}>
                {formatDate(r.date)}
              </Text>
              <Text size="xs" c="dimmed">
                {timeLabel}
              </Text>
              <Text size="xs" c="dimmed">
                · {RESERVATION_CHANNEL_LABELS[r.channel] ?? r.channel}
              </Text>
            </Group>
            <Group gap={4} wrap="wrap">
              <Scissors size={12} style={iconColor} />
              {r.services.map((line, idx) => (
                <Text key={line.id} size="xs" c="dimmed">
                  {servicesById[line.serviceId]?.name ??
                    `Servicio #${line.serviceId}`}
                  {idx < r.services.length - 1 ? "," : ""}
                </Text>
              ))}
            </Group>
          </Stack>
          <Stack gap={4} align="flex-end">
            <Badge
              size="sm"
              variant="light"
              color={RESERVATION_STATUS_COLORS[r.status]}
            >
              {RESERVATION_STATUS_LABELS[r.status]}
            </Badge>
            <Group gap={4}>
              <Hash size={11} style={iconColor} />
              <Text size="xs" c="dimmed">
                {r.id}
              </Text>
            </Group>
            <Text size="sm" fw={600}>
              {formatSoles(parseFloat(r.totalAmount))}
            </Text>
          </Stack>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}
