"use client";

import { Group, MultiSelect, Select } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { toISODate } from "@/lib/date-utils";
import { RESERVATION_CHANNEL_LABELS } from "@/lib/reservation-utils";

interface BranchOption {
  value: string;
  label: string;
}

interface ReservationFormHeaderProps {
  customerOptions: { value: string; label: string }[];
  customerId: string | null;
  onCustomerChange: (value: string | null) => void;
  branchOptions: BranchOption[];
  branchId: number | null;
  onBranchChange: (id: number) => void;
  date: string;
  onDateChange: (date: string) => void;
  channel: string;
  onChannelChange: (channel: string) => void;
  serviceOptions: { value: string; label: string }[];
  selectedServiceIds: string[];
  onServiceIdsChange: (ids: string[]) => void;
}

const channelOptions = Object.entries(RESERVATION_CHANNEL_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function ReservationFormHeader({
  customerOptions,
  customerId,
  onCustomerChange,
  branchOptions,
  branchId,
  onBranchChange,
  date,
  onDateChange,
  channel,
  onChannelChange,
  serviceOptions,
  selectedServiceIds,
  onServiceIdsChange,
}: ReservationFormHeaderProps) {
  return (
    <>
      <Group gap="sm" grow wrap="wrap">
        <Select
          label="Clienta"
          placeholder="Buscar..."
          data={customerOptions}
          value={customerId}
          onChange={onCustomerChange}
          searchable
          nothingFoundMessage="No encontrada"
          comboboxProps={{ withinPortal: true }}
        />
        <Select
          label="Local"
          data={branchOptions}
          value={branchId ? String(branchId) : null}
          onChange={(v) => v && onBranchChange(parseInt(v, 10))}
          comboboxProps={{ withinPortal: true }}
        />
      </Group>

      <Group gap="sm" grow wrap="wrap">
        <DatePickerInput
          label="Fecha"
          value={date}
          onChange={(v) => v && onDateChange(toISODate(v))}
          valueFormat="DD/MM/YYYY"
        />
        <Select
          label="Canal"
          data={channelOptions}
          value={channel}
          onChange={(v) => v && onChannelChange(v)}
          comboboxProps={{ withinPortal: true }}
        />
      </Group>

      <MultiSelect
        label="Servicios"
        placeholder="Selecciona servicios"
        data={serviceOptions}
        value={selectedServiceIds}
        onChange={onServiceIdsChange}
        searchable
        comboboxProps={{ withinPortal: true }}
      />
    </>
  );
}
