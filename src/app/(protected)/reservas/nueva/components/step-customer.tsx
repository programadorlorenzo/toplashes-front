'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Group,
  Paper,
  Radio,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Search } from 'lucide-react';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle, primaryButtonStyles } from '@/lib/crud-styles';
import { chain, maxLength, requerido, telefono } from '@/lib/validations';
import type { Customer } from '@/types/api';

interface StepCustomerProps {
  selectedCustomerId: number | null;
  onSelectCustomer: (customer: Customer) => void;
  onContinue: () => void;
}

export function StepCustomer({
  selectedCustomerId,
  onSelectCustomer,
  onContinue,
}: StepCustomerProps) {
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 350);
  const [results, setResults] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'search' | 'create'>('search');
  const [creating, setCreating] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    whatsapp: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const loadSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get<Customer[]>('/customers', {
        params: { search: query.trim() },
      });
      setResults(data);
    } catch (error) {
      notifications.show({
        title: 'Error en búsqueda',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSearch(debounced);
  }, [debounced, loadSearch]);

  const validateNew = () => {
    const next: Record<string, string> = {};
    const first = chain(requerido('Nombres'), maxLength('Nombres', 80))(
      newCustomer.firstName,
    );
    const last = chain(requerido('Apellidos'), maxLength('Apellidos', 80))(
      newCustomer.lastName,
    );
    const wa = telefono(newCustomer.whatsapp);
    if (first) next.firstName = first;
    if (last) next.lastName = last;
    if (wa) next.whatsapp = wa;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCreate = async () => {
    if (!validateNew()) return;
    setCreating(true);
    try {
      const { data } = await api.post<Customer>('/customers', {
        firstName: newCustomer.firstName.trim(),
        lastName: newCustomer.lastName.trim(),
        whatsapp: newCustomer.whatsapp.trim(),
      });
      onSelectCustomer(data);
      notifications.show({
        title: 'Cliente creado',
        color: 'green',
        message: `${data.firstName} ${data.lastName}`,
      });
      onContinue();
    } catch (error) {
      notifications.show({
        title: 'No se pudo crear',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Stack gap="md">
      <Radio.Group
        value={mode}
        onChange={(value) => setMode(value as 'search' | 'create')}
        label="Cliente"
      >
        <Group mt="xs">
          <Radio value="search" label="Buscar existente" />
          <Radio value="create" label="Crear nueva clienta" />
        </Group>
      </Radio.Group>

      {mode === 'search' ? (
        <>
          <TextInput
            placeholder="Nombre o WhatsApp…"
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <Stack gap="xs">
            {loading ? (
              <Text size="sm" c="dimmed">
                Buscando…
              </Text>
            ) : null}
            {results.map((customer) => (
              <Paper
                key={customer.id}
                withBorder
                p="sm"
                radius="md"
                style={{
                  ...cardPaperStyle,
                  outline:
                    selectedCustomerId === customer.id
                      ? '2px solid hsl(var(--tl-taupe))'
                      : undefined,
                  cursor: 'pointer',
                }}
                onClick={() => onSelectCustomer(customer)}
              >
                <Text fw={500}>
                  {customer.firstName} {customer.lastName}
                </Text>
                <Text size="sm" c="dimmed">
                  {customer.whatsapp}
                </Text>
              </Paper>
            ))}
            {!loading && debounced && results.length === 0 ? (
              <Text size="sm" c="dimmed">
                Sin resultados. Puedes crear una clienta nueva.
              </Text>
            ) : null}
          </Stack>
          <Group justify="flex-end">
            <Button
              styles={primaryButtonStyles}
              disabled={!selectedCustomerId}
              onClick={onContinue}
            >
              Continuar
            </Button>
          </Group>
        </>
      ) : (
        <>
          <TextInput
            label="Nombres"
            value={newCustomer.firstName}
            error={errors.firstName}
            onChange={(e) =>
              setNewCustomer((c) => ({ ...c, firstName: e.currentTarget.value }))
            }
          />
          <TextInput
            label="Apellidos"
            value={newCustomer.lastName}
            error={errors.lastName}
            onChange={(e) =>
              setNewCustomer((c) => ({ ...c, lastName: e.currentTarget.value }))
            }
          />
          <TextInput
            label="WhatsApp"
            value={newCustomer.whatsapp}
            error={errors.whatsapp}
            onChange={(e) =>
              setNewCustomer((c) => ({ ...c, whatsapp: e.currentTarget.value }))
            }
          />
          <Group justify="flex-end">
            <Button
              styles={primaryButtonStyles}
              loading={creating}
              onClick={() => void handleCreate()}
            >
              Crear y continuar
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
}
