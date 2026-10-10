"use client";

import { Paper, Stack, Text } from "@mantine/core";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays } from "lucide-react";
import type { DayReservationCountDto } from "@/generated-client";

interface TrendChartProps {
  data: DayReservationCountDto[];
}

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function formatDayLabel(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return `${DAY_NAMES[day]} ${d}/${m}`;
}

export function TrendChart({ data }: TrendChartProps) {
  const chartData = data.map((d) => ({
    date: formatDayLabel(d.date),
    reservas: d.count,
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
            <CalendarDays size={16} />
            Tendencia de reservas
          </Text>
          <Text size="xs" c="dimmed">
            Reservas por día
          </Text>
        </Stack>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a89279" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a89279" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
            <XAxis dataKey="date" fontSize={10} tick={{ fill: "#8B7355" }} />
            <YAxis
              fontSize={11}
              tick={{ fill: "#8B7355" }}
              width={30}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(value) => [value, "Reservas"]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #d4c5b0",
                fontSize: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="reservas"
              stroke="#8B7355"
              strokeWidth={2}
              fill="url(#trendFill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
}
