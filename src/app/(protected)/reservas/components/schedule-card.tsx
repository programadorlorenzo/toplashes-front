"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  ActionIcon,
  Badge,
  Button,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import {
  CalendarClock,
  ChevronDown,
  ChevronUp,
  Plus,
  UserCircle,
} from "lucide-react";
import { BookingCard } from "./booking-card";
import { TimeSlotGrid } from "./time-slot-grid";
import type { BookingItem } from "./use-reservas-dashboard";

interface ScheduleCardProps {
  employeeId: number;
  employeeName: string;
  bookings: BookingItem[];
  openTime: string;
  closeTime: string;
  onBookingClick: (reservationId: number) => void;
  onNewReservation: () => void;
  onSlotSelected: (startTime: string, endTime: string) => void;
}

export function ScheduleCard({
  employeeId,
  employeeName,
  bookings,
  openTime,
  closeTime,
  onBookingClick,
  onNewReservation,
  onSlotSelected,
}: ScheduleCardProps) {
  const [slotsOpen, setSlotsOpen] = useState(false);

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

        {active.length > 0 && (
          <Stack gap={4}>
            {active.map((b) => (
              <BookingCard
                key={b.lineId}
                item={b}
                onClick={onBookingClick}
                compact
              />
            ))}
          </Stack>
        )}

        {isOver && (
          <Text size="xs" c="green" ta="center" fw={600}>
            Soltar para asignar a {employeeName}
          </Text>
        )}

        <Group gap="xs" mt="auto">
          <Button
            variant="light"
            size="xs"
            leftSection={<Plus size={14} />}
            onClick={onNewReservation}
            style={{ flex: 1 }}
          >
            Nueva reserva
          </Button>
          <ActionIcon
            variant="light"
            size="sm"
            onClick={() => setSlotsOpen((v) => !v)}
            aria-label="Ver horarios disponibles"
          >
            {slotsOpen ? <ChevronUp size={14} /> : <CalendarClock size={14} />}
          </ActionIcon>
        </Group>

        <Collapse expanded={slotsOpen}>
          <TimeSlotGrid
            openTime={openTime}
            closeTime={closeTime}
            bookings={active}
            onRangeSelected={onSlotSelected}
          />
        </Collapse>
      </Stack>
    </Paper>
  );
}
