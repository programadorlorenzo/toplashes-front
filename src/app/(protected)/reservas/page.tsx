"use client";

import { useEffect, useState } from "react";
import {
  Center,
  Grid,
  Loader,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { CustomerReservationsModal } from "@/components/customer-reservations-modal";
import { ReservationDetailModal } from "@/components/reservation-detail-modal";
import { reservasApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { pageTitleStyle } from "@/lib/crud-styles";
import { todayISO, toISODate } from "@/lib/date-utils";
import { useBranchStore } from "@/stores/branch-store";
import { QuickReserveModal } from "./components/quick-reserve-modal";
import { ReservationQueue } from "./components/reservation-queue";
import { ScheduleCard } from "./components/schedule-card";
import { useReservasDashboard } from "./components/use-reservas-dashboard";
import type { BookingItem } from "./components/use-reservas-dashboard";

interface QuickReserveTarget {
  employeeId: number | null;
  employeeName: string;
}

export default function ReservasPage() {
  const branches = useBranchStore((s) => s.branches);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);

  const [branchId, setBranchId] = useState<number | null>(
    selectedBranch?.id ?? null,
  );
  const [date, setDate] = useState(todayISO());
  const [detailId, setDetailId] = useState<number | null>(null);
  const [historyCust, setHistoryCust] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [quickTarget, setQuickTarget] = useState<QuickReserveTarget | null>(
    null,
  );

  useEffect(() => {
    if (selectedBranch && branchId === null) {
      setBranchId(selectedBranch.id);
    }
  }, [selectedBranch, branchId]);

  const dashboard = useReservasDashboard(branchId, date);

  const branchOptions = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const booking = active.data.current as BookingItem | undefined;
    if (!booking) return;

    const overId = String(over.id);

    let newEmployeeId: number | null = null;
    if (overId === "queue") {
      if (booking.employeeId === null) return;
      newEmployeeId = null;
    } else if (overId.startsWith("employee-")) {
      newEmployeeId = parseInt(overId.replace("employee-", ""), 10);
      if (booking.employeeId === newEmployeeId) return;
    } else {
      return;
    }

    try {
      await reservasApi.reservationControllerAssignServiceLineEmployee(
        booking.lineId,
        { employeeId: newEmployeeId },
      );
      notifications.show({
        title: newEmployeeId ? "Colaboradora asignada" : "Movida a cola",
        message: newEmployeeId
          ? `${booking.serviceName} asignada correctamente.`
          : `${booking.serviceName} movida a cola.`,
        color: "green",
      });
      await dashboard.reload();
    } catch (error) {
      notifications.show({
        title: "Error al asignar",
        message: getApiErrorMessage(error),
        color: "red",
      });
    }
  };

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={2} style={pageTitleStyle}>
          Reservas del día
        </Title>
        <Text c="dimmed">
          Arrastra reservas de la cola a una colaboradora para asignarlas.
        </Text>
      </Stack>

      <Grid align="flex-end">
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            label="Local"
            data={branchOptions}
            value={branchId ? String(branchId) : null}
            onChange={(v) => v && setBranchId(parseInt(v, 10))}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <DatePickerInput
            label="Fecha"
            value={date}
            onChange={(v) => v && setDate(toISODate(v))}
            valueFormat="DD/MM/YYYY"
          />
        </Grid.Col>
      </Grid>

      {dashboard.loading ? (
        <Center py="xl">
          <Loader color="gray" type="dots" />
        </Center>
      ) : dashboard.branchEmployees.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          Selecciona un local para ver las colaboradoras.
        </Text>
      ) : (
        <DndContext onDragEnd={(e) => void handleDragEnd(e)}>
          <Grid>
            {dashboard.branchEmployees.map((emp) => (
              <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={emp.id}>
                <ScheduleCard
                  employeeId={emp.id}
                  employeeName={`${emp.firstName} ${emp.lastName}`}
                  bookings={dashboard.bookingsByEmployee[emp.id] ?? []}
                  onBookingClick={setDetailId}
                  onNewReservation={() =>
                    setQuickTarget({
                      employeeId: emp.id,
                      employeeName: `${emp.firstName} ${emp.lastName}`,
                    })
                  }
                />
              </Grid.Col>
            ))}
          </Grid>

          <ReservationQueue
            items={dashboard.queue}
            onViewReservation={setDetailId}
            onNewReservation={() =>
              setQuickTarget({ employeeId: null, employeeName: "Cola" })
            }
          />
        </DndContext>
      )}

      <ReservationDetailModal
        opened={detailId !== null}
        onClose={() => setDetailId(null)}
        reservationId={detailId}
        onUpdated={() => void dashboard.reload()}
      />

      <CustomerReservationsModal
        opened={historyCust !== null}
        onClose={() => setHistoryCust(null)}
        customerId={historyCust?.id ?? null}
        customerName={historyCust?.name ?? ""}
        onSelectReservation={(id) => {
          setHistoryCust(null);
          setDetailId(id);
        }}
      />

      {branchId && (
        <QuickReserveModal
          opened={quickTarget !== null}
          onClose={() => setQuickTarget(null)}
          onCreated={() => void dashboard.reload()}
          branchId={branchId}
          date={date}
          employeeId={quickTarget?.employeeId ?? null}
          employeeName={quickTarget?.employeeName ?? ""}
          services={dashboard.services}
          servicesById={dashboard.servicesById}
        />
      )}
    </Stack>
  );
}
