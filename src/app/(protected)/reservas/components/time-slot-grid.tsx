"use client";

import { useCallback, useMemo, useState } from "react";
import { Button, Group, SimpleGrid, Text, Tooltip } from "@mantine/core";
import { Check } from "lucide-react";
import { DateTime } from "luxon";
import type { BookingItem } from "./use-reservas-dashboard";

const ZONE = "America/Lima";

interface TimeSlotGridProps {
  openTime: string;
  closeTime: string;
  bookings: BookingItem[];
  onRangeSelected: (startTime: string, endTime: string) => void;
}

interface SlotInfo {
  label: string;
  iso: string;
  occupied: boolean;
  occupiedBy: string | null;
}

function generateSlots(
  openTime: string,
  closeTime: string,
  bookings: BookingItem[],
): SlotInfo[] {
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);

  const slots: SlotInfo[] = [];
  let h = openH;
  let m = openM;

  while (h < closeH || (h === closeH && m < closeM)) {
    const label = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    const slotStart = DateTime.fromObject(
      { hour: h, minute: m },
      { zone: ZONE },
    );
    const slotEnd = slotStart.plus({ minutes: 30 });

    const active = bookings.filter(
      (b) => b.status !== "cancelled" && b.status !== "no_show",
    );

    let occupied = false;
    let occupiedBy: string | null = null;
    for (const b of active) {
      const bStart = DateTime.fromISO(b.startTime, { zone: ZONE });
      const bEnd = DateTime.fromISO(b.endTime, { zone: ZONE });
      if (slotStart < bEnd && slotEnd > bStart) {
        occupied = true;
        occupiedBy = `${b.customerName} · ${b.serviceName}`;
        break;
      }
    }

    slots.push({ label, iso: label, occupied, occupiedBy });
    m += 30;
    if (m >= 60) {
      m = 0;
      h++;
    }
  }
  return slots;
}

export function TimeSlotGrid({
  openTime,
  closeTime,
  bookings,
  onRangeSelected,
}: TimeSlotGridProps) {
  const [startIdx, setStartIdx] = useState<number | null>(null);
  const [endIdx, setEndIdx] = useState<number | null>(null);

  const slots = useMemo(
    () => generateSlots(openTime, closeTime, bookings),
    [openTime, closeTime, bookings],
  );

  const handleClick = useCallback(
    (idx: number) => {
      if (slots[idx].occupied) return;

      if (startIdx === null) {
        setStartIdx(idx);
        setEndIdx(null);
        return;
      }

      if (idx === startIdx) {
        setStartIdx(null);
        setEndIdx(null);
        return;
      }

      if (idx < startIdx) {
        setStartIdx(idx);
        setEndIdx(null);
        return;
      }

      const hasOccupied = slots
        .slice(startIdx + 1, idx + 1)
        .some((s) => s.occupied);
      if (hasOccupied) {
        setStartIdx(idx);
        setEndIdx(null);
      } else {
        setEndIdx(idx);
      }
    },
    [startIdx, slots],
  );

  const handleConfirm = useCallback(() => {
    if (startIdx === null) return;
    const last = endIdx ?? startIdx;
    const startSlot = slots[startIdx];
    const endSlot = slots[last];
    const [endH, endM] = endSlot.iso.split(":").map(Number);
    const endTime = `${String(endH).padStart(2, "0")}:${String(endM + 30 >= 60 ? 0 : endM + 30).padStart(2, "0")}`;
    const endHour = endM + 30 >= 60 ? endH + 1 : endH;
    const endFinal = `${String(endHour).padStart(2, "0")}:${String((endM + 30) % 60).padStart(2, "0")}`;
    onRangeSelected(startSlot.iso, endFinal);
    setStartIdx(null);
    setEndIdx(null);
  }, [startIdx, endIdx, slots, onRangeSelected]);

  const rangeMin = startIdx;
  const rangeMax = endIdx ?? startIdx;

  return (
    <div>
      <Group justify="space-between" mb={4}>
        <Text size="xs" c="dimmed" fw={600}>
          Horarios disponibles
        </Text>
        {startIdx !== null && (
          <Button
            size="compact-xs"
            variant="light"
            color="green"
            leftSection={<Check size={12} />}
            onClick={handleConfirm}
          >
            Reservar {slots[startIdx].iso}
            {rangeMax !== null && rangeMax !== startIdx
              ? `–${slots[rangeMax].iso}`
              : ""}
          </Button>
        )}
      </Group>
      <SimpleGrid cols={4} spacing={3}>
        {slots.map((slot, idx) => {
          const inRange =
            rangeMin !== null &&
            rangeMax !== null &&
            idx >= rangeMin &&
            idx <= rangeMax;
          const isStart = idx === startIdx;

          return (
            <Tooltip
              key={slot.label}
              label={slot.occupied ? slot.occupiedBy : "Disponible"}
              withArrow
              position="top"
            >
              <div
                onClick={() => handleClick(idx)}
                style={{
                  padding: "2px 0",
                  textAlign: "center",
                  fontSize: 11,
                  fontWeight: inRange ? 700 : 500,
                  borderRadius: 4,
                  cursor: slot.occupied ? "default" : "pointer",
                  background: slot.occupied
                    ? "rgba(156,39,176,0.12)"
                    : inRange
                      ? "rgba(76,175,80,0.2)"
                      : "rgba(0,0,0,0.03)",
                  color: slot.occupied
                    ? "var(--mantine-color-grape-7)"
                    : inRange
                      ? "var(--mantine-color-green-8)"
                      : "var(--mantine-color-dimmed)",
                  border: isStart
                    ? "1px solid var(--mantine-color-green-5)"
                    : "1px solid transparent",
                  opacity: slot.occupied ? 0.7 : 1,
                  transition: "all 100ms ease",
                }}
              >
                {slot.label}
              </div>
            </Tooltip>
          );
        })}
      </SimpleGrid>
    </div>
  );
}
