'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle, primaryButtonStyles } from '@/lib/crud-styles';
import { formatTime } from '@/lib/date-utils';
import type { AvailableSlot, Service } from '@/types/api';

export interface SelectedServiceSlot {
  serviceId: number;
  employeeId: number;
  startTime: string;
  endTime: string;
  employeeName: string;
  agreedPrice: number;
}

interface StepAvailabilityProps {
  branchId: number;
  date: string;
  serviceIds: number[];
  servicesById: Record<number, Service>;
  preselectedEmployeeId?: number;
  preselectedStartTime?: string;
  selections: SelectedServiceSlot[];
  onSelectionsChange: (value: SelectedServiceSlot[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

export function StepAvailability({
  branchId,
  date,
  serviceIds,
  servicesById,
  preselectedEmployeeId,
  preselectedStartTime,
  selections,
  onSelectionsChange,
  onBack,
  onContinue,
}: StepAvailabilityProps) {
  const [loading, setLoading] = useState(true);
  const [slotsByService, setSlotsByService] = useState<
    Record<number, AvailableSlot[]>
  >({});

  const loadSlots = useCallback(async () => {
    setLoading(true);
    try {
      const entries = await Promise.all(
        serviceIds.map(async (serviceId) => {
          const { data } = await api.get<AvailableSlot[]>('/availability', {
            params: {
              branchId,
              serviceId,
              date,
              ...(preselectedEmployeeId
                ? { employeeId: preselectedEmployeeId }
                : {}),
            },
          });
          return [serviceId, data] as const;
        }),
      );
      setSlotsByService(Object.fromEntries(entries));

      if (preselectedStartTime && preselectedEmployeeId && serviceIds[0]) {
        const serviceId = serviceIds[0];
        const slot = entries
          .find(([id]) => id === serviceId)?.[1]
          .find(
            (s) =>
              s.employeeId === preselectedEmployeeId &&
              s.startTime === preselectedStartTime,
          );
        if (slot) {
          const service = servicesById[serviceId];
          onSelectionsChange([
            {
              serviceId,
              employeeId: slot.employeeId,
              startTime: slot.startTime,
              endTime: slot.endTime,
              employeeName: slot.employeeName,
              agreedPrice: service?.price ?? 0,
            },
          ]);
        }
      }
    } catch (error) {
      notifications.show({
        title: 'Error de disponibilidad',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [
    branchId,
    date,
    serviceIds,
    preselectedEmployeeId,
    preselectedStartTime,
    servicesById,
    onSelectionsChange,
  ]);

  useEffect(() => {
    void loadSlots();
  }, [loadSlots]);

  const grouped = useMemo(() => {
    return serviceIds.map((serviceId) => {
      const slots = slotsByService[serviceId] ?? [];
      const byEmployee = new Map<number, AvailableSlot[]>();
      for (const slot of slots) {
        const list = byEmployee.get(slot.employeeId) ?? [];
        list.push(slot);
        byEmployee.set(slot.employeeId, list);
      }
      return { serviceId, byEmployee };
    });
  }, [serviceIds, slotsByService]);

  const pickSlot = (serviceId: number, slot: AvailableSlot) => {
    const service = servicesById[serviceId];
    const next = selections.filter((s) => s.serviceId !== serviceId);
    next.push({
      serviceId,
      employeeId: slot.employeeId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      employeeName: slot.employeeName,
      agreedPrice: service?.price ?? 0,
    });
    onSelectionsChange(next);
  };

  const allSelected = serviceIds.every((id) =>
    selections.some((s) => s.serviceId === id),
  );

  return (
    <Stack gap="md">
      {loading ? (
        <Center py="lg">
          <Loader color="gray" type="dots" />
        </Center>
      ) : (
        grouped.map(({ serviceId, byEmployee }) => {
          const service = servicesById[serviceId];
          const selected = selections.find((s) => s.serviceId === serviceId);

          return (
            <Paper key={serviceId} withBorder p="md" radius="md" style={cardPaperStyle}>
              <Text fw={600} mb="sm">
                {service?.name ?? `Servicio #${serviceId}`}
              </Text>
              {byEmployee.size === 0 ? (
                <Text size="sm" c="dimmed">
                  No hay horarios disponibles para este servicio.
                </Text>
              ) : (
                <Stack gap="sm">
                  {[...byEmployee.entries()].map(([employeeId, slots]) => (
                    <Stack key={employeeId} gap={6}>
                      <Text size="sm" fw={500}>
                        {slots[0]?.employeeName ?? `Colaboradora #${employeeId}`}
                      </Text>
                      <Group gap="xs">
                        {slots.map((slot) => {
                          const isActive =
                            selected?.startTime === slot.startTime &&
                            selected.employeeId === slot.employeeId;
                          return (
                            <UnstyledButton
                              key={`${slot.employeeId}-${slot.startTime}`}
                              onClick={() => pickSlot(serviceId, slot)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: 'var(--mantine-radius-sm)',
                                border: `1px solid ${
                                  isActive
                                    ? 'hsl(var(--tl-taupe))'
                                    : 'hsl(var(--border))'
                                }`,
                                backgroundColor: isActive
                                  ? 'hsl(var(--muted))'
                                  : 'transparent',
                              }}
                            >
                              <Text size="sm">
                                {formatTime(slot.startTime)} –{' '}
                                {formatTime(slot.endTime)}
                              </Text>
                            </UnstyledButton>
                          );
                        })}
                      </Group>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Paper>
          );
        })
      )}

      <Group justify="space-between">
        <Button variant="default" onClick={onBack}>
          Atrás
        </Button>
        <Button
          styles={primaryButtonStyles}
          disabled={!allSelected}
          onClick={onContinue}
        >
          Continuar
        </Button>
      </Group>
    </Stack>
  );
}
