"use client";

import { Button, Group, Select, Stack, Text } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { DateTime } from "luxon";
import type {
  EmployeeResponseDto,
  ServiceResponseDto,
} from "@/generated-client";

interface ManualSlotInputProps {
  serviceId: number;
  service: ServiceResponseDto | undefined;
  date: string;
  qualifiedEmployees: EmployeeResponseDto[];
  time: string;
  employeeValue: string;
  hasAutoSlots: boolean;
  onTimeChange: (value: string) => void;
  onEmployeeChange: (value: string) => void;
  onApply: (selection: ManualSlotResult) => void;
  onSwitchToAuto: () => void;
}

export interface ManualSlotResult {
  serviceId: number;
  employeeId: number | null;
  startTime: string;
  endTime: string;
  employeeName: string;
  agreedPrice: number;
}

export function ManualSlotInput({
  serviceId,
  service,
  date,
  qualifiedEmployees,
  time,
  employeeValue,
  hasAutoSlots,
  onTimeChange,
  onEmployeeChange,
  onApply,
  onSwitchToAuto,
}: ManualSlotInputProps) {
  const duration = service?.duration ?? 60;

  const handleApply = () => {
    if (!time) return;
    const start = DateTime.fromISO(`${date}T${time}`, {
      zone: "America/Lima",
    });
    if (!start.isValid) return;
    const end = start.plus({ minutes: duration });

    const empId =
      employeeValue && employeeValue !== "none"
        ? parseInt(employeeValue, 10)
        : null;
    const emp =
      empId !== null
        ? qualifiedEmployees.find((e) => e.id === empId)
        : undefined;

    onApply({
      serviceId,
      employeeId: empId,
      startTime: start.toISO()!,
      endTime: end.toISO()!,
      employeeName: emp ? `${emp.firstName} ${emp.lastName}` : "Sin asignar",
      agreedPrice: service?.price ?? 0,
    });
  };

  const employeeOptions = [
    { value: "none", label: "Sin asignar" },
    ...qualifiedEmployees.map((e) => ({
      value: String(e.id),
      label: `${e.firstName} ${e.lastName}`,
    })),
  ];

  return (
    <Stack gap="xs">
      {!hasAutoSlots && (
        <Text size="sm" c="dimmed">
          No hay horarios sugeridos. Asigna manualmente:
        </Text>
      )}
      <Group gap="sm" align="flex-end" wrap="wrap">
        <TimeInput
          label="Hora de inicio"
          value={time}
          onChange={(e) => onTimeChange(e.currentTarget.value)}
          w={130}
        />
        <Select
          label="Colaboradora"
          placeholder="Sin asignar"
          data={employeeOptions}
          value={employeeValue || "none"}
          onChange={(v) => onEmployeeChange(v ?? "none")}
          w={200}
          comboboxProps={{ withinPortal: true }}
        />
        <Button
          size="xs"
          variant="light"
          onClick={handleApply}
          disabled={!time}
        >
          Aplicar
        </Button>
      </Group>
      {time && service?.duration ? (
        <Text size="xs" c="dimmed">
          Fin estimado: ~{service.duration} min después
        </Text>
      ) : null}
      {hasAutoSlots && (
        <Text
          size="xs"
          c="dimmed"
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={onSwitchToAuto}
        >
          Volver a horarios sugeridos
        </Text>
      )}
    </Stack>
  );
}
