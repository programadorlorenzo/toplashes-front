"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Center,
  Divider,
  Group,
  Loader,
  Modal,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { CheckCircle, Clock, TrendingUp, XCircle } from "lucide-react";
import type {
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { reservasApi, serviciosApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatSoles } from "@/lib/format";
import { MiniStat, ReservationCard } from "./customer-history-card";

interface CustomerReservationsModalProps {
  opened: boolean;
  onClose: () => void;
  customerId: number | null;
  customerName: string;
  onSelectReservation?: (id: number) => void;
}

function computeStats(items: ReservationResponseDto[]) {
  let completed = 0;
  let cancelled = 0;
  let noShow = 0;
  let totalSpent = 0;
  for (const r of items) {
    if (r.status === "completed") {
      completed++;
      totalSpent += parseFloat(r.totalAmount);
    }
    if (r.status === "cancelled") cancelled++;
    if (r.status === "no_show") noShow++;
  }
  return { total: items.length, completed, cancelled, noShow, totalSpent };
}

export function CustomerReservationsModal({
  opened,
  onClose,
  customerId,
  customerName,
  onSelectReservation,
}: CustomerReservationsModalProps) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ReservationResponseDto[]>([]);
  const [servicesById, setServicesById] = useState<
    Record<number, ServiceResponseDto>
  >({});

  const load = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const [res, svcRes] = await Promise.all([
        reservasApi.reservationControllerFindAll(
          undefined,
          undefined,
          undefined,
          customerId,
        ),
        serviciosApi.serviceControllerFindAll(),
      ]);
      setItems(res.data);
      setServicesById(Object.fromEntries(svcRes.data.map((s) => [s.id, s])));
    } catch (error) {
      notifications.show({
        title: "Error al cargar historial",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    if (opened && customerId) void load();
  }, [opened, customerId, load]);

  const stats = useMemo(() => computeStats(items), [items]);
  const sorted = useMemo(
    () =>
      [...items].sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime() ||
          b.id - a.id,
      ),
    [items],
  );

  const headerGradient =
    "linear-gradient(135deg, hsl(28 11% 60%) 0%, hsl(24 10% 48%) 100%)";
  const headerRadius = "var(--mantine-radius-md) var(--mantine-radius-md) 0 0";

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      withCloseButton={false}
      padding={0}
      radius="md"
      styles={{ body: { padding: 0 } }}
    >
      <Box
        px="lg"
        py="md"
        style={{ background: headerGradient, borderRadius: headerRadius }}
      >
        <Group justify="space-between" align="center">
          <Stack gap={0}>
            <Text size="lg" fw={600} c="white">
              {customerName}
            </Text>
            <Text size="xs" c="rgba(255,255,255,0.7)">
              Historial completo de reservas
            </Text>
          </Stack>
          <Badge color="white" variant="light" size="lg" radius="sm">
            {stats.total} reserva{stats.total !== 1 ? "s" : ""}
          </Badge>
        </Group>
      </Box>

      <Stack gap="md" px="lg" py="md">
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : items.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Esta clienta no tiene reservas registradas.
          </Text>
        ) : (
          <>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
              <MiniStat
                label="Completadas"
                value={stats.completed}
                icon={<CheckCircle size={12} />}
                color="green"
              />
              <MiniStat
                label="Canceladas"
                value={stats.cancelled}
                icon={<XCircle size={12} />}
                color="red"
              />
              <MiniStat
                label="Inasistencias"
                value={stats.noShow}
                icon={<Clock size={12} />}
                color="gray"
              />
              <MiniStat
                label="Total gastado"
                value={formatSoles(stats.totalSpent)}
                icon={<TrendingUp size={12} />}
                color="grape"
              />
            </SimpleGrid>
            <Divider />
            <ScrollArea type="auto" mah={380}>
              <Stack gap="xs">
                {sorted.map((r) => (
                  <ReservationCard
                    key={r.id}
                    r={r}
                    servicesById={servicesById}
                    onClick={
                      onSelectReservation
                        ? () => onSelectReservation(r.id)
                        : undefined
                    }
                  />
                ))}
              </Stack>
            </ScrollArea>
          </>
        )}
        <Group justify="flex-end">
          <UnstyledButton onClick={onClose}>
            <Text size="sm" c="dimmed" td="underline">
              Cerrar
            </Text>
          </UnstyledButton>
        </Group>
      </Stack>
    </Modal>
  );
}
