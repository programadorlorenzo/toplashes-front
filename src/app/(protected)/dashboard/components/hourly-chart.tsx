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
import { Clock } from "lucide-react";
import type { HourCountDto } from "@/generated-client";

interface HourlyChartProps {
  data: HourCountDto[];
}

export function HourlyChart({ data }: HourlyChartProps) {
  const chartData = data.map((d) => ({
    hour: `${String(d.hour).padStart(2, "0")}:00`,
    count: d.count,
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
            <Clock size={16} />
            Demanda por hora
          </Text>
          <Text size="xs" c="dimmed">
            Servicios agendados por hora
          </Text>
        </Stack>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
            <XAxis dataKey="hour" fontSize={10} tick={{ fill: "#8B7355" }} />
            <YAxis
              fontSize={11}
              tick={{ fill: "#8B7355" }}
              width={30}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value) => [value, "Servicios"]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #d4c5b0",
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="count"
              fill="#c4a882"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
}
