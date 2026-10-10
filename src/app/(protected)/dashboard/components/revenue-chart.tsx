"use client";

import { Paper, Stack, Text } from "@mantine/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import type { DayRevenueDto } from "@/generated-client";

interface RevenueChartProps {
  data: DayRevenueDto[];
}

function formatDayLabel(dateStr: string): string {
  const parts = dateStr.split("-");
  return `${parts[2]}/${parts[1]}`;
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    date: formatDayLabel(d.date),
    total: parseFloat(d.total),
  }));

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
            <TrendingUp size={16} />
            Ingresos por día
          </Text>
          <Text size="xs" c="dimmed">
            Total cobrado (S/)
          </Text>
        </Stack>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
            <XAxis dataKey="date" fontSize={11} tick={{ fill: "#8B7355" }} />
            <YAxis fontSize={11} tick={{ fill: "#8B7355" }} width={50} />
            <Tooltip
              formatter={(value) => [`S/ ${Number(value).toFixed(2)}`, "Total"]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #d4c5b0",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="total"
              fill="#a89279"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
}
