"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Center,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { CustomerReservationsModal } from "@/components/customer-reservations-modal";
import { ReservationDetailModal } from "@/components/reservation-detail-modal";
import { PaymentsTable } from "./components/payments-table";
import type {
  PaymentControllerFindAllMethodEnum,
  PaymentResponseDto,
  ReservationResponseDto,
} from "@/generated-client";
import { clientesApi, pagosApi, reservasApi, usuariosApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { cardPaperStyle } from "@/lib/crud-styles";
import { todayISO, toISODate } from "@/lib/date-utils";
import { PAYMENT_METHOD_LABELS } from "@/lib/reservation-utils";
import { useBranchStore } from "@/stores/branch-store";

export default function PagosPage() {
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const branches = useBranchStore((s) => s.branches);

  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [method, setMethod] =
    useState<PaymentControllerFindAllMethodEnum | null>(null);
  const [branchFilter, setBranchFilter] = useState<number | null>(
    selectedBranch?.id ?? null,
  );
  const [payments, setPayments] = useState<PaymentResponseDto[]>([]);
  const [customerNames, setCustomerNames] = useState<Record<number, string>>(
    {},
  );
  const [reservationCustomerMap, setReservationCustomerMap] = useState<
    Record<number, number>
  >({});
  const [userNames, setUserNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [detailReservationId, setDetailReservationId] = useState<number | null>(
    null,
  );
  const [historyCustomer, setHistoryCustomer] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (selectedBranch && branchFilter == null)
      setBranchFilter(selectedBranch.id);
  }, [selectedBranch, branchFilter]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await pagosApi.paymentControllerFindAll(
        branchFilter ?? undefined,
        startDate || undefined,
        endDate || undefined,
        method ?? undefined,
      );
      setPayments(data);

      const reservationIds = [...new Set(data.map((p) => p.reservationId))];
      const reservations = await Promise.all(
        reservationIds.map(async (id) => {
          try {
            return (await reservasApi.reservationControllerFindOne(id)).data;
          } catch {
            return null;
          }
        }),
      );
      const valid = reservations.filter(
        (r): r is ReservationResponseDto => r != null,
      );
      const customerIds = [...new Set(valid.map((r) => r.customerId))];
      setReservationCustomerMap(
        Object.fromEntries(valid.map((r) => [r.id, r.customerId])),
      );

      const [customers, users] = await Promise.all([
        Promise.all(
          customerIds.map(async (id) => {
            try {
              const { data: c } =
                await clientesApi.customerControllerFindOne(id);
              return [id, `${c.firstName} ${c.lastName}`] as const;
            } catch {
              return [id, `Cliente #${id}`] as const;
            }
          }),
        ),
        Promise.all(
          [...new Set(data.map((p) => p.registeredById))].map(async (id) => {
            try {
              const { data: u } = await usuariosApi.userControllerFindOne(id);
              return [id, u.name] as const;
            } catch {
              return [id, `Usuario #${id}`] as const;
            }
          }),
        ),
      ]);
      setCustomerNames(Object.fromEntries(customers));
      setUserNames(Object.fromEntries(users));
    } catch (error) {
      notifications.show({
        title: "Error al cargar pagos",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [branchFilter, startDate, endDate, method]);

  useEffect(() => {
    void load();
  }, [load]);

  const totalNet = useMemo(
    () =>
      payments.reduce((sum, p) => {
        const amount = parseFloat(p.amount);
        return p.type === "refund" ? sum - amount : sum + amount;
      }, 0),
    [payments],
  );

  const methodOptions = [
    { value: "", label: "Todos los métodos" },
    ...Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];
  const branchOptions = [
    { value: "", label: "Todos los locales" },
    ...branches.map((b) => ({ value: String(b.id), label: b.name })),
  ];

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title
          order={2}
          style={{
            fontFamily: "var(--font-heading), Georgia, serif",
            color: "hsl(var(--tl-brown-dark))",
            fontWeight: 500,
          }}
        >
          Pagos
        </Title>
        <Text c="dimmed">Registro de cobros y devoluciones por periodo.</Text>
      </Stack>

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        <Group align="flex-end" wrap="wrap">
          <DatePickerInput
            label="Desde"
            value={new Date(`${startDate}T12:00:00`)}
            onChange={(v) => {
              if (v) setStartDate(toISODate(v));
            }}
            w={{ base: "100%", sm: 180 }}
          />
          <DatePickerInput
            label="Hasta"
            value={new Date(`${endDate}T12:00:00`)}
            onChange={(v) => {
              if (v) setEndDate(toISODate(v));
            }}
            w={{ base: "100%", sm: 180 }}
          />
          <Select
            label="Local"
            data={branchOptions}
            value={branchFilter ? String(branchFilter) : ""}
            onChange={(v) => setBranchFilter(v ? parseInt(v, 10) : null)}
            w={{ base: "100%", sm: 220 }}
            allowDeselect
          />
          <Select
            label="Método"
            data={methodOptions}
            value={method ?? ""}
            onChange={(v) =>
              setMethod((v as PaymentControllerFindAllMethodEnum) || null)
            }
            w={{ base: "100%", sm: 200 }}
            allowDeselect
          />
        </Group>
      </Paper>

      <Paper withBorder radius="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="grape" />
          </Center>
        ) : payments.length === 0 ? (
          <Text p="lg" c="dimmed">
            No hay pagos en el rango seleccionado.
          </Text>
        ) : (
          <PaymentsTable
            payments={payments}
            customerNames={customerNames}
            reservationCustomerMap={reservationCustomerMap}
            userNames={userNames}
            totalNet={totalNet}
            onViewReservation={setDetailReservationId}
            onViewCustomerHistory={(id, name) =>
              setHistoryCustomer({ id, name })
            }
          />
        )}
      </Paper>

      <ReservationDetailModal
        opened={detailReservationId !== null}
        onClose={() => setDetailReservationId(null)}
        reservationId={detailReservationId}
      />
      <CustomerReservationsModal
        opened={historyCustomer !== null}
        onClose={() => setHistoryCustomer(null)}
        customerId={historyCustomer?.id ?? null}
        customerName={historyCustomer?.name ?? ""}
        onSelectReservation={(id) => {
          setHistoryCustomer(null);
          setDetailReservationId(id);
        }}
      />
    </Stack>
  );
}
