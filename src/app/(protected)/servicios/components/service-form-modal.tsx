'use client';

import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { primaryButtonStyles } from '@/lib/crud-styles';
import { chain, maxLength, requerido } from '@/lib/validations';
import type { Service, ServiceCategory } from '@/types/api';

interface ServiceFormModalProps {
  opened: boolean;
  onClose: () => void;
  service: Service | null;
  categories: ServiceCategory[];
  onSaved: () => void;
}

function ServiceForm({
  service,
  categories,
  onClose,
  onSaved,
}: Omit<ServiceFormModalProps, 'opened'>) {
  const isEdit = Boolean(service);
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: service?.name ?? '',
      categoryId: service ? String(service.categoryId) : '',
      description: service?.description ?? '',
      price: service?.price ?? 0,
      duration: service?.duration ?? 60,
      prepTime: service?.prepTime ?? 0,
    },
    validate: {
      name: chain(requerido('Nombre'), maxLength('Nombre', 120)),
      categoryId: requerido('Categoría'),
      duration: (v) => (v >= 1 ? null : 'Duración mínima: 1 min'),
      price: (v) => (v >= 0 ? null : 'Precio inválido'),
    },
  });

  const categoryOptions = categories
    .filter((c) => c.isActive || c.id === service?.categoryId)
    .map((c) => ({ value: String(c.id), label: c.name }));

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const payload = {
        name: values.name,
        categoryId: Number(values.categoryId),
        description: values.description || undefined,
        price: values.price,
        duration: values.duration,
        prepTime: values.prepTime,
      };
      if (isEdit && service) {
        await api.put(`/services/${service.id}`, payload);
      } else {
        await api.post('/services', { ...payload, isActive: true });
      }
      notifications.show({
        title: isEdit ? 'Servicio actualizado' : 'Servicio creado',
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
        <Select
          label="Categoría"
          required
          data={categoryOptions}
          searchable
          {...form.getInputProps('categoryId')}
        />
        <Textarea label="Descripción" minRows={2} {...form.getInputProps('description')} />
        <Group grow>
          <NumberInput
            label="Precio (S/)"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            {...form.getInputProps('price')}
          />
          <NumberInput
            label="Duración (min)"
            min={1}
            {...form.getInputProps('duration')}
          />
          <NumberInput
            label="Prep. (min)"
            min={0}
            {...form.getInputProps('prepTime')}
          />
        </Group>
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

export function ServiceFormModal(props: ServiceFormModalProps) {
  const { opened, onClose, service, ...rest } = props;
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={service ? 'Editar servicio' : 'Nuevo servicio'}
      size="lg"
    >
      {opened ? (
        <ServiceForm key={service?.id ?? 'new'} service={service} onClose={onClose} {...rest} />
      ) : null}
    </Modal>
  );
}
