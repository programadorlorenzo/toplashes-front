'use client';

import { Paper, Stack, Text, Title } from '@mantine/core';
import { Settings } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <Stack gap="xl">
      <Stack gap={4}>
        <Title
          order={2}
          style={{
            fontFamily: 'var(--font-heading), Georgia, serif',
            color: 'hsl(var(--tl-brown-dark))',
            fontWeight: 500,
          }}
        >
          Configuración
        </Title>
        <Text c="dimmed">
          Preferencias del sistema y datos generales.
        </Text>
      </Stack>

      <Paper
        withBorder
        radius="md"
        p="lg"
        style={{
          backgroundColor: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
        }}
      >
        <Stack gap="md">
          <Settings size={22} style={{ color: 'hsl(var(--tl-taupe))' }} />
          <div>
            <Text size="sm" c="dimmed">
              Sistema
            </Text>
            <Text fw={600}>Top Lashes Perú — Panel administrativo</Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Versión
            </Text>
            <Text>1.0 (desarrollo)</Text>
          </div>
          <Text size="sm" c="dimmed">
            Próximamente podrás ajustar notificaciones, integraciones y parámetros
            operativos desde esta sección.
          </Text>
        </Stack>
      </Paper>
    </Stack>
  );
}
