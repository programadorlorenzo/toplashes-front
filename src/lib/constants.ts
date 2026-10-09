export const WORK_DAYS: { value: number; label: string }[] = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
];

export function formatWorkDays(days: number[]): string {
  const sorted = [...days].sort((a, b) => a - b);
  return sorted
    .map((d) => WORK_DAYS.find((w) => w.value === d)?.label ?? String(d))
    .join(", ");
}
