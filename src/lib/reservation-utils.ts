import type { ReservationResponseDtoStatusEnum } from "@/generated-client";

export const RESERVATION_STATUS_LABELS: Record<
  ReservationResponseDtoStatusEnum,
  string
> = {
  pending_confirmation: "Pendiente",
  confirmed: "Confirmada",
  client_present: "Presente",
  in_service: "En servicio",
  completed: "Completada",
  cancelled: "Cancelada",
  no_show: "No asistió",
};

/** Colores Mantine alineados con la operación diaria en recepción. */
export const RESERVATION_STATUS_COLORS: Record<
  ReservationResponseDtoStatusEnum,
  string
> = {
  pending_confirmation: "yellow",
  confirmed: "blue",
  client_present: "indigo",
  in_service: "grape",
  completed: "green",
  cancelled: "red",
  no_show: "gray",
};

/** Fondos sutiles para cards de reserva (rgba). */
export const RESERVATION_STATUS_BG: Record<
  ReservationResponseDtoStatusEnum,
  string
> = {
  pending_confirmation: "rgba(255,193,7,0.08)",
  confirmed: "rgba(33,150,243,0.08)",
  client_present: "rgba(63,81,181,0.08)",
  in_service: "rgba(156,39,176,0.10)",
  completed: "rgba(76,175,80,0.08)",
  cancelled: "rgba(244,67,54,0.06)",
  no_show: "rgba(158,158,158,0.06)",
};

export const RESERVATION_STATUS_ACTION_LABELS: Partial<
  Record<ReservationResponseDtoStatusEnum, string>
> = {
  confirmed: "Confirmar",
  client_present: "Marcar presente",
  in_service: "Iniciar servicio",
  completed: "Completar",
  cancelled: "Cancelar",
  no_show: "No asistió",
};

export const RESERVATION_STATUS_TRANSITIONS: Record<
  ReservationResponseDtoStatusEnum,
  ReservationResponseDtoStatusEnum[]
> = {
  pending_confirmation: ["confirmed", "cancelled"],
  confirmed: ["client_present", "cancelled", "no_show"],
  client_present: ["in_service", "confirmed", "cancelled"],
  in_service: ["completed", "client_present"],
  completed: ["in_service"],
  cancelled: ["pending_confirmation"],
  no_show: ["confirmed"],
};

/** Transiciones que son reversiones (volver al estado anterior). */
export const REVERT_TRANSITIONS: Partial<
  Record<ReservationResponseDtoStatusEnum, ReservationResponseDtoStatusEnum>
> = {
  confirmed: "pending_confirmation",
  client_present: "confirmed",
  in_service: "client_present",
  completed: "in_service",
  cancelled: "pending_confirmation",
  no_show: "confirmed",
};

export function getAllowedStatusTransitions(
  status: ReservationResponseDtoStatusEnum,
): ReservationResponseDtoStatusEnum[] {
  return RESERVATION_STATUS_TRANSITIONS[status] ?? [];
}

export const RESERVATION_CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  phone: "Teléfono",
  in_person: "Presencial",
  other: "Otro",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  cash: "Efectivo",
  yape: "Yape",
  plin: "Plin",
  transfer: "Transferencia",
  card: "Tarjeta",
  other: "Otro",
};

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  advance: "Adelanto",
  partial: "Parcial",
  full: "Pago total",
  refund: "Devolución",
};

export const SCHEDULE_EXCEPTION_LABELS: Record<string, string> = {
  absence: "Ausencia",
  block: "Bloqueo",
  break: "Descanso",
  day_off: "Día libre",
};
