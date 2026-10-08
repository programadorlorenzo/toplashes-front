import type { ReservationStatus } from '@/types/api';

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  pending_confirmation: 'Pendiente',
  confirmed: 'Confirmada',
  client_present: 'Presente',
  in_service: 'En servicio',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show: 'No asistió',
};

/** Colores Mantine alineados con la operación diaria en recepción. */
export const RESERVATION_STATUS_COLORS: Record<ReservationStatus, string> = {
  pending_confirmation: 'yellow',
  confirmed: 'blue',
  client_present: 'indigo',
  in_service: 'grape',
  completed: 'green',
  cancelled: 'red',
  no_show: 'gray',
};

export const RESERVATION_STATUS_ACTION_LABELS: Partial<
  Record<ReservationStatus, string>
> = {
  confirmed: 'Confirmar',
  client_present: 'Marcar presente',
  in_service: 'Iniciar servicio',
  completed: 'Completar',
  cancelled: 'Cancelar',
  no_show: 'No asistió',
};

export const RESERVATION_STATUS_TRANSITIONS: Record<
  ReservationStatus,
  ReservationStatus[]
> = {
  pending_confirmation: ['confirmed', 'cancelled'],
  confirmed: ['client_present', 'cancelled', 'no_show'],
  client_present: ['in_service', 'cancelled'],
  in_service: ['completed'],
  completed: [],
  cancelled: [],
  no_show: [],
};

export function getAllowedStatusTransitions(
  status: ReservationStatus,
): ReservationStatus[] {
  return RESERVATION_STATUS_TRANSITIONS[status] ?? [];
}

export const RESERVATION_CHANNEL_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  phone: 'Teléfono',
  in_person: 'Presencial',
  other: 'Otro',
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: 'Efectivo',
  yape: 'Yape',
  plin: 'Plin',
  transfer: 'Transferencia',
  card: 'Tarjeta',
  other: 'Otro',
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  scheduled: 'Programada',
  in_progress: 'En atención',
  completed: 'Finalizada',
  cancelled: 'Cancelada',
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  scheduled: 'blue',
  in_progress: 'grape',
  completed: 'green',
  cancelled: 'red',
};

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  advance: 'Adelanto',
  partial: 'Parcial',
  full: 'Pago total',
  refund: 'Devolución',
};

export const SCHEDULE_EXCEPTION_LABELS: Record<string, string> = {
  absence: 'Ausencia',
  block: 'Bloqueo',
  break: 'Descanso',
  day_off: 'Día libre',
};
