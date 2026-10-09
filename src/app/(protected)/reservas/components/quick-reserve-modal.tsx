"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Divider,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { DateTime } from "luxon";
import type {
  CustomerResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import { clientesApi, reservasApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";
import { RESERVATION_CHANNEL_LABELS } from "@/lib/reservation-utils";
import { CustomerHistoryInline } from "./customer-history-inline";

interface QuickReserveModalProps {
  opened: boolean;
  onClose: () => void;
  onCreated: () => void;
  branchId: number;
  date: string;
  employeeId: number | null;
  employeeName: string;
  services: ServiceResponseDto[];
  servicesById: Record<number, ServiceResponseDto>;
}

const channelOpts = Object.entries(RESERVATION_CHANNEL_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export function QuickReserveModal({
  opened,
  onClose,
  onCreated,
  branchId,
  date,
  employeeId,
  employeeName,
  services,
  servicesById,
}: QuickReserveModalProps) {
  const [customers, setCustomers] = useState<CustomerResponseDto[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [time, setTime] = useState("");
  const [channel, setChannel] = useState("whatsapp");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!opened) return;
    setCustomerId(null);
    setServiceId(null);
    setTime("");
    setChannel("whatsapp");
    setNotes("");
    async function load() {
      try {
        const { data } = await clientesApi.customerControllerFindAll();
        setCustomers(data);
      } catch {
        setCustomers([]);
      }
    }
    void load();
  }, [opened]);

  const selectedCustomer = customerId
    ? customers.find((c) => String(c.id) === customerId)
    : null;
  const selectedService = serviceId
    ? servicesById[parseInt(serviceId, 10)]
    : null;

  const availableServices = services.filter(
    (s) =>
      s.isActive &&
      (s.branchAssignments.length === 0 ||
        s.branchAssignments.some((a) => a.branchId === branchId && a.isActive)),
  );
  const serviceOptions = availableServices.map((s) => ({
    value: String(s.id),
    label: `${s.name} · S/ ${s.price.toFixed(2)} · ${s.duration}min`,
  }));
  const customerOptions = customers.map((c) => ({
    value: String(c.id),
    label: `${c.firstName} ${c.lastName}${c.whatsapp ? ` · ${c.whatsapp}` : ""}`,
  }));

  const handleSubmit = async () => {
    if (!customerId || !serviceId || !time || !selectedService) return;
    const start = DateTime.fromISO(`${date}T${time}`, {
      zone: "America/Lima",
    });
    if (!start.isValid) return;

    setSubmitting(true);
    try {
      await reservasApi.reservationControllerCreate({
        customerId: parseInt(customerId, 10),
        branchId,
        date,
        channel: channel as "whatsapp",
        notes: notes.trim() || undefined,
        services: [
          {
            serviceId: parseInt(serviceId, 10),
            employeeId: employeeId ?? undefined,
            startTime: start.toISO()!,
            agreedPrice: selectedService.price,
          },
        ],
      });
      notifications.show({
        title: "Reserva creada",
        color: "green",
        message: "Cita registrada correctamente.",
      });
      onCreated();
      onClose();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        employeeId ? `Nueva reserva — ${employeeName}` : "Nueva reserva — Cola"
      }
      size="lg"
      centered
      closeOnClickOutside={false}
      styles={{
        title: { fontWeight: 700, fontSize: "var(--mantine-font-size-lg)" },
      }}
    >
      <Stack gap="md">
        <Select
          label="Clienta"
          placeholder="Buscar por nombre o WhatsApp..."
          data={customerOptions}
          value={customerId}
          onChange={setCustomerId}
          searchable
          nothingFoundMessage="No encontrada"
          comboboxProps={{ withinPortal: true }}
        />

        {selectedCustomer && (
          <>
            <Divider />
            <CustomerHistoryInline
              customerId={selectedCustomer.id}
              customerName={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
              servicesById={servicesById}
            />
            <Divider />
          </>
        )}

        <Select
          label="Servicio"
          placeholder="Selecciona servicio"
          data={serviceOptions}
          value={serviceId}
          onChange={setServiceId}
          searchable
          comboboxProps={{ withinPortal: true }}
        />

        <Group gap="sm" grow wrap="wrap">
          <TimeInput
            label="Hora"
            value={time}
            onChange={(e) => setTime(e.currentTarget.value)}
          />
          <Select
            label="Canal"
            data={channelOpts}
            value={channel}
            onChange={(v) => v && setChannel(v)}
            comboboxProps={{ withinPortal: true }}
          />
        </Group>

        {selectedService && time && (
          <Text size="sm" c="dimmed">
            Fin estimado: ~{selectedService.duration} min después · S/{" "}
            {selectedService.price.toFixed(2)}
          </Text>
        )}

        <Textarea
          label="Notas (opcional)"
          minRows={1}
          autosize
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
        />

        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            styles={primaryButtonStyles}
            loading={submitting}
            disabled={!customerId || !serviceId || !time}
            onClick={() => void handleSubmit()}
          >
            Confirmar reserva
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
