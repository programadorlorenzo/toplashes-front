'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ActionIcon,
  Anchor,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { MessageCircle, Pencil, Search } from 'lucide-react';
import { ListPageHeader } from '@/components/crud/list-page-header';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle } from '@/lib/crud-styles';
import { whatsappUrl } from '@/lib/format';
import { hasAnyPermission } from '@/lib/permissions';
import { useAuthStore } from '@/stores/auth-store';
import type { Customer } from '@/types/api';
import { CustomerFormModal } from './components/customer-form-modal';

export default function ClientesPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canManage = hasAnyPermission(permissions, ['customers.manage']);

  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 350);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const load = useCallback(async (query?: string) => {
    setLoading(true);
    try {
      const { data } = await api.get<Customer[]>('/customers', {
        params: query ? { search: query } : undefined,
      });
      setItems(data);
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
    void load(debouncedSearch.trim() || undefined);
  }, [debouncedSearch, load]);

  return (
    <Stack gap="lg">
      <ListPageHeader
        title="Clientes"
        description="Base de clientas con contacto y notas."
        actionLabel="Nuevo cliente"
        onAction={
          canManage
            ? () => {
                setEditing(null);
                open();
              }
            : undefined
        }
      />

      <TextInput
        placeholder="Buscar por nombre o WhatsApp…"
        leftSection={<Search size={16} />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        maw={420}
      />

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : items.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No se encontraron clientes.
          </Text>
        ) : (
          <ScrollArea type="auto">
            <Table striped highlightOnHover miw={760}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Cliente</Table.Th>
                  <Table.Th>WhatsApp</Table.Th>
                  <Table.Th>Teléfono</Table.Th>
                  <Table.Th>Correo</Table.Th>
                  <Table.Th>Inasistencias</Table.Th>
                  {canManage ? <Table.Th w={80} /> : null}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((customer) => (
                  <Table.Tr key={customer.id}>
                    <Table.Td fw={500}>
                      {customer.firstName} {customer.lastName}
                    </Table.Td>
                    <Table.Td>
                      <Group gap={6} wrap="nowrap">
                        <Text size="sm">{customer.whatsapp}</Text>
                        <Tooltip label="Abrir WhatsApp">
                          <Anchor
                            href={whatsappUrl(customer.whatsapp)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </Anchor>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                    <Table.Td>{customer.phone ?? '—'}</Table.Td>
                    <Table.Td>{customer.email ?? '—'}</Table.Td>
                    <Table.Td>{customer.noShowCount}</Table.Td>
                    {canManage ? (
                      <Table.Td>
                        <ActionIcon
                          variant="subtle"
                          onClick={() => {
                            setEditing(customer);
                            open();
                          }}
                          aria-label="Editar cliente"
                        >
                          <Pencil size={16} />
                        </ActionIcon>
                      </Table.Td>
                    ) : null}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        )}
      </Paper>

      <CustomerFormModal
        opened={opened}
        onClose={close}
        customer={editing}
        onSaved={() => load(debouncedSearch.trim() || undefined)}
      />
    </Stack>
  );
}
