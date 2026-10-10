"use client";

import { useCallback, useEffect, useState } from "react";
import { Center, Grid, Loader, Paper, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type { WeeklyStatsResponseDto } from "@/generated-client";
import { dashboardApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { todayISO } from "@/lib/date-utils";
import { useAuthStore } from "@/stores/auth-store";
import { useBranchStore } from "@/stores/branch-store";
import { DateRangeFilter } from "./components/date-range-filter";
import { RevenueChart } from "./components/revenue-chart";
import { StatusDonutChart } from "./components/status-donut-chart";
import { HourlyChart } from "./components/hourly-chart";
import { EmployeeChart } from "./components/employee-chart";
import { TrendChart } from "./components/trend-chart";
import { TopServicesSection } from "./components/top-services-card";

interface DateRange {
  startDate: string;
  endDate: string;
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const firstName = user?.name?.split(" ")[0] ?? "equipo";

  const today = todayISO();
  const [range, setRange] = useState<DateRange>({
    startDate: today,
    endDate: today,
  });
  const [data, setData] = useState<WeeklyStatsResponseDto | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!selectedBranch) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data: res } = await dashboardApi.dashboardControllerGetRangeStats(
        selectedBranch.id,
        range.startDate,
        range.endDate,
      );
      setData(res);
    } catch (error) {
      notifications.show({
        title: "Error al cargar dashboard",
        message: getApiErrorMessage(error),
        color: "red",
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch, range]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <Stack gap="lg">
      <Stack gap={4} align="center">
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
        <Text c="dimmed" size="sm">
          Bienvenida, {firstName}. Resumen de{" "}
          {selectedBranch?.name ?? "tu local"}.
        </Text>
      </Stack>

      <DateRangeFilter onChange={setRange} />

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

      {selectedBranch && !loading && data && (
        <>
          <TopServicesSection
            topServices={data.topServices}
            averageServiceTime={
              data.averageServiceTime as unknown as number | null
            }
            estimateVsActualDiff={
              data.estimateVsActualDiff as unknown as number | null
            }
          />

          <Grid>
            <Grid.Col span={{ base: 12, lg: 7 }}>
              <RevenueChart data={data.dailyRevenue} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 5 }}>
              <StatusDonutChart data={data.reservationsByStatus} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <HourlyChart data={data.reservationsByHour} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <EmployeeChart data={data.employeeProductivity} />
            </Grid.Col>
            <Grid.Col span={12}>
              <TrendChart data={data.dailyReservationTrend} />
            </Grid.Col>
          </Grid>
        </>
      )}
    </Stack>
  );
}
