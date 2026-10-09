"use client";

import {
  Button,
  Divider,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import type { ServiceResponseDto } from "@/generated-client";
import { primaryButtonStyles } from "@/lib/crud-styles";
import { formatTime } from "@/lib/date-utils";
import { formatSoles } from "@/lib/format";

interface SelectionLine {
  serviceId: number;
  employeeName: string;
  startTime: string;
  endTime: string;
  agreedPrice: number;
}

interface ReservationSummaryProps {
  selections: SelectionLine[];
  servicesById: Record<number, ServiceResponseDto>;
  discount: number | string;
  onDiscountChange: (value: number | string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  total: number;
  submitting: boolean;
  canSubmit: boolean;
  onRemoveSelection: (serviceId: number) => void;
  onSubmit: () => void;
}

export function ReservationSummary({
  selections,
  servicesById,
  discount,
  onDiscountChange,
  notes,
  onNotesChange,
  total,
  submitting,
  canSubmit,
  onRemoveSelection,
  onSubmit,
}: ReservationSummaryProps) {
  return (
    <>
      <Divider label="Resumen" labelPosition="center" />
      <Stack gap={4}>
        {selections.map((s) => {
          const svc = servicesById[s.serviceId];
          return (
            <Group key={s.serviceId} justify="space-between">
              <Text size="sm">
                {svc?.name ?? `#${s.serviceId}`} · {s.employeeName} ·{" "}
                {formatTime(s.startTime)}–{formatTime(s.endTime)}
              </Text>
              <Group gap="xs">
                <Text size="sm" fw={500}>
                  {formatSoles(s.agreedPrice)}
                </Text>
                <Text
                  size="xs"
                  c="red"
                  style={{ cursor: "pointer" }}
                  onClick={() => onRemoveSelection(s.serviceId)}
                >
                  ✕
                </Text>
              </Group>
            </Group>
          );
        })}
      </Stack>

      <Group gap="sm" grow wrap="wrap">
        <NumberInput
          label="Descuento"
          prefix="S/ "
          decimalScale={2}
          fixedDecimalScale
          min={0}
          value={discount}
          onChange={onDiscountChange}
          size="xs"
        />
        <Textarea
          label="Notas"
          minRows={1}
          autosize
          value={notes}
          onChange={(e) => onNotesChange(e.currentTarget.value)}
          size="xs"
        />
      </Group>

      <Group justify="space-between">
        <Text fw={600}>Total: {formatSoles(total)}</Text>
        <Button
          styles={primaryButtonStyles}
          loading={submitting}
          disabled={!canSubmit}
          onClick={onSubmit}
        >
          Confirmar reserva
        </Button>
      </Group>
    </>
  );
}
