import { DateTime } from 'luxon';

const ZONE = 'America/Lima';

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '';
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date, { zone: ZONE })
      : DateTime.fromJSDate(date, { zone: ZONE });
  return dt.toFormat('dd/MM/yyyy');
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date, { zone: ZONE })
      : DateTime.fromJSDate(date, { zone: ZONE });
  return dt.toFormat('dd/MM/yyyy, HH:mm');
}

export function formatTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const dt =
    typeof date === 'string'
      ? DateTime.fromISO(date, { zone: ZONE })
      : DateTime.fromJSDate(date, { zone: ZONE });
  return dt.toFormat('HH:mm');
}

export function formatFechaLegible(
  fecha: string | Date | null | undefined,
): string {
  if (!fecha) return '';
  const dt =
    typeof fecha === 'string'
      ? DateTime.fromISO(fecha, { zone: ZONE })
      : DateTime.fromJSDate(fecha, { zone: ZONE });
  return dt.setLocale('es').toFormat("cccc, dd 'de' MMMM 'de' yyyy");
}

export function todayISO(): string {
  return DateTime.now().setZone(ZONE).toISODate()!;
}

export function toISODate(value: Date | string): string {
  if (typeof value === 'string') {
    return DateTime.fromISO(value, { zone: ZONE }).toISODate()!;
  }
  return DateTime.fromJSDate(value, { zone: ZONE }).toISODate()!;
}

export function nowLima(): DateTime {
  return DateTime.now().setZone(ZONE);
}
