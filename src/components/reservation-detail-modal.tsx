"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Center, Divider, Loader, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import type {
  BranchResponseDto,
  CustomerResponseDto,
  EmployeeResponseDto,
  PaymentResponseDto,
  ReservationBalanceResponseDto,
  ReservationResponseDto,
  ReservationResponseDtoStatusEnum,
  ServiceResponseDto,
} from "@/generated-client";
import {
  clientesApi,
  colaboradorasApi,
  pagosApi,
  reservasApi,
  serviciosApi,
  sucursalesApi,
} from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  getAllowedStatusTransitions,
  RESERVATION_STATUS_LABELS,
  REVERT_TRANSITIONS,
} from "@/lib/reservation-utils";
import { useAuthStore } from "@/stores/auth-store";
import { hasAnyPermission } from "@/lib/permissions";
import { PaymentModal } from "@/components/payment-modal";
import { ReservationDetailActions } from "@/components/reservation-detail-actions";
import { ReservationDetailBody } from "@/components/reservation-detail-body";
import { ReservationDetailHeader } from "@/components/reservation-detail-header";

interface ReservationDetailModalProps {
  opened: boolean;
  onClose: () => void;
  reservationId: number | null;
  onUpdated?: () => void;
}

export function ReservationDetailModal({
  opened,
  onClose,
  reservationId,
  onUpdated,
}: ReservationDetailModalProps) {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canUpdate = hasAnyPermission(permissions, ["reservations.update"]);
  const canCancel = hasAnyPermission(permissions, ["reservations.cancel"]);
  const canPay = hasAnyPermission(permissions, ["payments.create"]);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [reservation, setReservation] = useState<ReservationResponseDto | null>(
    null,
  );
  const [customer, setCustomer] = useState<CustomerResponseDto | null>(null);
  const [branch, setBranch] = useState<BranchResponseDto | null>(null);
  const [services, setServices] = useState<ServiceResponseDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [balance, setBalance] = useState<ReservationBalanceResponseDto | null>(
    null,
  );
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
  const [paymentOpened, paymentHandlers] = useDisclosure(false);

  const servicesById = useMemo(
    () =>
      Object.fromEntries(services.map((s) => [s.id, s])) as Record<
        number,
        ServiceResponseDto
      >,
    [services],
  );
  const employeeNames = useMemo(
    () =>
      Object.fromEntries(
        employees.map((e) => [e.id, `${e.firstName} ${e.lastName}`]),
      ) as Record<number, string>,
    [employees],
  );

  const load = useCallback(async () => {
    if (!reservationId) return;
    setLoading(true);
    try {
      const [reservationRes, servicesRes, employeesRes] = await Promise.all([
        reservasApi.reservationControllerFindOne(reservationId),
        serviciosApi.serviceControllerFindAll(),
        colaboradorasApi.employeeControllerFindAll(),
      ]);
      const resData = reservationRes.data;
      setReservation(resData);
      setServices(servicesRes.data);
      setEmployees(employeesRes.data);

      const [customerRes, branchRes] = await Promise.all([
        clientesApi.customerControllerFindOne(resData.customerId),
        sucursalesApi.branchControllerFindOne(resData.branchId),
      ]);
      setCustomer(customerRes.data);
      setBranch(branchRes.data);

      try {
        const [balanceRes, paymentsRes] = await Promise.all([
          pagosApi.paymentControllerGetReservationBalance(reservationId),
          pagosApi.paymentControllerFindByReservation(reservationId),
        ]);
        setBalance(balanceRes.data);
        setPayments(paymentsRes.data);
      } catch {
        setBalance({
          totalAmount: resData.totalAmount,
          discount: resData.discount,
          totalPaid: "0.00",
          balance: resData.totalAmount,
        });
        setPayments([]);
      }
    } catch (error) {
      notifications.show({
        title: "Error al cargar reserva",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  useEffect(() => {
    if (opened && reservationId) void load();
  }, [opened, reservationId, load]);

  const handleStatus = async (status: ReservationResponseDtoStatusEnum) => {
    if (!reservation) return;
    setUpdating(true);
    try {
      if (status === "cancelled") {
        await reservasApi.reservationControllerCancel(reservation.id, {});
      } else {
        await reservasApi.reservationControllerUpdateStatus(reservation.id, {
          status,
        });
      }
      notifications.show({
        title: "Estado actualizado",
        color: "green",
        message: RESERVATION_STATUS_LABELS[status],
      });
      await load();
      onUpdated?.();
    } catch (error) {
      notifications.show({
        title: "No se pudo cambiar el estado",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSyncCalendar = async () => {
    if (!reservation) return;
    setSyncing(true);
    try {
      const { data } = await reservasApi.reservationControllerSyncCalendar(
        reservation.id,
      );
      notifications.show({
        title: data.synced ? "Sincronizado" : "No sincronizado",
        message: data.synced
          ? "Reserva sincronizada con Google Calendar."
          : "No hay cuenta de Calendar conectada.",
        color: data.synced ? "green" : "orange",
      });
      await load();
    } catch (error) {
      notifications.show({
        title: "Error de sincronización",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setSyncing(false);
    }
  };

  const transitions = reservation
    ? getAllowedStatusTransitions(reservation.status).filter(
        (s) =>
          (s !== "cancelled" || canCancel) &&
          s !== REVERT_TRANSITIONS[reservation.status],
      )
    : [];
  const revertTo = reservation
    ? REVERT_TRANSITIONS[reservation.status]
    : undefined;
  const balanceAmount = parseFloat(
    balance?.balance ?? reservation?.totalAmount ?? "0",
  );
  const isPaid = balanceAmount <= 0;

  return (
    <>
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
        {loading || !reservation ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : (
          <>
            <ReservationDetailHeader
              reservation={reservation}
              isPaid={isPaid}
            />
            <Stack gap={0} px="lg" py="md">
              <ReservationDetailBody
                reservation={reservation}
                customer={customer}
                branch={branch}
                balance={balance}
                payments={payments}
                servicesById={servicesById}
                employeeNames={employeeNames}
                isPaid={isPaid}
                balanceAmount={balanceAmount}
              />
              <Divider mb="sm" />
              <ReservationDetailActions
                transitions={transitions}
                revertTo={revertTo}
                hasCalendarEvent={!!reservation.googleCalendarEventId}
                isPaid={isPaid}
                canUpdate={canUpdate}
                canCancel={canCancel}
                canPay={canPay}
                updating={updating}
                syncing={syncing}
                onStatus={(s) => void handleStatus(s)}
                onSync={() => void handleSyncCalendar()}
                onPayment={paymentHandlers.open}
                onClose={onClose}
              />
            </Stack>
          </>
        )}
      </Modal>

      <PaymentModal
        opened={paymentOpened}
        onClose={paymentHandlers.close}
        reservationId={reservationId ?? 0}
        suggestedAmount={
          balance
            ? parseFloat(balance.balance)
            : parseFloat(reservation?.totalAmount ?? "0")
        }
        onSaved={() => void load()}
      />
    </>
  );
}
