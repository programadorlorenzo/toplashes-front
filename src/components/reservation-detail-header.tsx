"use client";

import Image from "next/image";
import { Badge, Box, Group, Stack, Text } from "@mantine/core";
import { CalendarCheck } from "lucide-react";
import type { ReservationResponseDto } from "@/generated-client";
import { formatDate } from "@/lib/date-utils";
import {
  RESERVATION_CHANNEL_LABELS,
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";

interface ReservationDetailHeaderProps {
  reservation: ReservationResponseDto;
  isPaid: boolean;
}

export function ReservationDetailHeader({
  reservation,
  isPaid,
}: ReservationDetailHeaderProps) {
  return (
    <Box
      px="lg"
      py="md"
      style={{
        background:
          "linear-gradient(135deg, hsl(28 11% 60%) 0%, hsl(24 10% 48%) 100%)",
        borderRadius: "var(--mantine-radius-md) var(--mantine-radius-md) 0 0",
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
              style={{ objectFit: "contain", borderRadius: "4px" }}
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
  );
}
