"use client";

import { Badge, Grid, Group, Paper, Stack, Text } from "@mantine/core";
import { Clock, Sparkles } from "lucide-react";
import type { TopServiceStatDto } from "@/generated-client";

interface TopServicesCardProps {
  topServices: TopServiceStatDto[];
  averageServiceTime: number | null;
  estimateVsActualDiff: number | null;
}

function formatMinutesField(value: number | null): string {
  if (value === null) return "—";
  return `${value} min`;
}

function formatSignedMinutesField(value: number | null): string {
  if (value === null) return "—";
  return `${value > 0 ? "+" : ""}${value} min`;
}

const taupe = "hsl(var(--tl-taupe))";
const cardStyle = {
  backgroundColor: "hsl(var(--card))",
  borderColor: "hsl(var(--border))",
};

export function TopServicesSection({
  topServices,
  averageServiceTime,
  estimateVsActualDiff,
}: TopServicesCardProps) {
  return (
    <Grid>
      <Grid.Col span={{ base: 12, lg: 7 }}>
        <Paper withBorder radius="md" p="lg" style={cardStyle}>
          <Group gap="xs" mb="md">
            <Sparkles size={18} style={{ color: taupe }} />
            <Text fw={600} style={{ color: "hsl(var(--tl-brown-dark))" }}>
              Top servicios
            </Text>
          </Group>
          {topServices.length === 0 ? (
            <Text size="sm" c="dimmed">
              Sin servicios registrados para esta fecha.
            </Text>
          ) : (
            <Stack gap="sm">
              {topServices.map((svc, index) => (
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
        <Paper withBorder radius="md" p="lg" style={cardStyle}>
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
                {formatMinutesField(averageServiceTime)}
              </Text>
            </div>
            <div>
              <Text size="sm" c="dimmed">
                Diferencia estimado vs. real (promedio)
              </Text>
              <Text fw={600} size="lg">
                {formatSignedMinutesField(estimateVsActualDiff)}
              </Text>
            </div>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>
  );
}
