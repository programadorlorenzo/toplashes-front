"use client";

import { useEffect, useState } from "react";
import { Badge, Group, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import type {
  EmployeeResponseDto,
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { colaboradorasApi, reservasApi } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/date-utils";
import { formatSoles } from "@/lib/format";
import {
  RESERVATION_STATUS_COLORS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";

interface CustomerHistoryInlineProps {
  customerId: number;
  customerName: string;
  servicesById: Record<number, ServiceResponseDto>;
}

export function CustomerHistoryInline({
  customerId,
  customerName,
  servicesById,
}: CustomerHistoryInlineProps) {
  const [history, setHistory] = useState<ReservationResponseDto[]>([]);
  const [empNames, setEmpNames] = useState<Record<number, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await reservasApi.reservationControllerFindAll(
          undefined,
          undefined,
          undefined,
          customerId,
        );
        setHistory(data.slice(0, 10));

        const empIds = new Set<number>();
        for (const r of data) {
          for (const line of r.services) {
            if (line.employeeId !== null) empIds.add(line.employeeId);
          }
        }
        if (empIds.size > 0) {
          const { data: emps } =
            await colaboradorasApi.employeeControllerFindAll();
          const names: Record<number, string> = {};
          for (const e of emps) {
            if (empIds.has(e.id)) {
              names[e.id] = `${e.firstName} ${e.lastName}`;
            }
          }
          setEmpNames(names);
        }
      } catch {
        setHistory([]);
      } finally {
        setLoaded(true);
      }
    }
    void load();
  }, [customerId]);

  if (!loaded) {
    return (
      <Text size="xs" c="dimmed">
        Cargando historial...
      </Text>
    );
  }

  const completed = history.filter((r) => r.status === "completed").length;
  const totalSpent = history
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + parseFloat(r.totalAmount), 0);

  return (
    <Stack gap="xs">
      <Group gap="xs">
        <Text size="sm" fw={600}>
          Historial de {customerName}
        </Text>
        <Badge size="xs" variant="light">
          {completed} visitas
        </Badge>
        {totalSpent > 0 && (
          <Badge size="xs" variant="light" color="green">
            {formatSoles(totalSpent)} gastado
          </Badge>
        )}
      </Group>

      {history.length === 0 ? (
        <Text size="xs" c="dimmed" fs="italic">
          Primera visita — sin historial
        </Text>
      ) : (
        <ScrollArea.Autosize mah={160}>
          <Stack gap={4}>
            {history.map((r) => (
              <Paper key={r.id} p="xs" radius="sm" withBorder>
                <Group justify="space-between" wrap="nowrap" gap="xs">
                  <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
                    <Group gap={6}>
                      <Text size="xs" fw={500}>
                        {formatDate(r.date)}
                      </Text>
                      <Badge
                        size="xs"
                        color={RESERVATION_STATUS_COLORS[r.status]}
                      >
                        {RESERVATION_STATUS_LABELS[r.status]}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dimmed" truncate>
                      {r.services
                        .map((s) => {
                          const svc =
                            servicesById[s.serviceId]?.name ??
                            `#${s.serviceId}`;
                          const emp =
                            s.employeeId !== null
                              ? (empNames[s.employeeId] ?? "")
                              : "Sin asignar";
                          return `${svc} (${emp})`;
                        })
                        .join(" · ")}
                    </Text>
                  </Stack>
                  <Text size="xs" fw={500}>
                    {formatSoles(parseFloat(r.totalAmount))}
                  </Text>
                </Group>
              </Paper>
            ))}
          </Stack>
        </ScrollArea.Autosize>
      )}
    </Stack>
  );
}
