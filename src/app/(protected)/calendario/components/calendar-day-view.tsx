"use client";

import { Box, Group, ScrollArea, Text } from "@mantine/core";
import {
  CALENDAR_SLOT_HEIGHT_PX,
  CALENDAR_SLOT_MINUTES,
  durationMinutesBetween,
  generateTimeSlots,
  minutesFromOpenOnDate,
} from "@/lib/calendar-utils";
import type {
  EmployeeResponseDto,
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import {
  ReservationBlock,
  type ReservationBlockData,
} from "./reservation-block";
import { TimeSlot } from "./time-slot";

interface CalendarDayViewProps {
  date: string;
  openTime: string;
  closeTime: string;
  employees: EmployeeResponseDto[];
  reservations: ReservationResponseDto[];
  customerNames: Record<number, string>;
  servicesById: Record<number, ServiceResponseDto>;
  onEmptySlotClick: (employeeId: number, time: string) => void;
  onReservationClick: (reservationId: number) => void;
}

function buildBlocks(
  date: string,
  openTime: string,
  reservations: ReservationResponseDto[],
  customerNames: Record<number, string>,
  servicesById: Record<number, ServiceResponseDto>,
): ReservationBlockData[] {
  const blocks: ReservationBlockData[] = [];

  for (const reservation of reservations) {
    const customerName =
      customerNames[reservation.customerId] ??
      `Cliente #${reservation.customerId}`;

    for (const line of reservation.services) {
      const service = servicesById[line.serviceId];
      const topMinutes = minutesFromOpenOnDate(openTime, line.startTime);
      const duration = durationMinutesBetween(line.startTime, line.endTime);
      blocks.push({
        reservationId: reservation.id,
        reservationServiceId: line.id,
        employeeId: line.employeeId,
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
      });
    }
  }

  void date;
  return blocks;
}

export function CalendarDayView({
  date,
  openTime,
  closeTime,
  employees,
  reservations,
  customerNames,
  servicesById,
  onEmptySlotClick,
  onReservationClick,
}: CalendarDayViewProps) {
  const slots = generateTimeSlots(openTime, closeTime);
  const blocks = buildBlocks(
    date,
    openTime,
    reservations,
    customerNames,
    servicesById,
  );
  const gridHeight = slots.length * CALENDAR_SLOT_HEIGHT_PX;

  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Box miw={Math.max(employees.length * 180, 640)}>
        <Group gap={0} wrap="nowrap" align="flex-start">
          <Box w={56} style={{ flexShrink: 0 }}>
            <Box h={40} />
            {slots.map((slot) => (
              <Box
                key={slot}
                h={CALENDAR_SLOT_HEIGHT_PX}
                style={{
                  borderBottom: "1px solid hsl(var(--border))",
                  paddingRight: 8,
                }}
              >
                <Text size="xs" c="dimmed" ta="right" pt={2}>
                  {slot.endsWith(":00") ? slot : ""}
                </Text>
              </Box>
            ))}
          </Box>

          {employees.map((employee) => {
            const employeeBlocks = blocks.filter(
              (b) => b.employeeId === employee.id,
            );

            return (
              <Box
                key={employee.id}
                style={{
                  flex: "1 1 180px",
                  minWidth: 160,
                  borderLeft: "1px solid hsl(var(--border))",
                }}
              >
                <Box
                  h={40}
                  px="xs"
                  style={{
                    borderBottom: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--muted))",
                  }}
                >
                  <Text size="sm" fw={600} lineClamp={1}>
                    {employee.firstName} {employee.lastName}
                  </Text>
                </Box>

                <Box pos="relative" h={gridHeight}>
                  {slots.map((slot) => (
                    <TimeSlot
                      key={slot}
                      label={slot}
                      heightPx={CALENDAR_SLOT_HEIGHT_PX}
                      isHourMark={slot.endsWith(":00")}
                      onClick={() => onEmptySlotClick(employee.id, slot)}
                    />
                  ))}

                  {employeeBlocks.map((block) => (
                    <ReservationBlock
                      key={block.reservationServiceId}
                      block={block}
                      onClick={() => onReservationClick(block.reservationId)}
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
        </Group>
      </Box>
    </ScrollArea>
  );
}
