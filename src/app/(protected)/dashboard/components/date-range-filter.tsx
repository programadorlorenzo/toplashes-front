"use client";

import { useState } from "react";
import { Group, SegmentedControl, Popover, ActionIcon } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { CalendarRange } from "lucide-react";
import { DateTime } from "luxon";

const ZONE = "America/Lima";

type Preset = "yesterday" | "today" | "week" | "month" | "custom";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangeFilterProps {
  onChange: (range: DateRange) => void;
}

function computeRange(preset: Preset): DateRange | null {
  const now = DateTime.now().setZone(ZONE);
  switch (preset) {
    case "yesterday": {
      const y = now.minus({ days: 1 });
      return { startDate: y.toISODate()!, endDate: y.toISODate()! };
    }
    case "today":
      return { startDate: now.toISODate()!, endDate: now.toISODate()! };
    case "week": {
      const start = now.startOf("week");
      return { startDate: start.toISODate()!, endDate: now.toISODate()! };
    }
    case "month": {
      const start = now.startOf("month");
      return { startDate: start.toISODate()!, endDate: now.toISODate()! };
    }
    default:
      return null;
  }
}

const PRESET_DATA = [
  { label: "Ayer", value: "yesterday" },
  { label: "Hoy", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "Este mes", value: "month" },
];

function toISODate(d: Date): string {
  return DateTime.fromJSDate(d).setZone(ZONE).toISODate()!;
}

export function DateRangeFilter({ onChange }: DateRangeFilterProps) {
  const [preset, setPreset] = useState<Preset>("today");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [customStart, setCustomStart] = useState<string | null>(null);
  const [customEnd, setCustomEnd] = useState<string | null>(null);

  const handlePreset = (value: string) => {
    const p = value as Preset;
    setPreset(p);
    const range = computeRange(p);
    if (range) {
      onChange(range);
    }
  };

  return (
    <Group gap="xs" justify="center">
      <SegmentedControl
        value={preset === "custom" ? "" : preset}
        onChange={handlePreset}
        data={PRESET_DATA}
        size="xs"
        styles={{
          root: {
            backgroundColor: "hsl(var(--muted))",
          },
        }}
      />
      <Popover
        opened={popoverOpen}
        onChange={setPopoverOpen}
        position="bottom"
        withArrow
        shadow="md"
      >
        <Popover.Target>
          <ActionIcon
            variant={preset === "custom" ? "filled" : "light"}
            color="dark"
            size="sm"
            onClick={() => setPopoverOpen((o) => !o)}
            aria-label="Personalizar fechas"
          >
            <CalendarRange size={14} />
          </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
          <Group gap="xs" align="flex-end">
            <DatePickerInput
              label="Desde"
              value={customStart}
              onChange={setCustomStart}
              maxDate={new Date()}
              size="xs"
              w={140}
            />
            <DatePickerInput
              label="Hasta"
              value={customEnd}
              onChange={(v) => {
                setCustomEnd(v);
                if (v && customStart) {
                  setPreset("custom");
                  setPopoverOpen(false);
                  onChange({
                    startDate: toISODate(new Date(`${customStart}T12:00:00`)),
                    endDate: toISODate(new Date(`${v}T12:00:00`)),
                  });
                }
              }}
              maxDate={new Date()}
              size="xs"
              w={140}
            />
          </Group>
        </Popover.Dropdown>
      </Popover>
    </Group>
  );
}
