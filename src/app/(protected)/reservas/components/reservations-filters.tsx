"use client";

import { Group, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { RESERVATION_STATUS_LABELS } from "@/lib/reservation-utils";
import { toISODate } from "@/lib/date-utils";
import type { ReservationResponseDtoStatusEnum } from "@/generated-client";

interface BranchOption {
  id: number;
  name: string;
}

interface ReservationsFiltersProps {
  date: string | null;
  onDateChange: (value: string | null) => void;
  status: ReservationResponseDtoStatusEnum | null;
  onStatusChange: (value: ReservationResponseDtoStatusEnum | null) => void;
  branchId: number | null;
  onBranchChange: (value: number | null) => void;
  branches: BranchOption[];
}

const statusOptions = [
  { value: "", label: "Todos los estados" },
  ...Object.entries(RESERVATION_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
];

export function ReservationsFilters({
  date,
  onDateChange,
  status,
  onStatusChange,
  branchId,
  onBranchChange,
  branches,
}: ReservationsFiltersProps) {
  const branchOptions = [
    { value: "", label: "Todos los locales" },
    ...branches.map((b) => ({ value: String(b.id), label: b.name })),
  ];

  return (
    <Group wrap="wrap" align="flex-end">
      <DatePickerInput
        label="Fecha"
        placeholder="Todas"
        clearable
        value={date}
        onChange={(value) => onDateChange(value ? toISODate(value) : null)}
        valueFormat="DD/MM/YYYY"
        maw={180}
      />
      <Select
        label="Estado"
        data={statusOptions}
        value={status ?? ""}
        onChange={(value) =>
          onStatusChange(
            value ? (value as ReservationResponseDtoStatusEnum) : null,
          )
        }
        maw={220}
        comboboxProps={{ withinPortal: true }}
      />
      {branches.length >= 1 ? (
        <Select
          label="Local"
          data={branchOptions}
          value={branchId ? String(branchId) : ""}
          onChange={(value) =>
            onBranchChange(value ? parseInt(value, 10) : null)
          }
          maw={220}
          comboboxProps={{ withinPortal: true }}
        />
      ) : null}
    </Group>
  );
}
