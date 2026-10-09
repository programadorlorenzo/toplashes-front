import { DateTime } from "luxon";

const ZONE = "America/Lima";

export const CALENDAR_SLOT_MINUTES = 30;
export const CALENDAR_SLOT_HEIGHT_PX = 44;

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTimeLabel(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function generateTimeSlots(
  openTime: string,
  closeTime: string,
  stepMinutes = CALENDAR_SLOT_MINUTES,
): string[] {
  const start = parseTimeToMinutes(openTime);
  const end = parseTimeToMinutes(closeTime);
  const slots: string[] = [];
  for (let t = start; t < end; t += stepMinutes) {
    slots.push(minutesToTimeLabel(t));
  }
  return slots;
}

export function isoTimeOnDate(dateIso: string, hhmm: string): string {
  return DateTime.fromISO(`${dateIso}T${hhmm}`, { zone: ZONE }).toISO()!;
}

export function minutesFromOpenOnDate(
  openTime: string,
  isoStart: string,
): number {
  const openMinutes = parseTimeToMinutes(openTime);
  const start = DateTime.fromISO(isoStart, { zone: ZONE });
  const startMinutes = start.hour * 60 + start.minute;
  return Math.max(0, startMinutes - openMinutes);
}

export function durationMinutesBetween(
  isoStart: string,
  isoEnd: string,
): number {
  const start = DateTime.fromISO(isoStart, { zone: ZONE });
  const end = DateTime.fromISO(isoEnd, { zone: ZONE });
  return Math.max(end.diff(start, "minutes").minutes, CALENDAR_SLOT_MINUTES);
}

export function addDaysIso(dateIso: string, days: number): string {
  return DateTime.fromISO(dateIso, { zone: ZONE }).plus({ days }).toISODate()!;
}

export function startOfWeekIso(dateIso: string): string {
  const dt = DateTime.fromISO(dateIso, { zone: ZONE });
  const weekday = dt.weekday;
  return dt.minus({ days: weekday - 1 }).toISODate()!;
}

export function weekDayDatesFromMonday(weekStartIso: string): string[] {
  const start = DateTime.fromISO(weekStartIso, { zone: ZONE });
  return Array.from({ length: 7 }, (_, i) =>
    start.plus({ days: i }).toISODate()!,
  );
}
