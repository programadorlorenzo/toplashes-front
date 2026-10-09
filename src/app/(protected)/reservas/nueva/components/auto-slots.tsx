"use client";

import { Group, Stack, Text, UnstyledButton } from "@mantine/core";
import type { AvailableSlotResponseDto } from "@/generated-client";
import { formatTime } from "@/lib/date-utils";
import type { SelectedServiceSlot } from "./step-availability";

interface AutoSlotsProps {
  byEmployee: Map<number, AvailableSlotResponseDto[]>;
  selected: SelectedServiceSlot | undefined;
  onPick: (slot: AvailableSlotResponseDto) => void;
}

export function AutoSlots({ byEmployee, selected, onPick }: AutoSlotsProps) {
  return (
    <Stack gap="sm">
      {[...byEmployee.entries()].map(([employeeId, slots]) => (
        <Stack key={employeeId} gap={6}>
          <Text size="sm" fw={500}>
            {slots[0]?.employeeName ?? `Colaboradora #${employeeId}`}
          </Text>
          <Group gap="xs" wrap="wrap">
            {slots.map((slot) => {
              const isActive =
                selected?.startTime === slot.startTime &&
                selected.employeeId === slot.employeeId;
              return (
                <UnstyledButton
                  key={`${slot.employeeId}-${slot.startTime}`}
                  onClick={() => onPick(slot)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: "var(--mantine-radius-sm)",
                    border: `1px solid ${
                      isActive ? "hsl(var(--tl-taupe))" : "hsl(var(--border))"
                    }`,
                    backgroundColor: isActive
                      ? "hsl(var(--muted))"
                      : "transparent",
                  }}
                >
                  <Text size="sm">
                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                  </Text>
                </UnstyledButton>
              );
            })}
          </Group>
        </Stack>
      ))}
    </Stack>
  );
}
