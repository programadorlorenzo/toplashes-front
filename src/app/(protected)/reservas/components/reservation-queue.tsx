"use client";

import { useDroppable } from "@dnd-kit/core";
import { Badge, Button, Group, Paper, Stack, Text } from "@mantine/core";
import { Clock, Plus } from "lucide-react";
import { BookingCard } from "./booking-card";
import type { BookingItem } from "./use-reservas-dashboard";

interface ReservationQueueProps {
  items: BookingItem[];
  onViewReservation: (id: number) => void;
  onNewReservation: () => void;
  onSynced?: () => void;
}

export function ReservationQueue({
  items,
  onViewReservation,
  onNewReservation,
  onSynced,
}: ReservationQueueProps) {
  const active = items.filter(
    (i) => i.status !== "cancelled" && i.status !== "no_show",
  );

  const { setNodeRef, isOver } = useDroppable({ id: "queue" });

  return (
    <Paper
      ref={setNodeRef}
      withBorder
      p="md"
      radius="md"
      style={{
        transition: "box-shadow 150ms ease, border-color 150ms ease",
        ...(isOver
          ? {
              borderColor: "var(--mantine-color-yellow-5)",
              boxShadow: "0 0 0 2px var(--mantine-color-yellow-2)",
            }
          : {}),
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between">
          <Group gap="xs">
            <Clock size={18} style={{ opacity: 0.6 }} />
            <Text fw={700}>Cola de reservas</Text>
            <Badge size="sm" color="gray" variant="light">
              {active.length}
            </Badge>
            <Text size="sm" c="dimmed">
              arrastra a una colaboradora para asignar
            </Text>
          </Group>
          <Button
            variant="light"
            size="xs"
            leftSection={<Plus size={14} />}
            onClick={onNewReservation}
          >
            Agregar a cola
          </Button>
        </Group>

        {active.length === 0 ? (
          <Text size="sm" c="dimmed" fs="italic" ta="center" py="sm">
            No hay reservas en cola
          </Text>
        ) : (
          <Group gap="sm" wrap="wrap">
            {active.map((item) => (
              <BookingCard
                key={item.lineId}
                item={item}
                onClick={onViewReservation}
                onSynced={onSynced}
              />
            ))}
          </Group>
        )}
      </Stack>
    </Paper>
  );
}
