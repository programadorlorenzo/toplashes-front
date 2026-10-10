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
  Legend,
} from "recharts";
import { Users } from "lucide-react";
import type { EmployeeProductivityDto } from "@/generated-client";

interface EmployeeChartProps {
  data: EmployeeProductivityDto[];
}

export function EmployeeChart({ data }: EmployeeChartProps) {
  const chartData = data.map((d) => {
    const parts = d.employeeName.split(" ");
    return {
      name: parts[0] ?? d.employeeName,
      completadas: d.completedCount,
      pendientes: d.totalCount - d.completedCount,
    };
  });

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
            <Users size={16} />
            Productividad por colaboradora
          </Text>
          <Text size="xs" c="dimmed">
            Atenciones completadas vs. asignadas
          </Text>
        </Stack>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e8e0d8" />
            <XAxis
              type="number"
              fontSize={11}
              tick={{ fill: "#8B7355" }}
              allowDecimals={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              fontSize={11}
              tick={{ fill: "#8B7355" }}
              width={80}
            />
            <Tooltip
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
            <Bar
              dataKey="completadas"
              name="Completadas"
              stackId="a"
              fill="#22c55e"
              radius={[0, 0, 0, 0]}
              maxBarSize={24}
            />
            <Bar
              dataKey="pendientes"
              name="Otras"
              stackId="a"
              fill="#d4c5b0"
              radius={[0, 4, 4, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </Stack>
    </Paper>
  );
}
