"use client";

import { Button, Group, MultiSelect, Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { primaryButtonStyles } from "@/lib/crud-styles";
import { toISODate } from "@/lib/date-utils";
import type { ServiceResponseDto } from "@/generated-client";

interface BranchOption {
  id: number;
  name: string;
}

interface StepServicesProps {
  branches: BranchOption[];
  branchId: number | null;
  onBranchChange: (id: number) => void;
  date: string;
  onDateChange: (date: string) => void;
  services: ServiceResponseDto[];
  selectedServiceIds: string[];
  onServiceIdsChange: (ids: string[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StepServices({
  branches,
  branchId,
  onBranchChange,
  date,
  onDateChange,
  services,
  selectedServiceIds,
  onServiceIdsChange,
  onBack,
  onContinue,
}: StepServicesProps) {
  const branchOptions = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  const availableServices = services.filter(
    (s) =>
      s.isActive &&
      (!branchId ||
        s.branchAssignments.length === 0 ||
        s.branchAssignments.some((a) => a.branchId === branchId && a.isActive)),
  );

  const serviceOptions = availableServices.map((s) => ({
    value: String(s.id),
    label: `${s.name} · S/ ${s.price.toFixed(2)} · ${s.duration} min`,
  }));

  return (
    <Stack gap="md">
      <Select
        label="Local"
        data={branchOptions}
        value={branchId ? String(branchId) : null}
        onChange={(value) => {
          if (value) onBranchChange(parseInt(value, 10));
        }}
        comboboxProps={{ withinPortal: true }}
        required
      />
      <DatePickerInput
        label="Fecha de la cita"
        value={date}
        onChange={(value) => {
          if (value) onDateChange(toISODate(value));
        }}
        valueFormat="DD/MM/YYYY"
        required
      />
      <MultiSelect
        label="Servicios"
        placeholder="Selecciona uno o más servicios"
        data={serviceOptions}
        value={selectedServiceIds}
        onChange={onServiceIdsChange}
        searchable
        comboboxProps={{ withinPortal: true }}
        required
      />
      {selectedServiceIds.length === 0 ? (
        <Text size="sm" c="dimmed">
          Elige al menos un servicio para consultar disponibilidad.
        </Text>
      ) : null}
      <Group justify="space-between">
        <Button variant="default" onClick={onBack}>
          Atrás
        </Button>
        <Button
          styles={primaryButtonStyles}
          disabled={!branchId || selectedServiceIds.length === 0}
          onClick={onContinue}
        >
          Consultar horarios
        </Button>
      </Group>
    </Stack>
  );
}
