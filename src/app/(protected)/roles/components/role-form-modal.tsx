'use client';

import { useMemo } from 'react';
import {
  Button,
  Checkbox,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { primaryButtonStyles } from '@/lib/crud-styles';
import { chain, maxLength, requerido } from '@/lib/validations';
import type { Permission, Role } from '@/types/api';

interface RoleFormModalProps {
  opened: boolean;
  onClose: () => void;
  role: Role | null;
  allPermissions: Permission[];
  onSaved: () => void;
}

function RoleForm({
  role,
  allPermissions,
  onClose,
  onSaved,
}: Omit<RoleFormModalProps, 'opened'>) {
  const isEdit = Boolean(role);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: role?.name ?? '',
      description: role?.description ?? '',
      permissionIds: (role?.permissions ?? []).map((p) => String(p.id)),
    },
    validate: {
      name: chain(requerido('Nombre'), maxLength('Nombre', 80)),
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const perm of allPermissions) {
      const list = map.get(perm.module) ?? [];
      list.push(perm);
      map.set(perm.module, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [allPermissions]);

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || undefined,
        permissionIds: values.permissionIds.map(Number),
      };
      if (isEdit && role) {
        await api.put(`/roles/${role.id}`, payload);
      } else {
        await api.post('/roles', payload);
      }
      notifications.show({
        title: isEdit ? 'Rol actualizado' : 'Rol creado',
        message: values.name,
        color: 'green',
      });
      onSaved();
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput label="Nombre" required {...form.getInputProps('name')} />
        <Textarea
          label="Descripción"
          minRows={2}
          {...form.getInputProps('description')}
        />
        <Checkbox.Group
          label="Permisos"
          {...form.getInputProps('permissionIds')}
        >
          <ScrollArea.Autosize mah={320} mt="xs">
            <Stack gap="md">
              {grouped.map(([module, perms]) => (
                <Stack key={module} gap={6}>
                  <Text size="sm" fw={600} tt="capitalize">
                    {module.replace(/_/g, ' ')}
                  </Text>
                  <Stack gap={4} pl="xs">
                    {perms.map((perm) => (
                      <Checkbox
                        key={perm.id}
                        value={String(perm.id)}
                        label={
                          <Stack gap={0}>
                            <Text size="sm">{perm.description}</Text>
                            <Text size="xs" c="dimmed">
                              {perm.code}
                            </Text>
                          </Stack>
                        }
                      />
                    ))}
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Checkbox.Group>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} type="button">
            Cancelar
          </Button>
          <Button type="submit" styles={primaryButtonStyles}>
            Guardar
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function RoleFormModal(props: RoleFormModalProps) {
  const { opened, onClose, role, ...rest } = props;
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={role ? 'Editar rol' : 'Nuevo rol'}
      size="lg"
    >
      {opened ? (
        <RoleForm key={role?.id ?? 'new'} role={role} onClose={onClose} {...rest} />
      ) : null}
    </Modal>
  );
}
