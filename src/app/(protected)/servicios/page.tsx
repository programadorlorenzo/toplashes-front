'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  ActionIcon,
  Button,
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
import { Pencil, Power, Plus } from 'lucide-react';
import { ActiveBadge } from '@/components/crud/active-badge';
import { ListPageHeader } from '@/components/crud/list-page-header';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle } from '@/lib/crud-styles';
import { formatSoles } from '@/lib/format';
import { hasAnyPermission } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth-store';
import type { Service, ServiceCategory } from '@/types/api';
import { CategoryFormModal } from './components/category-form-modal';
import { ServiceFormModal } from './components/service-form-modal';

export default function ServiciosPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canManage = hasAnyPermission(permissions, ['services.manage']);

  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceEditing, setServiceEditing] = useState<Service | null>(null);
  const [categoryEditing, setCategoryEditing] = useState<ServiceCategory | null>(
    null,
  );
  const [serviceModal, serviceModalHandlers] = useDisclosure(false);
  const [categoryModal, categoryModalHandlers] = useDisclosure(false);

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [svc, cats] = await Promise.all([
        api.get<Service[]>('/services'),
        api.get<ServiceCategory[]>('/service-categories'),
      ]);
      setServices(svc.data);
      setCategories(cats.data);
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

  const toggleService = async (service: Service) => {
    try {
      await api.put(`/services/${service.id}`, {
        isActive: !service.isActive,
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

  const toggleCategory = async (category: ServiceCategory) => {
    try {
      await api.put(`/service-categories/${category.id}`, {
        isActive: !category.isActive,
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
        title="Servicios"
        description="Catálogo de tratamientos, precios y categorías."
        actionLabel="Nuevo servicio"
        onAction={
          canManage
            ? () => {
                setServiceEditing(null);
                serviceModalHandlers.open();
              }
            : undefined
        }
        extra={
          canManage ? (
            <Button
              variant="light"
              leftSection={<Plus size={16} />}
              onClick={() => {
                setCategoryEditing(null);
                categoryModalHandlers.open();
              }}
            >
              Categoría
            </Button>
          ) : undefined
        }
      />

      <Accordion variant="contained" radius="md">
        <Accordion.Item value="categories">
          <Accordion.Control>Categorías ({categories.length})</Accordion.Control>
          <Accordion.Panel>
            {categories.length === 0 ? (
              <Text c="dimmed" size="sm">
                No hay categorías.
              </Text>
            ) : (
              <Stack gap="xs">
                {categories.map((cat) => (
                  <Group key={cat.id} justify="space-between">
                    <Group gap="sm">
                      <Text fw={500}>{cat.name}</Text>
                      <ActiveBadge active={cat.isActive} />
                    </Group>
                    {canManage ? (
                      <Group gap={4}>
                        <ActionIcon
                          variant="subtle"
                          onClick={() => {
                            setCategoryEditing(cat);
                            categoryModalHandlers.open();
                          }}
                          aria-label="Editar categoría"
                        >
                          <Pencil size={16} />
                        </ActionIcon>
                        <ActionIcon
                          variant="subtle"
                          color={cat.isActive ? 'orange' : 'green'}
                          onClick={() => void toggleCategory(cat)}
                          aria-label="Estado categoría"
                        >
                          <Power size={16} />
                        </ActionIcon>
                      </Group>
                    ) : null}
                  </Group>
                ))}
                {canManage ? (
                  <Text
                    size="sm"
                    c="dimmed"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setCategoryEditing(null);
                      categoryModalHandlers.open();
                    }}
                  >
                    + Agregar categoría
                  </Text>
                ) : null}
              </Stack>
            )}
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : services.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay servicios registrados.
          </Text>
        ) : (
          <ScrollArea type="auto">
            <Table striped highlightOnHover miw={720}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Servicio</Table.Th>
                  <Table.Th>Categoría</Table.Th>
                  <Table.Th>Precio</Table.Th>
                  <Table.Th>Duración</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  {canManage ? <Table.Th w={100} /> : null}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {services.map((svc) => (
                  <Table.Tr key={svc.id}>
                    <Table.Td fw={500}>{svc.name}</Table.Td>
                    <Table.Td>
                      {categoryMap.get(svc.categoryId) ?? '—'}
                    </Table.Td>
                    <Table.Td>{formatSoles(svc.price)}</Table.Td>
                    <Table.Td>{svc.duration} min</Table.Td>
                    <Table.Td>
                      <ActiveBadge active={svc.isActive} />
                    </Table.Td>
                    {canManage ? (
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="Editar">
                            <ActionIcon
                              variant="subtle"
                              onClick={() => {
                                setServiceEditing(svc);
                                serviceModalHandlers.open();
                              }}
                            >
                              <Pencil size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label={svc.isActive ? 'Desactivar' : 'Activar'}>
                            <ActionIcon
                              variant="subtle"
                              color={svc.isActive ? 'orange' : 'green'}
                              onClick={() => void toggleService(svc)}
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

      <ServiceFormModal
        opened={serviceModal}
        onClose={serviceModalHandlers.close}
        service={serviceEditing}
        categories={categories}
        onSaved={load}
      />
      <CategoryFormModal
        opened={categoryModal}
        onClose={categoryModalHandlers.close}
        category={categoryEditing}
        onSaved={load}
      />
    </Stack>
  );
}
