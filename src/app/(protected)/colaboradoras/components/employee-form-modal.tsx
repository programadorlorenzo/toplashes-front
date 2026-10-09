"use client";

import {
  Button,
  ColorInput,
  Group,
  Modal,
  MultiSelect,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import type {
  BranchResponseDto,
  EmployeeResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { colaboradorasApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";
import {
  chain,
  maxLength,
  requerido,
  telefonoOpcional,
} from "@/lib/validations";
interface EmployeeFormModalProps {
  opened: boolean;
  onClose: () => void;
  employee: EmployeeResponseDto | null;
  branches: BranchResponseDto[];
  services: ServiceResponseDto[];
  onSaved: () => void;
}

function EmployeeForm({
  employee,
  branches,
  services,
  onClose,
  onSaved,
}: Omit<EmployeeFormModalProps, "opened">) {
  const isEdit = Boolean(employee);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      firstName: employee?.firstName ?? "",
      lastName: employee?.lastName ?? "",
      phone: employee?.phone ?? "",
      color: employee?.color ?? "",
      branchIds: (employee?.branchIds ?? []).map(String),
      serviceIds: (employee?.serviceIds ?? []).map(String),
    },
    validate: {
      firstName: chain(requerido("Nombres"), maxLength("Nombres", 80)),
      lastName: chain(requerido("Apellidos"), maxLength("Apellidos", 80)),
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
        color: values.color || undefined,
      };

      let id = employee?.id;
      if (isEdit && employee) {
        await colaboradorasApi.employeeControllerUpdate(employee.id, body);
      } else {
        const { data } = await colaboradorasApi.employeeControllerCreate({
          ...body,
          isActive: true,
          branchIds,
          serviceIds,
        });
        id = data.id;
      }

      if (id) {
        await colaboradorasApi.employeeControllerAssignBranches(id, {
          branchIds,
        });
        await colaboradorasApi.employeeControllerAssignServices(id, {
          serviceIds,
        });
      }

      notifications.show({
        title: isEdit ? "Colaboradora actualizada" : "Colaboradora creada",
        message: "Los datos se guardaron correctamente.",
        color: "green",
      });
      onSaved();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error al guardar",
        message: getApiErrorMessage(error),
        color: "red",
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
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Apellidos"
            required
            maxLength={80}
            {...form.getInputProps("lastName")}
          />
        </Group>
        <Group grow align="flex-start">
          <TextInput label="Teléfono" {...form.getInputProps("phone")} />
          <ColorInput
            label="Color"
            placeholder="#8B7355"
            format="hex"
            swatches={[
              "#E57373",
              "#F06292",
              "#BA68C8",
              "#9575CD",
              "#7986CB",
              "#64B5F6",
              "#4FC3F7",
              "#4DD0E1",
              "#4DB6AC",
              "#81C784",
              "#AED581",
              "#FFD54F",
              "#FFB74D",
              "#FF8A65",
              "#A1887F",
              "#90A4AE",
            ]}
            {...form.getInputProps("color")}
          />
        </Group>
        <MultiSelect
          label="Locales asignados"
          data={branchOptions}
          searchable
          {...form.getInputProps("branchIds")}
        />
        <MultiSelect
          label="Servicios que realiza"
          data={serviceOptions}
          searchable
          {...form.getInputProps("serviceIds")}
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
      title={employee ? "Editar colaboradora" : "Nueva colaboradora"}
      size="lg"
    >
      {opened ? (
        <EmployeeForm
          key={employee?.id ?? "new"}
          employee={employee}
          onClose={onClose}
          {...rest}
        />
      ) : null}
    </Modal>
  );
}
