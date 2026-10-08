'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Center,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarDayView } from './components/calendar-day-view';
import { CalendarWeekView } from './components/calendar-week-view';
import { ReservationPreviewDrawer } from './components/reservation-preview-drawer';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import {
  addDaysIso,
  isoTimeOnDate,
  startOfWeekIso,
  weekDayDatesFromMonday,
} from '@/lib/calendar-utils';
import { cardPaperStyle, pageTitleStyle } from '@/lib/crud-styles';
import { formatFechaLegible, todayISO, toISODate } from '@/lib/date-utils';
import { useBranchStore } from '@/stores/branch-store';
import type { Branch, Customer, Employee, Reservation, Service } from '@/types/api';

type CalendarView = 'day' | 'week';

async function fetchCustomersMap(
  customerIds: number[],
): Promise<Record<number, string>> {
  const unique = [...new Set(customerIds)];
  const entries = await Promise.all(
    unique.map(async (id) => {
      try {
        const { data } = await api.get<Customer>(`/customers/${id}`);
        return [id, `${data.firstName} ${data.lastName}`] as const;
      } catch {
        return [id, `Cliente #${id}`] as const;
      }
    }),
  );
  return Object.fromEntries(entries);
}

export default function CalendarioPage() {
  const router = useRouter();
  const branches = useBranchStore((s) => s.branches);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const selectBranch = useBranchStore((s) => s.selectBranch);

  const [view, setView] = useState<CalendarView>('day');
  const [date, setDate] = useState<string>(todayISO());
  const [branchDetail, setBranchDetail] = useState<Branch | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customerNames, setCustomerNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const branchId = selectedBranch?.id;

  const weekDates = useMemo(() => {
    const weekStart = startOfWeekIso(date);
    return weekDayDatesFromMonday(weekStart);
  }, [date]);

  const servicesById = useMemo(
    () => Object.fromEntries(services.map((s) => [s.id, s])),
    [services],
  );

  const employeeNames = useMemo(
    () =>
      Object.fromEntries(
        employees.map((e) => [e.id, `${e.firstName} ${e.lastName}`]),
      ),
    [employees],
  );

  const branchEmployees = useMemo(() => {
    if (!branchId) return [];
    return employees.filter(
      (e) => e.isActive && e.branchIds.includes(branchId),
    );
  }, [employees, branchId]);

  const loadCalendarData = useCallback(async () => {
    if (!branchId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const datesToLoad =
        view === 'day' ? [date] : weekDayDatesFromMonday(startOfWeekIso(date));

      const [branchRes, employeesRes, servicesRes, ...reservationResponses] =
        await Promise.all([
          api.get<Branch>(`/branches/${branchId}`),
          api.get<Employee[]>('/employees'),
          api.get<Service[]>('/services'),
          ...datesToLoad.map((d) =>
            api.get<Reservation[]>('/reservations', {
              params: { branchId, date: d },
            }),
          ),
        ]);

      setBranchDetail(branchRes.data);
      setEmployees(employeesRes.data.filter((e) => e.isActive));
      setServices(servicesRes.data);

      const merged = reservationResponses.flatMap((r) => r.data);
      const byId = new Map<number, Reservation>();
      for (const item of merged) {
        byId.set(item.id, item);
      }
      const list = [...byId.values()];
      setReservations(list);

      const names = await fetchCustomersMap(list.map((r) => r.customerId));
      setCustomerNames(names);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setError(message);
      notifications.show({ title: 'Error al cargar calendario', message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [branchId, date, view]);

  useEffect(() => {
    void loadCalendarData();
  }, [loadCalendarData]);

  const previewReservation = useMemo(
    () => reservations.find((r) => r.id === previewId) ?? null,
    [reservations, previewId],
  );

  const previewCustomerName = previewReservation
    ? customerNames[previewReservation.customerId]
    : undefined;

  const openTime = branchDetail?.openTime ?? '09:00';
  const closeTime = branchDetail?.closeTime ?? '20:00';

  const handleEmptySlot = (employeeId: number, time: string) => {
    if (!branchId) return;
    const startTime = isoTimeOnDate(date, time);
    const params = new URLSearchParams({
      branchId: String(branchId),
      date,
      employeeId: String(employeeId),
      startTime,
    });
    router.push(`/reservas/nueva?${params.toString()}`);
  };

  const branchOptions = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Stack gap={4}>
          <Title order={2} style={pageTitleStyle}>
            Calendario
          </Title>
          <Text c="dimmed">
            Agenda operativa por colaboradora · {formatFechaLegible(date)}
          </Text>
        </Stack>

        <SegmentedControl
          value={view}
          onChange={(v) => setView(v as CalendarView)}
          data={[
            { label: 'Día', value: 'day' },
            { label: 'Semana', value: 'week' },
          ]}
        />
      </Group>

      <Group wrap="wrap" gap="sm">
        {branches.length > 1 ? (
          <Select
            label="Local"
            data={branchOptions}
            value={branchId ? String(branchId) : null}
            onChange={(value) => {
              const branch = branches.find((b) => String(b.id) === value);
              if (branch) selectBranch(branch);
            }}
            maw={240}
            comboboxProps={{ withinPortal: true }}
          />
        ) : null}

        <Group gap="xs" align="flex-end">
          <DatePickerInput
            label="Fecha"
            value={date}
            onChange={(value) => {
              if (value) setDate(toISODate(value));
            }}
            valueFormat="DD/MM/YYYY"
            maw={180}
          />
          <Group gap={4}>
            <Paper withBorder p={4} radius="md" style={cardPaperStyle}>
              <Group gap={4}>
                <ChevronLeft
                  size={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setDate(addDaysIso(date, view === 'day' ? -1 : -7))}
                  aria-label="Anterior"
                />
                <Text
                  size="sm"
                  px="xs"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setDate(todayISO())}
                >
                  Hoy
                </Text>
                <ChevronRight
                  size={18}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setDate(addDaysIso(date, view === 'day' ? 1 : 7))}
                  aria-label="Siguiente"
                />
              </Group>
            </Paper>
          </Group>
        </Group>
      </Group>

      {!branchId ? (
        <Alert color="yellow" title="Selecciona un local">
          Elige un local en la barra lateral para ver el calendario.
        </Alert>
      ) : null}

      {error ? (
        <Alert color="red" title="No se pudo cargar">
          {error}
        </Alert>
      ) : null}

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : branchEmployees.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay colaboradoras activas en este local.
          </Text>
        ) : view === 'day' ? (
          <CalendarDayView
            date={date}
            openTime={openTime}
            closeTime={closeTime}
            employees={branchEmployees}
            reservations={reservations.filter((r) => r.date === date)}
            customerNames={customerNames}
            servicesById={servicesById}
            onEmptySlotClick={handleEmptySlot}
            onReservationClick={(id) => {
              setPreviewId(id);
              setDrawerOpen(true);
            }}
          />
        ) : (
          <CalendarWeekView
            weekDates={weekDates}
            employees={branchEmployees}
            reservations={reservations}
            customerNames={customerNames}
            onReservationClick={(id) => {
              setPreviewId(id);
              setDrawerOpen(true);
            }}
          />
        )}
      </Paper>

      <ReservationPreviewDrawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        reservation={previewReservation}
        customerName={previewCustomerName}
        servicesById={servicesById}
        employeeNames={employeeNames}
      />
    </Stack>
  );
}
