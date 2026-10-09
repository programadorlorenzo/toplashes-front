"use client";

import { Box } from "@mantine/core";

interface TimeSlotProps {
  label: string;
  heightPx: number;
  isHourMark?: boolean;
  onClick?: () => void;
}

export function TimeSlot({
  label,
  heightPx,
  isHourMark,
  onClick,
}: TimeSlotProps) {
  return (
    <Box
      component={onClick ? "button" : "div"}
      type={onClick ? "button" : undefined}
      onClick={onClick}
      style={{
        height: heightPx,
        minHeight: heightPx,
        boxSizing: "border-box",
        borderBottom: "1px solid hsl(var(--border))",
        borderTop: isHourMark ? "1px solid hsl(var(--border))" : undefined,
        borderLeft: "none",
        borderRight: "none",
        backgroundColor: onClick ? "transparent" : undefined,
        width: "100%",
        padding: 0,
        cursor: onClick ? "pointer" : "default",
      }}
      aria-label={onClick ? `Crear reserva a las ${label}` : undefined}
    />
  );
}
