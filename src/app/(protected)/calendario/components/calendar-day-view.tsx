"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Box, Group, ScrollArea, Text } from "@mantine/core";
import {
  CALENDAR_SLOT_HEIGHT_PX,
  CALENDAR_SLOT_MINUTES,
  generateTimeSlots,
  minutesToTimeLabel,
  parseTimeToMinutes,
} from "@/lib/calendar-utils";
import type {
  EmployeeResponseDto,
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { ReservationBlock } from "./reservation-block";
import { assignOverlapColumns, buildBlocks } from "./calendar-block-utils";

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
  onDragCreate?: (
    employeeId: number,
    startTime: string,
    endTime: string,
  ) => void;
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
  onDragCreate,
}: CalendarDayViewProps) {
  const slots = generateTimeSlots(openTime, closeTime);
  const employeeColors = useMemo(
    () =>
      Object.fromEntries(
        employees.filter((e) => e.color).map((e) => [e.id, e.color!]),
      ) as Record<number, string>,
    [employees],
  );
  const allBlocks = buildBlocks(
    date,
    openTime,
    reservations,
    customerNames,
    servicesById,
    employeeColors,
  );
  const gridHeight = slots.length * CALENDAR_SLOT_HEIGHT_PX;

  const [dragState, setDragState] = useState<{
    empId: number;
    startIdx: number;
    endIdx: number;
  } | null>(null);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((empId: number, slotIdx: number) => {
    isDragging.current = true;
    setDragState({ empId, startIdx: slotIdx, endIdx: slotIdx });
  }, []);

  const handleMouseEnter = useCallback(
    (empId: number, slotIdx: number) => {
      if (!isDragging.current || !dragState || dragState.empId !== empId)
        return;
      setDragState((prev) => (prev ? { ...prev, endIdx: slotIdx } : null));
    },
    [dragState],
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current || !dragState) {
      isDragging.current = false;
      setDragState(null);
      return;
    }
    isDragging.current = false;
    const lo = Math.min(dragState.startIdx, dragState.endIdx);
    const hi = Math.max(dragState.startIdx, dragState.endIdx);
    const openMinutes = parseTimeToMinutes(openTime);
    const startTime = minutesToTimeLabel(
      openMinutes + lo * CALENDAR_SLOT_MINUTES,
    );
    const endTime = minutesToTimeLabel(
      openMinutes + (hi + 1) * CALENDAR_SLOT_MINUTES,
    );
    setDragState(null);
    if (onDragCreate) {
      onDragCreate(dragState.empId, startTime, endTime);
    } else {
      onEmptySlotClick(dragState.empId, startTime);
    }
  }, [dragState, onDragCreate, onEmptySlotClick, openTime]);

  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Box
        miw={Math.max(employees.length * 160, 600)}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          if (isDragging.current) handleMouseUp();
        }}
        style={{ userSelect: "none" }}
      >
        <Group gap={0} wrap="nowrap" align="flex-start">
          <Box w={44} style={{ flexShrink: 0 }}>
            <Box h={30} />
            {slots.map((slot) => (
              <Box
                key={slot}
                h={CALENDAR_SLOT_HEIGHT_PX}
                style={{ paddingRight: 4 }}
              >
                <Text
                  size="9px"
                  c="dimmed"
                  ta="right"
                  style={{ lineHeight: 1 }}
                >
                  {slot.endsWith(":00") ? slot : ""}
                </Text>
              </Box>
            ))}
          </Box>

          {employees.map((employee) => {
            const empBlocks = allBlocks.filter(
              (b) => b.employeeId === employee.id,
            );
            const laidOut = assignOverlapColumns(empBlocks);
            const empColor = employee.color ?? "#8B7355";

            return (
              <Box
                key={employee.id}
                style={{
                  flex: "1 1 140px",
                  minWidth: 120,
                  borderLeft: "1px solid var(--mantine-color-gray-3)",
                }}
              >
                <Box
                  h={30}
                  px={6}
                  style={{
                    borderBottom: "1px solid var(--mantine-color-gray-3)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: "var(--mantine-color-gray-0)",
                  }}
                >
                  <Box
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      backgroundColor: empColor,
                      flexShrink: 0,
                    }}
                  />
                  <Text size="xs" fw={600} lineClamp={1}>
                    {employee.firstName}
                  </Text>
                </Box>

                <Box pos="relative" h={gridHeight}>
                  {slots.map((slot, idx) => {
                    const isInDrag =
                      dragState &&
                      dragState.empId === employee.id &&
                      idx >= Math.min(dragState.startIdx, dragState.endIdx) &&
                      idx <= Math.max(dragState.startIdx, dragState.endIdx);

                    return (
                      <Box
                        key={slot}
                        h={CALENDAR_SLOT_HEIGHT_PX}
                        style={{
                          borderBottom: slot.endsWith(":00")
                            ? "1px solid var(--mantine-color-gray-3)"
                            : "1px solid var(--mantine-color-gray-1)",
                          cursor: "crosshair",
                          backgroundColor: isInDrag
                            ? `${empColor}20`
                            : undefined,
                          transition: "background-color 80ms",
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleMouseDown(employee.id, idx);
                        }}
                        onMouseEnter={() => handleMouseEnter(employee.id, idx)}
                      />
                    );
                  })}

                  {laidOut.map((block) => (
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
