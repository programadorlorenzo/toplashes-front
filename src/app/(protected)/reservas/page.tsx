'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Center, Loader, Paper, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { ListPageHeader } from '@/components/crud/list-page-header';
import { ReservationsFilters } from './components/reservations-filters';
import { ReservationsTable } from './components/reservations-table';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle } from '@/lib/crud-styles';
import { todayISO } from '@/lib/date-utils';
import { hasAnyPermission } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth-store';
import { useBranchStore } from '@/stores/branch-store';
import type { Customer, Reservation, ReservationStatus } from '@/types/api';

async function fetchCustomerNames(ids: number[]): Promise<Record<number, string>> {
  const unique = [...new Set(ids)];
  const pairs = await Promise.all(
    unique.map(async (id) => {
      try {
        const { data } = await api.get<Customer>(`/customers/${id}`);
        return [id, `${data.firstName} ${data.lastName}`] as const;
      } catch {
        return [id, `Cliente #${id}`] as const;
      }
    }),
  );
  return Object.fromEntries(pairs);
}

export default function ReservasPage() {
  const router = useRouter();
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canCreate = hasAnyPermission(permissions, ['reservations.create']);
  const canUpdate = hasAnyPermission(permissions, ['reservations.update']);

  const branches = useBranchStore((s) => s.branches);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);

  const [items, setItems] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [customerNames, setCustomerNames] = useState<Record<number, string>>({});
  const [date, setDate] = useState<string | null>(todayISO());
  const [status, setStatus] = useState<ReservationStatus | null>(null);
  const [branchFilter, setBranchFilter] = useState<number | null>(
    selectedBranch?.id ?? null,
  );

  const branchNames = useMemo(
    () => Object.fromEntries(branches.map((b) => [b.id, b.name])),
    [branches],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get<Reservation[]>('/reservations', {
        params: {
          ...(branchFilter ? { branchId: branchFilter } : {}),
          ...(date ? { date } : {}),
          ...(status ? { status } : {}),
        },
      });
      setItems(data);
      setCustomerNames(await fetchCustomerNames(data.map((r) => r.customerId)));
    } catch (error) {
      notifications.show({
        title: 'Error al cargar reservas',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [branchFilter, date, status]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (selectedBranch && branchFilter === null) {
      setBranchFilter(selectedBranch.id);
    }
  }, [selectedBranch, branchFilter]);

  const handleQuickStatus = async (id: number, next: ReservationStatus) => {
    setUpdatingId(id);
    try {
      if (next === 'cancelled') {
        await api.post(`/reservations/${id}/cancel`, {});
      } else {
        await api.put(`/reservations/${id}/status`, { status: next });
      }
      notifications.show({
        title: 'Estado actualizado',
        color: 'green',
        message: 'La reserva se actualizó correctamente.',
      });
      await load();
    } catch (error) {
      notifications.show({
        title: 'No se pudo actualizar',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Stack gap="lg">
      <ListPageHeader
        title="Reservas"
        description="Consulta y gestiona citas por fecha, local y estado."
        actionLabel="Nueva reserva"
        onAction={
          canCreate ? () => router.push('/reservas/nueva') : undefined
        }
      />

      <ReservationsFilters
        date={date}
        onDateChange={setDate}
        status={status}
        onStatusChange={setStatus}
        branchId={branchFilter}
        onBranchChange={setBranchFilter}
        branches={branches}
      />

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : items.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay reservas con los filtros seleccionados.
          </Text>
        ) : (
          <ReservationsTable
            items={items}
            customerNames={customerNames}
            branchNames={branchNames}
            canUpdate={canUpdate}
            onQuickStatus={handleQuickStatus}
            updatingId={updatingId}
          />
        )}
      </Paper>
    </Stack>
  );
}
