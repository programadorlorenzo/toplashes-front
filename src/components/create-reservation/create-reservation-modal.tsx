"use client";

import { Center, Loader, Modal, Stack, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { reservasApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { EmployeeGrid } from "./employee-grid";
import { ReservationFormHeader } from "./reservation-form-header";
import { ReservationSummary } from "./reservation-summary";
import { useCreateReservation } from "./use-create-reservation";

interface CreateReservationModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated?: () => void;
  defaultBranchId?: number;
  defaultDate?: string;
}

export function CreateReservationModal({
  opened,
  onClose,
  onCreated,
  defaultBranchId,
  defaultDate,
}: CreateReservationModalProps) {
  const state = useCreateReservation(opened, {
    branchId: defaultBranchId,
    date: defaultDate,
  });

  const handleSubmit = async () => {
    if (!state.customerId || !state.branchId || state.selections.length === 0)
      return;
    state.setSubmitting(true);
    try {
      await reservasApi.reservationControllerCreate({
        customerId: parseInt(state.customerId, 10),
        branchId: state.branchId,
        date: state.date,
        channel: state.channel as "whatsapp",
        notes: state.notes.trim() || undefined,
        discount: state.discountNum > 0 ? state.discountNum : undefined,
        services: state.selections.map((s) => ({
          serviceId: s.serviceId,
          employeeId: s.employeeId ?? undefined,
          startTime: s.startTime,
          agreedPrice: s.agreedPrice,
        })),
      });
      notifications.show({
        title: "Reserva creada",
        color: "green",
        message: "La cita se registró correctamente.",
      });
      onCreated?.();
      onClose();
    } catch (error) {
      notifications.show({
        title: "No se pudo crear",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      state.setSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Nueva reserva"
      size="xl"
      centered
      closeOnClickOutside={false}
      styles={{
        title: { fontWeight: 700, fontSize: "var(--mantine-font-size-lg)" },
      }}
    >
      {state.loading ? (
        <Center py="xl">
          <Loader color="gray" type="dots" />
        </Center>
      ) : (
        <Stack gap="md">
          <ReservationFormHeader
            customerOptions={state.customerOpts}
            customerId={state.customerId}
            onCustomerChange={state.setCustomerId}
            branchOptions={state.branchOpts}
            branchId={state.branchId}
            onBranchChange={state.setBranchId}
            date={state.date}
            onDateChange={state.setDate}
            channel={state.channel}
            onChannelChange={state.setChannel}
            serviceOptions={state.svcOpts}
            selectedServiceIds={state.selectedServiceIds}
            onServiceIdsChange={(ids) => {
              state.setSelectedServiceIds(ids);
              state.setSelections((p) =>
                p.filter((s) => ids.includes(String(s.serviceId))),
              );
            }}
          />

          {state.activeService && (
            <EmployeeGrid
              activeService={state.activeService}
              qualifiedEmployees={state.qualifiedEmployees}
              bookingsByEmployee={state.bookingsByEmployee}
              times={state.times}
              onTimeChange={(k, v) => state.setTimes((p) => ({ ...p, [k]: v }))}
              selections={state.selections}
              onSelectEmployee={state.handleSelectEmp}
            />
          )}

          {!state.activeService &&
            state.selectedServiceIds.length > 0 &&
            state.allAssigned && (
              <Text size="sm" c="teal" ta="center">
                ✓ Todos los servicios asignados
              </Text>
            )}

          {state.selections.length > 0 && (
            <ReservationSummary
              selections={state.selections}
              servicesById={state.servicesById}
              discount={state.discount}
              onDiscountChange={state.setDiscount}
              notes={state.notes}
              onNotesChange={state.setNotes}
              total={state.total}
              submitting={state.submitting}
              canSubmit={!!state.customerId && state.allAssigned}
              onRemoveSelection={(id) =>
                state.setSelections((p) => p.filter((s) => s.serviceId !== id))
              }
              onSubmit={() => void handleSubmit()}
            />
          )}
        </Stack>
      )}
    </Modal>
  );
}
