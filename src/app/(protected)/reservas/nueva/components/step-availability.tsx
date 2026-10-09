"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import type {
  AvailableSlotResponseDto,
  EmployeeResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { colaboradorasApi, disponibilidadApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { cardPaperStyle, primaryButtonStyles } from "@/lib/crud-styles";
import { formatTime } from "@/lib/date-utils";
import { AutoSlots } from "./auto-slots";
import { ManualSlotInput, type ManualSlotResult } from "./manual-slot-input";

export interface SelectedServiceSlot {
  serviceId: number;
  employeeId: number | null;
  startTime: string;
  endTime: string;
  employeeName: string;
  agreedPrice: number;
}

interface StepAvailabilityProps {
  branchId: number;
  date: string;
  serviceIds: number[];
  servicesById: Record<number, ServiceResponseDto>;
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
    Record<number, AvailableSlotResponseDto[]>
  >({});
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [manualMode, setManualMode] = useState<Record<number, boolean>>({});
  const [manualTimes, setManualTimes] = useState<Record<number, string>>({});
  const [manualEmps, setManualEmps] = useState<Record<number, string>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [slotsEntries, { data: allEmployees }] = await Promise.all([
        Promise.all(
          serviceIds.map(async (serviceId) => {
            const { data } =
              await disponibilidadApi.availabilityControllerGetAvailableSlots(
                branchId,
                serviceId,
                date,
                preselectedEmployeeId,
              );
            return [serviceId, data] as const;
          }),
        ),
        colaboradorasApi.employeeControllerFindAll(),
      ]);
      setSlotsByService(Object.fromEntries(slotsEntries));
      setEmployees(allEmployees);

      const autoManual: Record<number, boolean> = {};
      for (const [sid, slots] of slotsEntries) {
        if (slots.length === 0) autoManual[sid] = true;
      }
      setManualMode((prev) => ({ ...prev, ...autoManual }));

      if (preselectedStartTime && preselectedEmployeeId && serviceIds[0]) {
        const sid = serviceIds[0];
        const slot = slotsEntries
          .find(([id]) => id === sid)?.[1]
          .find(
            (s) =>
              s.employeeId === preselectedEmployeeId &&
              s.startTime === preselectedStartTime,
          );
        if (slot) {
          const svc = servicesById[sid];
          onSelectionsChange([
            {
              serviceId: sid,
              employeeId: slot.employeeId,
              startTime: slot.startTime,
              endTime: slot.endTime,
              employeeName: slot.employeeName,
              agreedPrice: svc?.price ?? 0,
            },
          ]);
        }
      }
    } catch (error) {
      notifications.show({
        title: "Error de disponibilidad",
        message: getApiErrorMessage(error),
        color: "red",
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
    void loadData();
  }, [loadData]);

  const grouped = useMemo(() => {
    return serviceIds.map((serviceId) => {
      const slots = slotsByService[serviceId] ?? [];
      const byEmployee = new Map<number, AvailableSlotResponseDto[]>();
      for (const slot of slots) {
        const list = byEmployee.get(slot.employeeId) ?? [];
        list.push(slot);
        byEmployee.set(slot.employeeId, list);
      }
      return { serviceId, byEmployee };
    });
  }, [serviceIds, slotsByService]);

  const pickSlot = (serviceId: number, slot: AvailableSlotResponseDto) => {
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
    setManualMode((prev) => ({ ...prev, [serviceId]: false }));
  };

  const applyManual = (result: ManualSlotResult) => {
    const next = selections.filter((s) => s.serviceId !== result.serviceId);
    next.push(result);
    onSelectionsChange(next);
  };

  const getQualified = (serviceId: number) =>
    employees.filter(
      (e) =>
        e.isActive &&
        e.branchIds.includes(branchId) &&
        e.serviceIds.includes(serviceId),
    );

  const allSelected = serviceIds.every((id) =>
    selections.some((s) => s.serviceId === id),
  );

  if (loading) {
    return (
      <Center py="lg">
        <Loader color="gray" type="dots" />
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {grouped.map(({ serviceId, byEmployee }) => {
        const service = servicesById[serviceId];
        const selected = selections.find((s) => s.serviceId === serviceId);
        const isManual = manualMode[serviceId] ?? false;
        const hasAutoSlots = byEmployee.size > 0;

        return (
          <Paper
            key={serviceId}
            withBorder
            p="md"
            radius="md"
            style={cardPaperStyle}
          >
            <Text fw={600} mb="sm">
              {service?.name ?? `Servicio #${serviceId}`}
              {service ? ` · ${service.duration} min` : ""}
            </Text>

            {selected && (
              <Text size="sm" c="teal" mb="xs">
                ✓ {formatTime(selected.startTime)} –{" "}
                {formatTime(selected.endTime)} · {selected.employeeName}
              </Text>
            )}

            {!isManual && hasAutoSlots ? (
              <>
                <AutoSlots
                  byEmployee={byEmployee}
                  selected={selected}
                  onPick={(slot) => pickSlot(serviceId, slot)}
                />
                <Text
                  size="xs"
                  c="dimmed"
                  mt="xs"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() =>
                    setManualMode((p) => ({ ...p, [serviceId]: true }))
                  }
                >
                  O asignar horario manualmente
                </Text>
              </>
            ) : (
              <ManualSlotInput
                serviceId={serviceId}
                service={service}
                date={date}
                qualifiedEmployees={getQualified(serviceId)}
                time={manualTimes[serviceId] ?? ""}
                employeeValue={manualEmps[serviceId] ?? "none"}
                hasAutoSlots={hasAutoSlots}
                onTimeChange={(v) =>
                  setManualTimes((p) => ({ ...p, [serviceId]: v }))
                }
                onEmployeeChange={(v) =>
                  setManualEmps((p) => ({ ...p, [serviceId]: v }))
                }
                onApply={applyManual}
                onSwitchToAuto={() =>
                  setManualMode((p) => ({ ...p, [serviceId]: false }))
                }
              />
            )}
          </Paper>
        );
      })}

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
