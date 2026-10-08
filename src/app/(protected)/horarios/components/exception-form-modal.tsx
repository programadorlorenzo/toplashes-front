'use client';

import {
  Button,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { primaryButtonStyles } from '@/lib/crud-styles';
import { toISODate } from '@/lib/date-utils';
import { SCHEDULE_EXCEPTION_LABELS } from '@/lib/reservation-utils';
import type { ScheduleException, ScheduleExceptionType } from '@/types/api';

interface ExceptionFormModalProps {
  opened: boolean;
  onClose: () => void;
  employeeId: number;
  exception: ScheduleException | null;
  onSaved: () => void;
}

const typeOptions = Object.entries(SCHEDULE_EXCEPTION_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function ExceptionFormModal({
  opened,
  onClose,
  employeeId,
  exception,
  onSaved,
}: ExceptionFormModalProps) {
  const isEdit = Boolean(exception);

  const form = useForm({
    initialValues: {
      date: exception?.date ?? toISODate(new Date()),
      type: (exception?.type ?? 'absence') as ScheduleExceptionType,
      startTime: exception?.startTime ?? '',
      endTime: exception?.endTime ?? '',
      reason: exception?.reason ?? '',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const payload = {
        employeeId,
        date: values.date,
        type: values.type,
        startTime: values.startTime.trim() || undefined,
        endTime: values.endTime.trim() || undefined,
        reason: values.reason.trim() || undefined,
      };
      if (isEdit && exception) {
        await api.put(`/schedules/exceptions/${exception.id}`, payload);
      } else {
        await api.post('/schedules/exceptions', payload);
      }
      notifications.show({
        title: isEdit ? 'Excepción actualizada' : 'Excepción creada',
        color: 'green',
        message: 'El horario especial se guardó.',
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

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? 'Editar excepción' : 'Nueva excepción'}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <DatePickerInput
            label="Fecha"
            value={form.values.date}
            onChange={(value) => {
              if (value) form.setFieldValue('date', toISODate(value));
            }}
            valueFormat="DD/MM/YYYY"
            required
          />
          <Select
            label="Tipo"
            data={typeOptions}
            comboboxProps={{ withinPortal: true }}
            {...form.getInputProps('type')}
          />
          <TextInput
            label="Hora inicio (opcional)"
            placeholder="HH:mm"
            {...form.getInputProps('startTime')}
          />
          <TextInput
            label="Hora fin (opcional)"
            placeholder="HH:mm"
            {...form.getInputProps('endTime')}
          />
          <Textarea label="Motivo" minRows={2} {...form.getInputProps('reason')} />
          <Group justify="flex-end">
            <Button variant="default" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" styles={primaryButtonStyles}>
              Guardar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
