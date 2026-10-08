'use client';

import {
  Button,
  Group,
  Modal,
  MultiSelect,
  PasswordInput,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { primaryButtonStyles } from '@/lib/crud-styles';
import {
  chain,
  correo,
  maxLength,
  passwordUsuario,
  requerido,
} from '@/lib/validations';
import type { Branch, Role, User } from '@/types/api';

interface UserFormModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
  roles: Role[];
  branches: Branch[];
  onSaved: () => void;
}

function UserForm({
  user,
  roles,
  branches,
  onClose,
  onSaved,
}: Omit<UserFormModalProps, 'opened'>) {
  const isEdit = Boolean(user);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: user?.email ?? '',
      password: '',
      name: user?.name ?? '',
      roleId: user ? String(user.roleId) : '',
      branchIds: (user?.branches ?? []).map((b) => String(b.branchId)),
    },
    validate: {
      email: correo,
      password: passwordUsuario(isEdit),
      name: chain(requerido('Nombre'), maxLength('Nombre', 120)),
      roleId: requerido('Rol'),
    },
  });

  const roleOptions = roles
    .filter((r) => r.isActive)
    .map((r) => ({ value: String(r.id), label: r.name }));
  const branchOptions = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const branchIds = values.branchIds.map(Number);
      if (isEdit && user) {
        const payload: Record<string, unknown> = {
          email: values.email,
          name: values.name,
          roleId: Number(values.roleId),
          branchIds,
        };
        if (values.password.trim()) {
          payload.password = values.password;
        }
        await api.put(`/users/${user.id}`, payload);
      } else {
        await api.post('/users', {
          email: values.email,
          password: values.password,
          name: values.name,
          roleId: Number(values.roleId),
          branchIds,
        });
      }
      notifications.show({
        title: isEdit ? 'Usuario actualizado' : 'Usuario creado',
        color: 'green',
        message: values.name,
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
        <TextInput label="Correo" required {...form.getInputProps('email')} />
        <PasswordInput
          label={isEdit ? 'Contraseña nueva' : 'Contraseña'}
          description={isEdit ? 'Déjala vacía para no cambiarla' : undefined}
          required={!isEdit}
          {...form.getInputProps('password')}
        />
        <TextInput label="Nombre" required {...form.getInputProps('name')} />
        <Select
          label="Rol"
          required
          data={roleOptions}
          searchable
          {...form.getInputProps('roleId')}
        />
        <MultiSelect
          label="Locales"
          data={branchOptions}
          searchable
          {...form.getInputProps('branchIds')}
        />
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

export function UserFormModal(props: UserFormModalProps) {
  const { opened, onClose, user, ...rest } = props;
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={user ? 'Editar usuario' : 'Nuevo usuario'}
      size="lg"
    >
      {opened ? (
        <UserForm key={user?.id ?? 'new'} user={user} onClose={onClose} {...rest} />
      ) : null}
    </Modal>
  );
}
