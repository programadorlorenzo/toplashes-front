"use client";

import { Paper, Stack, Text } from "@mantine/core";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartPie } from "lucide-react";
import type { StatusCountDto } from "@/generated-client";

interface StatusDonutChartProps {
  data: StatusCountDto[];
}

const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "Pendientes",
  confirmed: "Confirmadas",
  client_present: "Presente",
  in_service: "En atención",
  completed: "Completadas",
  cancelled: "Canceladas",
  no_show: "Inasistencias",
};

const STATUS_COLORS: Record<string, string> = {
  pending_confirmation: "#f59e0b",
  confirmed: "#3b82f6",
  client_present: "#8b5cf6",
  in_service: "#ec4899",
  completed: "#22c55e",
  cancelled: "#ef4444",
  no_show: "#6b7280",
};

export function StatusDonutChart({ data }: StatusDonutChartProps) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: STATUS_LABELS[d.status] ?? d.status,
      value: d.count,
      color: STATUS_COLORS[d.status] ?? "#8B7355",
    }));

  const total = chartData.reduce((s, d) => s + d.value, 0);

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
      <Stack gap="md">
        <Stack gap={2}>
          <Text
            size="sm"
            fw={600}
            style={{
              color: "hsl(var(--tl-brown-dark))",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <ChartPie size={16} />
            Reservas por estado
          </Text>
          <Text size="xs" c="dimmed">
            {total} reservas en el período
          </Text>
        </Stack>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [value, name]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #d4c5b0",
                fontSize: 12,
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
}
