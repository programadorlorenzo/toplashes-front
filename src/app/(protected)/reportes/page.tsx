"use client";

import { Grid, Paper, Stack, Text, Title } from "@mantine/core";
import { BarChart3, CalendarRange, Users } from "lucide-react";

const REPORT_CARDS = [
  {
    title: "Ventas por periodo",
    description: "Ingresos, métodos de pago y comparativos.",
    icon: BarChart3,
  },
  {
    title: "Ocupación de colaboradoras",
    description: "Horas atendidas y tiempos muertos.",
    icon: Users,
  },
  {
    title: "Reservas e inasistencias",
    description: "Tendencias de agenda y no-show.",
    icon: CalendarRange,
  },
];

export default function ReportesPage() {
  return (
    <Stack gap="xl">
      <Stack gap={4}>
        <Title
          order={2}
          style={{
            fontFamily: "var(--font-heading), Georgia, serif",
            color: "hsl(var(--tl-brown-dark))",
            fontWeight: 500,
          }}
        >
          Reportes
        </Title>
        <Text c="dimmed">Análisis operativos y financieros del negocio.</Text>
      </Stack>

      <Grid>
        {REPORT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Grid.Col key={card.title} span={{ base: 12, md: 4 }}>
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
                <Stack gap="sm">
                  <Icon size={22} style={{ color: "hsl(var(--tl-taupe))" }} />
                  <Text fw={600} style={{ color: "hsl(var(--tl-brown-dark))" }}>
                    {card.title}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {card.description}
                  </Text>
                  <Text size="sm" fw={500} c="grape">
                    Próximamente
                  </Text>
                </Stack>
              </Paper>
            </Grid.Col>
          );
        })}
      </Grid>
    </Stack>
  );
}
