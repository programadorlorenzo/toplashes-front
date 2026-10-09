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
  client_present: ["in_service", "cancelled"],
  in_service: ["completed"],
  completed: [],
  cancelled: [],
  no_show: [],
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
