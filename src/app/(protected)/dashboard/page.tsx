"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Badge,
  Center,
  Grid,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import {
  CalendarCheck,
  CircleDollarSign,
  Clock,
  Sparkles,
  Users,
} from "lucide-react";
import type { DailyStatsResponseDto } from "@/generated-client";
import { dashboardApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatSoles } from "@/lib/format";
import { todayISO, toISODate } from "@/lib/date-utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBranchStore } from "@/stores/branch-store";
function formatMinutesField(value: object | null): string {
  if (value === null || typeof value !== "number") {
    return "—";
  }
  return `${value} min`;
}

function formatSignedMinutesField(value: object | null): string {
  if (value === null || typeof value !== "number") {
    return "—";
  }
  return `${value > 0 ? "+" : ""}${value} min`;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  accent?: string;
}

function StatCard({ title, value, icon, accent }: StatCardProps) {
  return (
    <Paper
      withBorder
      radius="md"
      p="lg"
      style={{
        backgroundColor: "hsl(var(--card))",
        borderColor: "hsl(var(--border))",
        height: "100%",
      }}
    >
      <Stack gap="xs">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Text size="sm" c="dimmed">
            {title}
          </Text>
          {icon && (
            <span
              style={{ color: accent ?? "hsl(var(--tl-taupe))", opacity: 0.85 }}
            >
              {icon}
            </span>
          )}
        </Group>
        <Text size="xl" fw={600} style={{ color: "hsl(var(--tl-brown-dark))" }}>
          {value}
        </Text>
      </Stack>
    </Paper>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const firstName = user?.name?.split(" ")[0] ?? "equipo";

  const [date, setDate] = useState<string>(todayISO());
  const [stats, setStats] = useState<DailyStatsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!selectedBranch) {
      setStats(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await dashboardApi.dashboardControllerGetDailyStats(
        selectedBranch.id,
        date,
      );
      setStats(data);
    } catch (error) {
      notifications.show({
        title: "Error al cargar dashboard",
        message: getApiErrorMessage(error),
        color: "red",
      });
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch, date]);

  useEffect(() => {
    void load();
  }, [load]);

  const taupe = "hsl(var(--tl-taupe))";

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Stack gap={4}>
          <Title
            order={2}
            style={{
              fontFamily: "var(--font-heading), Georgia, serif",
              color: "hsl(var(--tl-brown-dark))",
              fontWeight: 500,
            }}
          >
            Dashboard
          </Title>
          <Text c="dimmed">
            Bienvenida, {firstName}. Resumen de{" "}
            {selectedBranch?.name ?? "tu local"}.
          </Text>
        </Stack>
        <DatePickerInput
          label="Fecha"
          value={date ? new Date(`${date}T12:00:00`) : null}
          onChange={(value) => {
            if (value) setDate(toISODate(value));
          }}
          maxDate={new Date()}
          w={{ base: "100%", sm: 220 }}
        />
      </Group>

      {!selectedBranch && (
        <Paper
          withBorder
          p="lg"
          radius="md"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          <Text c="dimmed">
            Selecciona un local en la barra lateral para ver estadísticas.
          </Text>
        </Paper>
      )}

      {selectedBranch && loading && (
        <Center py="xl">
          <Loader color="grape" />
        </Center>
      )}

      {selectedBranch && !loading && stats && (
        <>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <StatCard
                title="Reservas del día"
                value={stats.reservationsToday}
                icon={<CalendarCheck size={20} />}
                accent={taupe}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <StatCard
                title="Confirmadas"
                value={stats.confirmedReservations}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <StatCard title="En atención" value={stats.inServiceCount} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <StatCard title="Finalizadas" value={stats.completedCount} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <StatCard title="Cancelaciones" value={stats.cancelledCount} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 2 }}>
              <StatCard title="Inasistencias" value={stats.noShowCount} />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <StatCard
                title="Colaboradoras disponibles"
                value={stats.employeesAvailable}
                icon={<Users size={20} />}
                accent={taupe}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <StatCard
                title="Colaboradoras ocupadas"
                value={stats.employeesOccupied}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <StatCard
                title="Total cobrado"
                value={formatSoles(parseFloat(stats.totalPaymentsReceived))}
                icon={<CircleDollarSign size={20} />}
                accent={taupe}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
              <StatCard
                title="Saldo pendiente"
                value={formatSoles(parseFloat(stats.pendingBalance))}
              />
            </Grid.Col>
          </Grid>

          <Grid>
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <Paper
                withBorder
                radius="md"
                p="lg"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <Group gap="xs" mb="md">
                  <Sparkles size={18} style={{ color: taupe }} />
                  <Text fw={600} style={{ color: "hsl(var(--tl-brown-dark))" }}>
                    Top servicios
                  </Text>
                </Group>
                {stats.topServices.length === 0 ? (
                  <Text size="sm" c="dimmed">
                    Sin servicios registrados para esta fecha.
                  </Text>
                ) : (
                  <Stack gap="sm">
                    {stats.topServices.map((svc, index) => (
                      <Group key={svc.serviceId} justify="space-between">
                        <Group gap="sm">
                          <Badge variant="light" color="grape" circle>
                            {index + 1}
                          </Badge>
                          <Text size="sm">{svc.serviceName}</Text>
                        </Group>
                        <Text size="sm" fw={500}>
                          {svc.count}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <Paper
                withBorder
                radius="md"
                p="lg"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                }}
              >
                <Group gap="xs" mb="md">
                  <Clock size={18} style={{ color: taupe }} />
                  <Text fw={600} style={{ color: "hsl(var(--tl-brown-dark))" }}>
                    Tiempos de atención
                  </Text>
                </Group>
                <Stack gap="md">
                  <div>
                    <Text size="sm" c="dimmed">
                      Promedio de atención
                    </Text>
                    <Text fw={600} size="lg">
                      {formatMinutesField(stats.averageServiceTime)}
                    </Text>
                  </div>
                  <div>
                    <Text size="sm" c="dimmed">
                      Diferencia estimado vs. real (promedio)
                    </Text>
                    <Text fw={600} size="lg">
                      {formatSignedMinutesField(stats.estimateVsActualDiff)}
                    </Text>
                  </div>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>
        </>
      )}
    </Stack>
  );
}
