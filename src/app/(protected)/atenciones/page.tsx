'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { AlertTriangle, Play, Square, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle } from '@/lib/crud-styles';
import { formatTime, todayISO, toISODate } from '@/lib/date-utils';
import {
  APPOINTMENT_STATUS_COLORS,
  APPOINTMENT_STATUS_LABELS,
} from '@/lib/reservation-utils';
import { hasAnyPermission } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth-store';
import { useBranchStore } from '@/stores/branch-store';
import type {
  Appointment,
  AppointmentConflictWarning,
  Customer,
  Employee,
  Reservation,
  Service,
} from '@/types/api';

interface ServiceLineMeta {
  customerId: number;
  serviceId: number;
  employeeId: number;
  reservationId: number;
}

export default function AtencionesPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canStart = hasAnyPermission(permissions, ['appointments.start']);
  const canFinish = hasAnyPermission(permissions, ['appointments.finish']);

  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const [date, setDate] = useState(todayISO());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [lineMeta, setLineMeta] = useState<Record<number, ServiceLineMeta>>({});
  const [customerNames, setCustomerNames] = useState<Record<number, string>>({});
  const [employeeNames, setEmployeeNames] = useState<Record<number, string>>({});
  const [serviceNames, setServiceNames] = useState<Record<number, string>>({});
  const [conflicts, setConflicts] = useState<Record<number, AppointmentConflictWarning>>({});
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [finishModal, setFinishModal] = useState<{ id: number; notes: string } | null>(
    null,
  );

  const loadReferenceData = useCallback(async (reservations: Reservation[]) => {
    const meta: Record<number, ServiceLineMeta> = {};
    const customerIds = new Set<number>();
    const employeeIds = new Set<number>();
    const serviceIds = new Set<number>();

    for (const reservation of reservations) {
      for (const line of reservation.services) {
        meta[line.id] = {
          customerId: reservation.customerId,
          serviceId: line.serviceId,
          employeeId: line.employeeId,
          reservationId: reservation.id,
        };
        customerIds.add(reservation.customerId);
        employeeIds.add(line.employeeId);
        serviceIds.add(line.serviceId);
      }
    }
    setLineMeta(meta);

    const [customers, employees, services] = await Promise.all([
      Promise.all(
        [...customerIds].map(async (id) => {
          try {
            const { data } = await api.get<Customer>(`/customers/${id}`);
            return [id, `${data.firstName} ${data.lastName}`] as const;
          } catch {
            return [id, `Cliente #${id}`] as const;
          }
        }),
      ),
      Promise.all(
        [...employeeIds].map(async (id) => {
          try {
            const { data } = await api.get<Employee>(`/employees/${id}`);
            return [id, `${data.firstName} ${data.lastName}`] as const;
          } catch {
            return [id, `Colaboradora #${id}`] as const;
          }
        }),
      ),
      Promise.all(
        [...serviceIds].map(async (id) => {
          try {
            const { data } = await api.get<Service>(`/services/${id}`);
            return [id, data.name] as const;
          } catch {
            return [id, `Servicio #${id}`] as const;
          }
        }),
      ),
    ]);

    setCustomerNames(Object.fromEntries(customers));
    setEmployeeNames(Object.fromEntries(employees));
    setServiceNames(Object.fromEntries(services));
  }, []);

  const loadConflicts = useCallback(async (items: Appointment[]) => {
    const active = items.filter(
      (a) => a.status === 'scheduled' || a.status === 'in_progress',
    );
    const entries = await Promise.all(
      active.map(async (a) => {
        try {
          const { data } = await api.get<AppointmentConflictWarning>(
            `/appointments/${a.id}/conflict-warnings`,
          );
          return [a.id, data] as const;
        } catch {
          return [a.id, { hasConflict: false }] as const;
        }
      }),
    );
    setConflicts(Object.fromEntries(entries));
  }, []);

  const load = useCallback(async () => {
    if (!selectedBranch) {
      setAppointments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [appointmentsRes, reservationsRes] = await Promise.all([
        api.get<Appointment[]>('/appointments', {
          params: { branchId: selectedBranch.id, date },
        }),
        api.get<Reservation[]>('/reservations', {
          params: { branchId: selectedBranch.id, date },
        }),
      ]);
      setAppointments(appointmentsRes.data);
      await loadReferenceData(reservationsRes.data);
      await loadConflicts(appointmentsRes.data);
    } catch (error) {
      notifications.show({
        title: 'Error al cargar atenciones',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [selectedBranch, date, loadReferenceData, loadConflicts]);

  useEffect(() => {
    void load();
  }, [load]);

  const sorted = useMemo(
    () =>
      [...appointments].sort(
        (a, b) =>
          new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime(),
      ),
    [appointments],
  );

  const conflictAlerts = useMemo(
    () =>
      sorted.filter(
        (a) => conflicts[a.id]?.hasConflict && conflicts[a.id]?.message,
      ),
    [sorted, conflicts],
  );

  const handleStart = async (id: number) => {
    setActionId(id);
    try {
      await api.post(`/appointments/${id}/start`);
      notifications.show({
        title: 'Atención iniciada',
        message: 'La atención está en curso.',
        color: 'green',
      });
      await load();
    } catch (error) {
      notifications.show({
        title: 'No se pudo iniciar',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setActionId(null);
    }
  };

  const handleFinish = async () => {
    if (!finishModal) return;
    setActionId(finishModal.id);
    try {
      await api.post(`/appointments/${finishModal.id}/finish`, {
        notes: finishModal.notes.trim() || undefined,
      });
      notifications.show({
        title: 'Atención finalizada',
        message: 'Se registró el cierre del servicio.',
        color: 'green',
      });
      setFinishModal(null);
      await load();
    } catch (error) {
      notifications.show({
        title: 'No se pudo finalizar',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setActionId(null);
    }
  };

  const handleCancel = async (id: number) => {
    setActionId(id);
    try {
      await api.post(`/appointments/${id}/cancel`);
      notifications.show({
        title: 'Atención cancelada',
        message: 'La atención quedó marcada como cancelada.',
        color: 'yellow',
      });
      await load();
    } catch (error) {
      notifications.show({
        title: 'No se pudo cancelar',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setActionId(null);
    }
  };

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Stack gap={4}>
          <Title
            order={2}
            style={{
              fontFamily: 'var(--font-heading), Georgia, serif',
              color: 'hsl(var(--tl-brown-dark))',
              fontWeight: 500,
            }}
          >
            Atenciones
          </Title>
          <Text c="dimmed">
            Agenda de servicios del día en {selectedBranch?.name ?? '—'}.
          </Text>
        </Stack>
        <DatePickerInput
          label="Fecha"
          value={new Date(`${date}T12:00:00`)}
          onChange={(value) => {
            if (value) setDate(toISODate(value));
          }}
          w={{ base: '100%', sm: 220 }}
        />
      </Group>

      {conflictAlerts.map((a) => (
        <Alert
          key={a.id}
          color="orange"
          variant="light"
          icon={<AlertTriangle size={18} />}
          title="Posible conflicto de horario"
        >
          {conflicts[a.id]?.message}
        </Alert>
      ))}

      <Paper withBorder radius="md" style={cardPaperStyle}>
        {!selectedBranch ? (
          <Text p="lg" c="dimmed">
            Selecciona un local para ver las atenciones.
          </Text>
        ) : loading ? (
          <Center py="xl">
            <Loader color="grape" />
          </Center>
        ) : sorted.length === 0 ? (
          <Text p="lg" c="dimmed">
            No hay atenciones programadas para esta fecha.
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={900}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>Servicio</Table.Th>
                  <Table.Th>Colaboradora</Table.Th>
                  <Table.Th>Horario</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  <Table.Th>Acciones</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {sorted.map((appointment) => {
                  const meta = lineMeta[appointment.reservationServiceId];
                  const busy = actionId === appointment.id;
                  return (
                    <Table.Tr key={appointment.id}>
                      <Table.Td>
                        {meta
                          ? customerNames[meta.customerId] ?? `#${meta.customerId}`
                          : '—'}
                      </Table.Td>
                      <Table.Td>
                        {meta
                          ? serviceNames[meta.serviceId] ?? `#${meta.serviceId}`
                          : '—'}
                      </Table.Td>
                      <Table.Td>
                        {meta
                          ? employeeNames[meta.employeeId] ?? `#${meta.employeeId}`
                          : '—'}
                      </Table.Td>
                      <Table.Td>
                        <Stack gap={2}>
                          <Text size="sm">
                            {formatTime(appointment.scheduledStart)} –{' '}
                            {formatTime(appointment.scheduledEnd)}
                          </Text>
                          {(appointment.actualStart || appointment.actualEnd) && (
                            <Text size="xs" c="dimmed">
                              Real:{' '}
                              {appointment.actualStart
                                ? formatTime(appointment.actualStart)
                                : '—'}{' '}
                              –{' '}
                              {appointment.actualEnd
                                ? formatTime(appointment.actualEnd)
                                : '—'}
                            </Text>
                          )}
                        </Stack>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={APPOINTMENT_STATUS_COLORS[appointment.status] ?? 'gray'}
                          variant="light"
                        >
                          {APPOINTMENT_STATUS_LABELS[appointment.status] ?? appointment.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs" wrap="nowrap">
                          {appointment.status === 'scheduled' && canStart && (
                            <Button
                              size="xs"
                              variant="light"
                              leftSection={<Play size={14} />}
                              loading={busy}
                              onClick={() => void handleStart(appointment.id)}
                            >
                              Iniciar
                            </Button>
                          )}
                          {(appointment.status === 'scheduled' ||
                            appointment.status === 'in_progress') &&
                            canFinish && (
                              <>
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="green"
                                  leftSection={<Square size={14} />}
                                  loading={busy}
                                  onClick={() =>
                                    setFinishModal({ id: appointment.id, notes: '' })
                                  }
                                >
                                  Finalizar
                                </Button>
                                <Button
                                  size="xs"
                                  variant="subtle"
                                  color="red"
                                  leftSection={<XCircle size={14} />}
                                  loading={busy}
                                  onClick={() => void handleCancel(appointment.id)}
                                >
                                  Cancelar
                                </Button>
                              </>
                            )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Paper>

      <Modal
        opened={finishModal != null}
        onClose={() => setFinishModal(null)}
        title="Finalizar atención"
        centered
      >
        <Stack>
          <Textarea
            label="Notas (opcional)"
            placeholder="Observaciones del servicio"
            minRows={3}
            value={finishModal?.notes ?? ''}
            onChange={(e) =>
              setFinishModal((prev) =>
                prev ? { ...prev, notes: e.currentTarget.value } : prev,
              )
            }
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setFinishModal(null)}>
              Cerrar
            </Button>
            <Button
              color="green"
              loading={actionId != null}
              onClick={() => void handleFinish()}
            >
              Confirmar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
