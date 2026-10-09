"use client";

import { Box, Text, Tooltip } from "@mantine/core";
import { CalendarCheck } from "lucide-react";
import { formatTime } from "@/lib/date-utils";
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";
import type { ReservationResponseDtoStatusEnum } from "@/generated-client";

export interface ReservationBlockData {
  reservationId: number;
  reservationServiceId: number;
  employeeId: number | null;
  employeeColor?: string;
  customerName: string;
  serviceLabel: string;
  status: ReservationResponseDtoStatusEnum;
  startTime: string;
  endTime: string;
  topPx: number;
  heightPx: number;
  hasCalendarEvent: boolean;
  colIndex: number;
  totalCols: number;
}

interface ReservationBlockProps {
  block: ReservationBlockData;
  onClick: () => void;
}

const STATUS_DOT_COLORS: Record<string, string> = {
  pending_confirmation: "#f59e0b",
  confirmed: "#3b82f6",
  client_present: "#8b5cf6",
  in_service: "#ec4899",
  completed: "#22c55e",
  cancelled: "#ef4444",
  no_show: "#6b7280",
};

export function ReservationBlock({ block, onClick }: ReservationBlockProps) {
  const statusLabel = RESERVATION_STATUS_LABELS[block.status];
  const statusColor = RESERVATION_STATUS_COLORS[block.status] ?? "gray";
  const timeRange = `${formatTime(block.startTime)} – ${formatTime(block.endTime)}`;

  const empColor = block.employeeColor;
  const bgColor = empColor
    ? `${empColor}18`
    : `var(--mantine-color-${statusColor}-1)`;
  const borderColor = empColor
    ? empColor
    : `var(--mantine-color-${statusColor}-6)`;
  const dotColor = STATUS_DOT_COLORS[block.status] ?? "#6b7280";

  const widthPercent = 100 / block.totalCols;
  const leftPercent = block.colIndex * widthPercent;

  const isCompact = block.heightPx < 40;
  const isTiny = block.heightPx < 28;

  const content = (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      style={{
        position: "absolute",
        left: `calc(${leftPercent}% + 2px)`,
        width: `calc(${widthPercent}% - 4px)`,
        top: block.topPx + 1,
        height: block.heightPx - 2,
        zIndex: 2,
        border: "none",
        borderRadius: 4,
        padding: isTiny ? "0 4px" : "1px 5px",
        textAlign: "left",
        cursor: "pointer",
        overflow: "hidden",
        backgroundColor: bgColor,
        borderLeft: `3px solid ${borderColor}`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        lineHeight: 1.2,
        display: "flex",
        flexDirection: isTiny ? "row" : "column",
        gap: isTiny ? 4 : 0,
        alignItems: isTiny ? "center" : "flex-start",
      }}
    >
      {isTiny ? (
        <Text
          size="10px"
          fw={600}
          lineClamp={1}
          style={{ flex: 1, minWidth: 0 }}
        >
          {block.customerName}
        </Text>
      ) : (
        <>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              width: "100%",
              minWidth: 0,
            }}
          >
            <Box
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: dotColor,
                flexShrink: 0,
              }}
            />
            <Text
              size="10px"
              fw={600}
              lineClamp={1}
              style={{ flex: 1, minWidth: 0 }}
            >
              {block.customerName}
            </Text>
            {block.hasCalendarEvent && (
              <CalendarCheck
                size={10}
                color="var(--mantine-color-teal-5)"
                style={{ flexShrink: 0 }}
              />
            )}
          </Box>
          {!isCompact && (
            <Text size="9px" c="dimmed" lineClamp={1} style={{ width: "100%" }}>
              {block.serviceLabel}
            </Text>
          )}
          <Text size="9px" c="dimmed" lineClamp={1}>
            {timeRange}
          </Text>
        </>
      )}
    </Box>
  );

  return (
    <Tooltip
      label={`${block.customerName} · ${block.serviceLabel} · ${statusLabel} · ${timeRange}${block.hasCalendarEvent ? " · 📅" : ""}`}
      withArrow
      multiline
      maw={280}
    >
      {content}
    </Tooltip>
  );
}
