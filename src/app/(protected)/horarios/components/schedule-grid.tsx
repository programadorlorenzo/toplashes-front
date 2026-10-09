"use client";

import { Button, Group, Stack, Table, Text, TextInput } from "@mantine/core";
import { WORK_DAYS } from "@/lib/constants";
import type { ScheduleResponseDto } from "@/generated-client";

export interface DayScheduleDraft {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  scheduleId?: number;
}

interface ScheduleGridProps {
  drafts: DayScheduleDraft[];
  onChange: (
    dayOfWeek: number,
    field: "startTime" | "endTime",
    value: string,
  ) => void;
  onSaveDay: (dayOfWeek: number) => void;
  savingDay: number | null;
  canManage: boolean;
  existing: ScheduleResponseDto[];
}

export function ScheduleGrid({
  drafts,
  onChange,
  onSaveDay,
  savingDay,
  canManage,
  existing,
}: ScheduleGridProps) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Día</Table.Th>
          <Table.Th>Inicio</Table.Th>
          <Table.Th>Fin</Table.Th>
          {canManage ? <Table.Th w={120} /> : null}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {drafts.map((draft) => {
          const label =
            WORK_DAYS.find((d) => d.value === draft.dayOfWeek)?.label ??
            String(draft.dayOfWeek);
          const hasSaved = existing.some(
            (s) => s.dayOfWeek === draft.dayOfWeek,
          );

          return (
            <Table.Tr key={draft.dayOfWeek}>
              <Table.Td fw={500}>{label}</Table.Td>
              <Table.Td>
                <TextInput
                  value={draft.startTime}
                  disabled={!canManage}
                  placeholder="09:00"
                  onChange={(e) =>
                    onChange(
                      draft.dayOfWeek,
                      "startTime",
                      e.currentTarget.value,
                    )
                  }
                  maw={100}
                />
              </Table.Td>
              <Table.Td>
                <TextInput
                  value={draft.endTime}
                  disabled={!canManage}
                  placeholder="18:00"
                  onChange={(e) =>
                    onChange(draft.dayOfWeek, "endTime", e.currentTarget.value)
                  }
                  maw={100}
                />
              </Table.Td>
              {canManage ? (
                <Table.Td>
                  <Button
                    size="xs"
                    variant="light"
                    loading={savingDay === draft.dayOfWeek}
                    onClick={() => onSaveDay(draft.dayOfWeek)}
                  >
                    {hasSaved ? "Actualizar" : "Guardar"}
                  </Button>
                </Table.Td>
              ) : null}
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
}

export function buildDefaultDrafts(
  existing: ScheduleResponseDto[],
  fallbackStart = "09:00",
  fallbackEnd = "18:00",
): DayScheduleDraft[] {
  return WORK_DAYS.map((day) => {
    const row = existing.find((s) => s.dayOfWeek === day.value);
    return {
      dayOfWeek: day.value,
      startTime: row?.startTime ?? fallbackStart,
      endTime: row?.endTime ?? fallbackEnd,
      scheduleId: row?.id,
    };
  });
}

export function ScheduleGridLegend() {
  return (
    <Stack gap={4}>
      <Text size="sm" c="dimmed">
        Horario recurrente por día de la semana (formato 24 h, HH:mm).
      </Text>
    </Stack>
  );
}

export function ScheduleGridHeader({
  employeeLabel,
}: {
  employeeLabel: string;
}) {
  return (
    <Group justify="space-between">
      <Text fw={600}>{employeeLabel}</Text>
    </Group>
  );
}
