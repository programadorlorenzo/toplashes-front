'use client';

import {
  Button,
  Group,
  Modal,
  MultiSelect,
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
  maxLength,
  requerido,
  telefonoOpcional,
} from '@/lib/validations';
import type { Branch, Employee, Service } from '@/types/api';

interface EmployeeFormModalProps {
  opened: boolean;
  onClose: () => void;
  employee: Employee | null;
  branches: Branch[];
  services: Service[];
  onSaved: () => void;
}

function EmployeeForm({
  employee,
  branches,
  services,
  onClose,
  onSaved,
}: Omit<EmployeeFormModalProps, 'opened'>) {
  const isEdit = Boolean(employee);

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: employee?.firstName ?? '',
      lastName: employee?.lastName ?? '',
      phone: employee?.phone ?? '',
      branchIds: (employee?.branchIds ?? []).map(String),
      serviceIds: (employee?.serviceIds ?? []).map(String),
    },
    validate: {
      firstName: chain(requerido('Nombres'), maxLength('Nombres', 80)),
      lastName: chain(requerido('Apellidos'), maxLength('Apellidos', 80)),
      phone: telefonoOpcional,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const branchIds = values.branchIds.map(Number);
      const serviceIds = values.serviceIds.map(Number);
      const body = {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone || undefined,
      };

      let id = employee?.id;
      if (isEdit && employee) {
        await api.put(`/employees/${employee.id}`, body);
      } else {
        const { data } = await api.post<Employee>('/employees', {
          ...body,
          isActive: true,
          branchIds,
          serviceIds,
        });
        id = data.id;
      }

      if (id) {
        await api.put(`/employees/${id}/branches`, { branchIds });
        await api.put(`/employees/${id}/services`, { serviceIds });
      }

      notifications.show({
        title: isEdit ? 'Colaboradora actualizada' : 'Colaboradora creada',
        message: 'Los datos se guardaron correctamente.',
        color: 'green',
      });
      onSaved();
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error al guardar',
        message: getApiErrorMessage(error),
        color: 'red',
      });
    }
  });

  const branchOptions = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));
  const serviceOptions = services.map((s) => ({
    value: String(s.id),
    label: s.name,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <Group grow align="flex-start">
          <TextInput
            label="Nombres"
            required
            maxLength={80}
            {...form.getInputProps('firstName')}
          />
          <TextInput
            label="Apellidos"
            required
            maxLength={80}
            {...form.getInputProps('lastName')}
          />
        </Group>
        <TextInput label="Teléfono" {...form.getInputProps('phone')} />
        <MultiSelect
          label="Locales asignados"
          data={branchOptions}
          searchable
          {...form.getInputProps('branchIds')}
        />
        <MultiSelect
          label="Servicios que realiza"
          data={serviceOptions}
          searchable
          {...form.getInputProps('serviceIds')}
        />
        <Group justify="flex-end" mt="md">
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

export function EmployeeFormModal(props: EmployeeFormModalProps) {
  const { opened, onClose, employee, ...rest } = props;
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={employee ? 'Editar colaboradora' : 'Nueva colaboradora'}
      size="lg"
    >
      {opened ? (
        <EmployeeForm
          key={employee?.id ?? 'new'}
          employee={employee}
          onClose={onClose}
          {...rest}
        />
      ) : null}
    </Modal>
  );
}
