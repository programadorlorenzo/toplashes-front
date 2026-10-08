'use client';

import { Badge } from '@mantine/core';
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from '@/lib/reservation-utils';
import type { ReservationStatus } from '@/types/api';

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function ReservationStatusBadge({
  status,
  size = 'sm',
}: ReservationStatusBadgeProps) {
  return (
    <Badge color={RESERVATION_STATUS_COLORS[status]} variant="light" size={size}>
      {RESERVATION_STATUS_LABELS[status]}
    </Badge>
  );
}
