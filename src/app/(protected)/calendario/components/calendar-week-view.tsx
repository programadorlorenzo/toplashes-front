"use client";

import { Box, Group, ScrollArea, Text } from "@mantine/core";
import { DateTime } from "luxon";
import { formatDate } from "@/lib/date-utils";
import { RESERVATION_STATUS_COLORS } from "@/lib/reservation-utils";
import type {
  EmployeeResponseDto,
  ReservationResponseDto,
} from "@/generated-client";

interface CalendarWeekViewProps {
  weekDates: string[];
  employees: EmployeeResponseDto[];
  reservations: ReservationResponseDto[];
  customerNames: Record<number, string>;
  onReservationClick: (reservationId: number) => void;
}

export function CalendarWeekView({
  weekDates,
  employees,
  reservations,
  customerNames,
  onReservationClick,
}: CalendarWeekViewProps) {
  const reservationsByEmployeeDate = new Map<
    string,
    ReservationResponseDto[]
  >();

  for (const reservation of reservations) {
    for (const line of reservation.services) {
      const key = `${line.employeeId}-${reservation.date}`;
      const list = reservationsByEmployeeDate.get(key) ?? [];
      if (!list.some((r) => r.id === reservation.id)) {
        list.push(reservation);
      }
      reservationsByEmployeeDate.set(key, list);
    }
  }

  return (
    <ScrollArea type="auto" offsetScrollbars>
      <Box miw={900}>
        <Group gap={0} wrap="nowrap" align="stretch">
          <Box w={140} style={{ flexShrink: 0 }}>
            <Box
              h={48}
              style={{ borderBottom: "1px solid hsl(var(--border))" }}
            />
            {employees.map((employee) => (
              <Box
                key={employee.id}
                h={72}
                px="xs"
                style={{
                  borderBottom: "1px solid hsl(var(--border))",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Text size="sm" fw={500} lineClamp={2}>
                  {employee.firstName} {employee.lastName}
                </Text>
              </Box>
            ))}
          </Box>

          {weekDates.map((dateIso) => {
            const dt = DateTime.fromISO(dateIso, { zone: "America/Lima" });
            const dayLabel = dt.setLocale("es").toFormat("ccc dd/MM");

            return (
              <Box
                key={dateIso}
                style={{
                  flex: 1,
                  minWidth: 100,
                  borderLeft: "1px solid hsl(var(--border))",
                }}
              >
                <Box
                  h={48}
                  px="xs"
                  style={{
                    borderBottom: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--muted))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text size="sm" fw={600} tt="capitalize">
                    {dayLabel}
                  </Text>
                </Box>

                {employees.map((employee) => {
                  const key = `${employee.id}-${dateIso}`;
                  const dayReservations =
                    reservationsByEmployeeDate.get(key) ?? [];

                  return (
                    <Box
                      key={key}
                      h={72}
                      p={4}
                      style={{
                        borderBottom: "1px solid hsl(var(--border))",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        overflow: "hidden",
                      }}
                    >
                      {dayReservations.slice(0, 3).map((reservation) => {
                        const color =
                          RESERVATION_STATUS_COLORS[reservation.status];
                        const name =
                          customerNames[reservation.customerId] ??
                          `#${reservation.customerId}`;

                        return (
                          <Box
                            key={reservation.id}
                            component="button"
                            type="button"
                            onClick={() => onReservationClick(reservation.id)}
                            style={{
                              border: "none",
                              borderRadius: "var(--mantine-radius-sm)",
                              padding: "2px 6px",
                              textAlign: "left",
                              cursor: "pointer",
                              backgroundColor: `var(--mantine-color-${color}-1)`,
                              borderLeft: `3px solid var(--mantine-color-${color}-6)`,
                            }}
                          >
                            <Text size="xs" fw={600} lineClamp={1}>
                              {name}
                            </Text>
                            <Text size="10px" c="dimmed">
                              {formatDate(reservation.date)}
                            </Text>
                          </Box>
                        );
                      })}
                      {dayReservations.length > 3 && (
                        <Text size="xs" c="dimmed">
                          +{dayReservations.length - 3} más
                        </Text>
                      )}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Group>
      </Box>
    </ScrollArea>
  );
}
