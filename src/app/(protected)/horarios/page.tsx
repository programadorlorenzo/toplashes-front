'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Plus } from 'lucide-react';
import {
  buildDefaultDrafts,
  ScheduleGrid,
  ScheduleGridLegend,
  type DayScheduleDraft,
} from './components/schedule-grid';
import { ExceptionFormModal } from './components/exception-form-modal';
import { ExceptionsList } from './components/exceptions-list';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle, pageTitleStyle, primaryButtonStyles } from '@/lib/crud-styles';
import { hasAnyPermission } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth-store';
import { useBranchStore } from '@/stores/branch-store';
import type { Branch, Employee, ScheduleEntry, ScheduleException } from '@/types/api';

export default function HorariosPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canManage = hasAnyPermission(permissions, ['schedules.manage']);

  const branches = useBranchStore((s) => s.branches);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branchDetail, setBranchDetail] = useState<Branch | null>(null);
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(
    selectedBranch?.id ?? null,
  );
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [exceptions, setExceptions] = useState<ScheduleException[]>([]);
  const [drafts, setDrafts] = useState<DayScheduleDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [deletingExceptionId, setDeletingExceptionId] = useState<number | null>(
    null,
  );
  const [editingException, setEditingException] =
    useState<ScheduleException | null>(null);
  const [exceptionOpened, exceptionHandlers] = useDisclosure(false);

  const branchEmployees = useMemo(() => {
    if (!branchId) return [];
    return employees.filter(
      (e) => e.isActive && e.branchIds.includes(branchId),
    );
  }, [employees, branchId]);

  const employeeOptions = branchEmployees.map((e) => ({
    value: String(e.id),
    label: `${e.firstName} ${e.lastName}`,
  }));

  const branchOptions = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  const loadMeta = useCallback(async () => {
    try {
      const { data } = await api.get<Employee[]>('/employees');
      setEmployees(data.filter((e) => e.isActive));
    } catch (error) {
      notifications.show({
        title: 'Error al cargar colaboradoras',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    }
  }, []);

  const loadSchedules = useCallback(async () => {
    if (!employeeId || !branchId) {
      setSchedules([]);
      setDrafts([]);
      setExceptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [schedulesRes, exceptionsRes, branchRes] = await Promise.all([
        api.get<ScheduleEntry[]>('/schedules', {
          params: { employeeId, branchId },
        }),
        api.get<ScheduleException[]>('/schedules/exceptions', {
          params: { employeeId },
        }),
        api.get<Branch>(`/branches/${branchId}`),
      ]);
      setSchedules(schedulesRes.data);
      setExceptions(exceptionsRes.data);
      setBranchDetail(branchRes.data);
      setDrafts(
        buildDefaultDrafts(
          schedulesRes.data,
          branchRes.data.openTime,
          branchRes.data.closeTime,
        ),
      );
    } catch (error) {
      notifications.show({
        title: 'Error al cargar horarios',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [employeeId, branchId]);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    void loadSchedules();
  }, [loadSchedules]);

  useEffect(() => {
    if (branchEmployees.length > 0 && !employeeId) {
      setEmployeeId(branchEmployees[0].id);
    }
  }, [branchEmployees, employeeId]);

  const handleDraftChange = (
    dayOfWeek: number,
    field: 'startTime' | 'endTime',
    value: string,
  ) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.dayOfWeek === dayOfWeek ? { ...d, [field]: value } : d,
      ),
    );
  };

  const handleSaveDay = async (dayOfWeek: number) => {
    if (!employeeId || !branchId || !canManage) return;
    const draft = drafts.find((d) => d.dayOfWeek === dayOfWeek);
    if (!draft) return;

    setSavingDay(dayOfWeek);
    try {
      if (draft.scheduleId) {
        await api.put(`/schedules/${draft.scheduleId}`, {
          startTime: draft.startTime,
          endTime: draft.endTime,
        });
      } else {
        await api.post('/schedules', {
          employeeId,
          branchId,
          dayOfWeek,
          startTime: draft.startTime,
          endTime: draft.endTime,
        });
      }
      notifications.show({
        title: 'Horario guardado',
        color: 'green',
        message: 'El día se actualizó correctamente.',
      });
      await loadSchedules();
    } catch (error) {
      notifications.show({
        title: 'No se pudo guardar',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setSavingDay(null);
    }
  };

  const handleDeleteException = async (id: number) => {
    setDeletingExceptionId(id);
    try {
      await api.delete(`/schedules/exceptions/${id}`);
      notifications.show({
        title: 'Excepción eliminada',
        color: 'green',
        message: 'Se eliminó el registro.',
      });
      await loadSchedules();
    } catch (error) {
      notifications.show({
        title: 'Error al eliminar',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setDeletingExceptionId(null);
    }
  };

  const selectedEmployee = branchEmployees.find((e) => e.id === employeeId);

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={2} style={pageTitleStyle}>
          Horarios
        </Title>
        <Text c="dimmed">
          Configura la semana recurrente y excepciones por colaboradora.
        </Text>
      </Stack>

      <Group wrap="wrap">
        {branches.length > 1 ? (
          <Select
            label="Local"
            data={branchOptions}
            value={branchId ? String(branchId) : null}
            onChange={(value) =>
              setBranchId(value ? parseInt(value, 10) : null)
            }
            maw={260}
            comboboxProps={{ withinPortal: true }}
          />
        ) : null}
        <Select
          label="Colaboradora"
          data={employeeOptions}
          value={employeeId ? String(employeeId) : null}
          onChange={(value) =>
            setEmployeeId(value ? parseInt(value, 10) : null)
          }
          maw={280}
          comboboxProps={{ withinPortal: true }}
          disabled={branchEmployees.length === 0}
        />
      </Group>

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : !employeeId ? (
          <Text c="dimmed" ta="center" py="lg">
            Selecciona una colaboradora.
          </Text>
        ) : (
          <Stack gap="md">
            <Text fw={600}>
              {selectedEmployee
                ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                : 'Colaboradora'}
              {branchDetail ? ` · ${branchDetail.name}` : ''}
            </Text>
            <ScheduleGridLegend />
            <ScheduleGrid
              drafts={drafts}
              existing={schedules}
              onChange={handleDraftChange}
              onSaveDay={(day) => void handleSaveDay(day)}
              savingDay={savingDay}
              canManage={canManage}
            />
          </Stack>
        )}
      </Paper>

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        <Group justify="space-between" mb="md">
          <Text fw={600}>Excepciones</Text>
          {canManage && employeeId ? (
            <Button
              size="xs"
              leftSection={<Plus size={14} />}
              styles={primaryButtonStyles}
              onClick={() => {
                setEditingException(null);
                exceptionHandlers.open();
              }}
            >
              Nueva excepción
            </Button>
          ) : null}
        </Group>
        <ExceptionsList
          items={exceptions}
          canManage={canManage}
          onEdit={(item) => {
            setEditingException(item);
            exceptionHandlers.open();
          }}
          onDelete={(id) => void handleDeleteException(id)}
          deletingId={deletingExceptionId}
        />
      </Paper>

      {employeeId ? (
        <ExceptionFormModal
          opened={exceptionOpened}
          onClose={exceptionHandlers.close}
          employeeId={employeeId}
          exception={editingException}
          onSaved={() => void loadSchedules()}
        />
      ) : null}
    </Stack>
  );
}
