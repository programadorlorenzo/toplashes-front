import {
  CALENDAR_SLOT_HEIGHT_PX,
  CALENDAR_SLOT_MINUTES,
  durationMinutesBetween,
  minutesFromOpenOnDate,
} from "@/lib/calendar-utils";
import type {
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import type { ReservationBlockData } from "./reservation-block";

interface ColumnSlot {
  block: ReservationBlockData;
  colIndex: number;
}

export function assignOverlapColumns(
  blocks: ReservationBlockData[],
): ReservationBlockData[] {
  if (blocks.length === 0) return [];

  const sorted = [...blocks].sort((a, b) => a.topPx - b.topPx);
  const endPxOf = (b: ReservationBlockData) => b.topPx + b.heightPx;

  const groups: ColumnSlot[][] = [];
  let currentGroup: ColumnSlot[] = [];
  let groupEnd = 0;

  for (const block of sorted) {
    if (currentGroup.length > 0 && block.topPx >= groupEnd) {
      groups.push(currentGroup);
      currentGroup = [];
      groupEnd = 0;
    }

    let colIndex = 0;
    const usedCols = new Set(
      currentGroup
        .filter((s) => endPxOf(s.block) > block.topPx)
        .map((s) => s.colIndex),
    );
    while (usedCols.has(colIndex)) colIndex++;

    currentGroup.push({ block, colIndex });
    groupEnd = Math.max(groupEnd, endPxOf(block));
  }
  if (currentGroup.length > 0) groups.push(currentGroup);

  const result: ReservationBlockData[] = [];
  for (const group of groups) {
    const totalCols = Math.max(...group.map((s) => s.colIndex)) + 1;
    for (const slot of group) {
      result.push({
        ...slot.block,
        colIndex: slot.colIndex,
        totalCols,
      });
    }
  }
  return result;
}

export function buildBlocks(
  date: string,
  openTime: string,
  reservations: ReservationResponseDto[],
  customerNames: Record<number, string>,
  servicesById: Record<number, ServiceResponseDto>,
  employeeColors: Record<number, string>,
): ReservationBlockData[] {
  const blocks: ReservationBlockData[] = [];

  for (const reservation of reservations) {
    const customerName =
      customerNames[reservation.customerId] ??
      `Cliente #${reservation.customerId}`;
    const hasCalendarEvent = !!reservation.googleCalendarEventId;

    for (const line of reservation.services) {
      const service = servicesById[line.serviceId];
      const topMinutes = minutesFromOpenOnDate(openTime, line.startTime);
      const duration = durationMinutesBetween(line.startTime, line.endTime);
      blocks.push({
        reservationId: reservation.id,
        reservationServiceId: line.id,
        employeeId: line.employeeId,
        employeeColor:
          line.employeeId !== null
            ? employeeColors[line.employeeId]
            : undefined,
        customerName,
        serviceLabel: service?.name ?? `Servicio #${line.serviceId}`,
        status: reservation.status,
        startTime: line.startTime,
        endTime: line.endTime,
        topPx: (topMinutes / CALENDAR_SLOT_MINUTES) * CALENDAR_SLOT_HEIGHT_PX,
        heightPx: Math.max(
          (duration / CALENDAR_SLOT_MINUTES) * CALENDAR_SLOT_HEIGHT_PX - 2,
          CALENDAR_SLOT_HEIGHT_PX - 4,
        ),
        hasCalendarEvent,
        colIndex: 0,
        totalCols: 1,
      });
    }
  }

  void date;
  return blocks;
}
