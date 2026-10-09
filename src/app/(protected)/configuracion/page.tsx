"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Center,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Calendar, LinkIcon, Unlink } from "lucide-react";
import type { GoogleCalendarTokenResponseDto } from "@/generated-client";
import { API_BASE_URL, googleCalendarApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { pageTitleStyle } from "@/lib/crud-styles";
import { useBranchStore } from "@/stores/branch-store";

export default function ConfiguracionPage() {
  const branches = useBranchStore((s) => s.branches);
  const [tokens, setTokens] = useState<GoogleCalendarTokenResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const loadTokens = useCallback(async () => {
    try {
      const { data } =
        await googleCalendarApi.googleCalendarControllerListTokens();
      setTokens(data);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTokens();
  }, [loadTokens]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("gcal") === "ok") {
      notifications.show({
        title: "Google Calendar conectado",
        message: "Las reservas se sincronizarán automáticamente.",
        color: "green",
      });
      window.history.replaceState({}, "", "/configuracion");
      void loadTokens();
    }
  }, [loadTokens]);

  const handleConnect = () => {
    setConnecting(true);
    const branchParam = selectedBranchId ? `?branchId=${selectedBranchId}` : "";
    window.location.href = `${API_BASE_URL}/google-calendar/connect${branchParam}`;
  };

  const handleDisconnect = async (id: number) => {
    try {
      await googleCalendarApi.googleCalendarControllerDisconnect(id);
      notifications.show({
        title: "Desconectado",
        message: "Google Calendar desconectado correctamente.",
        color: "orange",
      });
      await loadTokens();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: getApiErrorMessage(error),
        color: "red",
      });
    }
  };

  const branchOptions = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  const getBranchName = (branchId?: number) => {
    if (!branchId) return "Global (todos los locales)";
    return (
      branches.find((b) => b.id === branchId)?.name ?? `Local #${branchId}`
    );
  };

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={2} style={pageTitleStyle}>
          Configuración
        </Title>
        <Text c="dimmed">Integraciones y ajustes del sistema.</Text>
      </Stack>

      <Card withBorder radius="md" p="lg">
        <Group mb="md">
          <Calendar size={24} />
          <Title order={4}>Google Calendar</Title>
        </Group>
        <Text c="dimmed" size="sm" mb="lg">
          Sincroniza reservas automáticamente con Google Calendar. Cada reserva
          creada, actualizada o cancelada se refleja en tu calendario.
        </Text>

        <Group align="flex-end" mb="lg">
          <Select
            label="Local a conectar"
            placeholder="Selecciona un local"
            data={branchOptions}
            value={selectedBranchId}
            onChange={setSelectedBranchId}
            style={{ flex: 1 }}
          />
          <Button
            leftSection={<LinkIcon size={16} />}
            loading={connecting}
            onClick={handleConnect}
            disabled={!selectedBranchId}
            styles={{
              root: {
                backgroundColor: "var(--color-primary)",
                "&:hover": { backgroundColor: "var(--color-primary-dark)" },
              },
            }}
          >
            Conectar con Google
          </Button>
        </Group>

        {loading ? (
          <Center py="md">
            <Loader color="gray" type="dots" />
          </Center>
        ) : tokens.length === 0 ? (
          <Text c="dimmed" ta="center" py="md">
            No hay cuentas de Google Calendar conectadas.
          </Text>
        ) : (
          <Stack gap="sm">
            <Text fw={600} size="sm">
              Cuentas conectadas
            </Text>
            {tokens.map((token) => (
              <Card key={token.id} withBorder radius="sm" p="sm">
                <Group justify="space-between">
                  <Group gap="sm">
                    <Calendar size={18} />
                    <div>
                      <Text size="sm" fw={500}>
                        {token.email}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {getBranchName(token.branchId)}
                      </Text>
                    </div>
                    <Badge
                      color={token.isActive ? "green" : "gray"}
                      variant="light"
                      size="sm"
                    >
                      {token.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </Group>
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    leftSection={<Unlink size={14} />}
                    onClick={() => void handleDisconnect(token.id)}
                  >
                    Desconectar
                  </Button>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Card>
    </Stack>
  );
}
