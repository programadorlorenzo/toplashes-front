"use client";

import { Divider, Grid, ScrollArea, Text } from "@mantine/core";
import type {
  EmployeeResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { EmployeeDayCard, type EmployeeBooking } from "./employee-day-card";

interface ServiceSelection {
  serviceId: number;
  employeeId: number | null;
}

interface EmployeeGridProps {
  activeService: ServiceResponseDto;
  qualifiedEmployees: EmployeeResponseDto[];
  bookingsByEmployee: Record<number, EmployeeBooking[]>;
  times: Record<string, string>;
  onTimeChange: (key: string, value: string) => void;
  selections: ServiceSelection[];
  onSelectEmployee: (empId: number | null, empName: string) => void;
}

export function EmployeeGrid({
  activeService,
  qualifiedEmployees,
  bookingsByEmployee,
  times,
  onTimeChange,
  selections,
  onSelectEmployee,
}: EmployeeGridProps) {
  return (
    <>
      <Divider
        label={`Asignar: ${activeService.name} (${activeService.duration} min)`}
        labelPosition="center"
      />

      {qualifiedEmployees.length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" py="sm">
          No hay colaboradoras para este servicio en este local.
        </Text>
      ) : null}

      <ScrollArea.Autosize mah={280}>
        <Grid gap="sm">
          {qualifiedEmployees.map((emp) => {
            const key = String(emp.id);
            return (
              <Grid.Col span={{ base: 12, sm: 6 }} key={emp.id}>
                <EmployeeDayCard
                  name={`${emp.firstName} ${emp.lastName}`}
                  bookings={bookingsByEmployee[emp.id] ?? []}
                  time={times[key] ?? ""}
                  onTimeChange={(v) => onTimeChange(key, v)}
                  onSelect={() =>
                    onSelectEmployee(emp.id, `${emp.firstName} ${emp.lastName}`)
                  }
                  isSelected={selections.some((s) => s.employeeId === emp.id)}
                  serviceDuration={activeService.duration}
                />
              </Grid.Col>
            );
          })}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <EmployeeDayCard
              name="Sin asignar"
              bookings={[]}
              time={times["none"] ?? ""}
              onTimeChange={(v) => onTimeChange("none", v)}
              onSelect={() => onSelectEmployee(null, "Sin asignar")}
              isSelected={selections.some((s) => s.employeeId === null)}
              serviceDuration={activeService.duration}
            />
          </Grid.Col>
        </Grid>
      </ScrollArea.Autosize>
    </>
  );
}
