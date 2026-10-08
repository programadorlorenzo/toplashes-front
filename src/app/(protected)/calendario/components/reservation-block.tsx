'use client';

import { Box, Text, Tooltip } from '@mantine/core';
import { formatTime } from '@/lib/date-utils';
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from '@/lib/reservation-utils';
import type { ReservationStatus } from '@/types/api';

export interface ReservationBlockData {
  reservationId: number;
  reservationServiceId: number;
  employeeId: number;
  customerName: string;
  serviceLabel: string;
  status: ReservationStatus;
  startTime: string;
  endTime: string;
  topPx: number;
  heightPx: number;
}

interface ReservationBlockProps {
  block: ReservationBlockData;
  compact?: boolean;
  onClick: () => void;
}

export function ReservationBlock({
  block,
  compact,
  onClick,
}: ReservationBlockProps) {
  const color = RESERVATION_STATUS_COLORS[block.status];
  const statusLabel = RESERVATION_STATUS_LABELS[block.status];
  const timeRange = `${formatTime(block.startTime)} – ${formatTime(block.endTime)}`;

  const content = (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      style={{
        position: 'absolute',
        left: 4,
        right: 4,
        top: block.topPx,
        height: block.heightPx,
        zIndex: 2,
        border: 'none',
        borderRadius: 'var(--mantine-radius-sm)',
        padding: compact ? '2px 6px' : '4px 8px',
        textAlign: 'left',
        cursor: 'pointer',
        overflow: 'hidden',
        backgroundColor: `var(--mantine-color-${color}-1)`,
        borderLeft: `3px solid var(--mantine-color-${color}-6)`,
        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
      }}
    >
      <Text size="xs" fw={600} lineClamp={1}>
        {block.customerName}
      </Text>
      {!compact && (
        <>
          <Text size="xs" c="dimmed" lineClamp={1}>
            {block.serviceLabel}
          </Text>
          <Text size="xs" c="dimmed">
            {timeRange}
          </Text>
        </>
      )}
      {compact && (
        <Text size="10px" c="dimmed" lineClamp={1}>
          {timeRange}
        </Text>
      )}
    </Box>
  );

  return (
    <Tooltip
      label={`${block.customerName} · ${block.serviceLabel} · ${statusLabel}`}
      withArrow
      multiline
      maw={280}
    >
      {content}
    </Tooltip>
  );
}
