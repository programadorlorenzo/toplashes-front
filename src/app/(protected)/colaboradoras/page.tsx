'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Pencil, Power } from 'lucide-react';
import { ActiveBadge } from '@/components/crud/active-badge';
import { ListPageHeader } from '@/components/crud/list-page-header';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle } from '@/lib/crud-styles';
import { hasAnyPermission } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth-store';
import type { Branch, Employee, Service } from '@/types/api';
import { EmployeeFormModal } from './components/employee-form-modal';

export default function ColaboradorasPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canManage = hasAnyPermission(permissions, ['employees.manage']);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const branchMap = useMemo(
    () => new Map(branches.map((b) => [b.id, b.name])),
    [branches],
  );
  const serviceMap = useMemo(
    () => new Map(services.map((s) => [s.id, s.name])),
    [services],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [empRes, branchRes, serviceRes] = await Promise.all([
        api.get<Employee[]>('/employees'),
        api.get<Branch[]>('/branches'),
        api.get<Service[]>('/services'),
      ]);
      setEmployees(empRes.data);
      setBranches(branchRes.data);
      setServices(serviceRes.data);
    } catch (error) {
      notifications.show({
        title: 'Error al cargar',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleActive = async (employee: Employee) => {
    try {
      await api.put(`/employees/${employee.id}`, {
        isActive: !employee.isActive,
      });
      void load();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    }
  };

  return (
    <Stack gap="lg">
      <ListPageHeader
        title="Colaboradoras"
        description="Equipo de trabajo, locales y servicios asignados."
        actionLabel="Nueva colaboradora"
        onAction={
          canManage
            ? () => {
                setEditing(null);
                open();
              }
            : undefined
        }
      />

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : employees.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay colaboradoras registradas.
          </Text>
        ) : (
          <ScrollArea type="auto">
            <Table striped highlightOnHover miw={800}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>Teléfono</Table.Th>
                  <Table.Th>Locales</Table.Th>
                  <Table.Th>Servicios</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  {canManage ? <Table.Th w={100} /> : null}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {employees.map((emp) => (
                  <Table.Tr key={emp.id}>
                    <Table.Td fw={500}>
                      {emp.firstName} {emp.lastName}
                    </Table.Td>
                    <Table.Td>{emp.phone ?? '—'}</Table.Td>
                    <Table.Td>
                      <Group gap={6}>
                        {emp.branchIds.length === 0 ? (
                          <Text size="sm" c="dimmed">
                            —
                          </Text>
                        ) : (
                          emp.branchIds.map((id) => (
                            <Badge key={id} variant="light" color="gray" size="sm">
                              {branchMap.get(id) ?? `Local ${id}`}
                            </Badge>
                          ))
                        )}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6}>
                        {emp.serviceIds.length === 0 ? (
                          <Text size="sm" c="dimmed">
                            —
                          </Text>
                        ) : (
                          emp.serviceIds.slice(0, 4).map((id) => (
                            <Badge key={id} variant="outline" size="sm">
                              {serviceMap.get(id) ?? `#${id}`}
                            </Badge>
                          ))
                        )}
                        {emp.serviceIds.length > 4 ? (
                          <Text size="xs" c="dimmed">
                            +{emp.serviceIds.length - 4}
                          </Text>
                        ) : null}
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <ActiveBadge active={emp.isActive} />
                    </Table.Td>
                    {canManage ? (
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="Editar">
                            <ActionIcon
                              variant="subtle"
                              onClick={() => {
                                setEditing(emp);
                                open();
                              }}
                              aria-label="Editar"
                            >
                              <Pencil size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={emp.isActive ? 'Desactivar' : 'Activar'}>
                            <ActionIcon
                              variant="subtle"
                              color={emp.isActive ? 'orange' : 'green'}
                              onClick={() => void toggleActive(emp)}
                              aria-label="Estado"
                            >
                              <Power size={16} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    ) : null}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Paper>

      <EmployeeFormModal
        opened={opened}
        onClose={close}
        employee={editing}
        branches={branches}
        services={services}
        onSaved={load}
      />
    </Stack>
  );
}
