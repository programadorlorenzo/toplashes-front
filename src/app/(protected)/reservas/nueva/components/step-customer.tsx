"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
  CalendarDays,
  Check,
  Search,
  UserPlus,
  UserSearch,
  X,
} from "lucide-react";
import { CustomerReservationsModal } from "@/components/customer-reservations-modal";
import { ReservationDetailModal } from "@/components/reservation-detail-modal";
import { CreateCustomerForm } from "./create-customer-form";
import type { CustomerResponseDto } from "@/generated-client";
import { clientesApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { primaryButtonStyles } from "@/lib/crud-styles";

interface StepCustomerProps {
  selectedCustomerId: number | null;
  onSelectCustomer: (customer: CustomerResponseDto | null) => void;
  onContinue: () => void;
}

export function StepCustomer({
  selectedCustomerId,
  onSelectCustomer,
  onContinue,
}: StepCustomerProps) {
  const [search, setSearch] = useState("");
  const [debounced] = useDebouncedValue(search, 350);
  const [results, setResults] = useState<CustomerResponseDto[]>([]);
  const [selected, setSelected] = useState<CustomerResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"search" | "create">("search");
  const [historyCust, setHistoryCust] = useState<CustomerResponseDto | null>(
    null,
  );
  const [detailId, setDetailId] = useState<number | null>(null);

  const loadSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await clientesApi.customerControllerFindAll(
        query.trim(),
      );
      setResults(data);
    } catch (error) {
      notifications.show({
        title: "Error en búsqueda",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSearch(debounced);
  }, [debounced, loadSearch]);

  const pick = (customer: CustomerResponseDto) => {
    setSelected(customer);
    onSelectCustomer(customer);
  };
  const clear = () => {
    setSelected(null);
    onSelectCustomer(null);
  };

  return (
    <Stack gap="md">
      {/* Banner de clienta seleccionada */}
      {selectedCustomerId && selected ? (
        <Paper
          p="sm"
          radius="md"
          withBorder
          style={{
            borderColor: "hsl(var(--tl-taupe))",
            backgroundColor: "hsl(var(--tl-cream) / 0.5)",
          }}
        >
          <Group justify="space-between" wrap="nowrap">
            <Group gap="sm" wrap="nowrap">
              <Badge color="green" variant="light" circle size="lg">
                <Check size={14} />
              </Badge>
              <Stack gap={0}>
                <Text size="sm" fw={600}>
                  {selected.firstName} {selected.lastName}
                </Text>
                <Text size="xs" c="dimmed">
                  {selected.whatsapp}
                </Text>
              </Stack>
            </Group>
            <Group gap="xs">
              <Tooltip label="Historial">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  onClick={() => setHistoryCust(selected)}
                >
                  <CalendarDays size={14} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Cambiar">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  color="red"
                  onClick={clear}
                >
                  <X size={14} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Paper>
      ) : null}

      {/* Toggle buscar / crear */}
      <Group gap="xs">
        <Button
          variant={mode === "search" ? "filled" : "light"}
          size="xs"
          leftSection={<UserSearch size={14} />}
          styles={mode === "search" ? primaryButtonStyles : undefined}
          onClick={() => setMode("search")}
        >
          Buscar existente
        </Button>
        <Button
          variant={mode === "create" ? "filled" : "light"}
          size="xs"
          leftSection={<UserPlus size={14} />}
          styles={mode === "create" ? primaryButtonStyles : undefined}
          onClick={() => setMode("create")}
        >
          Crear nueva
        </Button>
      </Group>

      {mode === "search" ? (
        <>
          <TextInput
            placeholder="Buscar por nombre o WhatsApp…"
            leftSection={<Search size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            autoFocus
          />
          {loading ? (
            <Text size="sm" c="dimmed">
              Buscando…
            </Text>
          ) : null}
          {results.length > 0 ? (
            <ScrollArea.Autosize mah={280} type="auto">
              <Stack gap={6}>
                {results.map((c) => {
                  const active = selectedCustomerId === c.id;
                  return (
                    <Paper
                      key={c.id}
                      withBorder
                      px="sm"
                      py="xs"
                      radius="sm"
                      onClick={() => pick(c)}
                      style={{
                        cursor: "pointer",
                        borderColor: active
                          ? "hsl(var(--tl-taupe))"
                          : undefined,
                        backgroundColor: active
                          ? "hsl(var(--tl-cream) / 0.4)"
                          : undefined,
                      }}
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <Group gap="sm" wrap="nowrap">
                          {active ? (
                            <Check
                              size={14}
                              style={{ color: "hsl(var(--tl-taupe))" }}
                            />
                          ) : null}
                          <Stack gap={0}>
                            <Text size="sm" fw={500}>
                              {c.firstName} {c.lastName}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {c.whatsapp}
                            </Text>
                          </Stack>
                        </Group>
                        <Tooltip label="Historial">
                          <ActionIcon
                            variant="subtle"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistoryCust(c);
                            }}
                          >
                            <CalendarDays size={14} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Paper>
                  );
                })}
              </Stack>
            </ScrollArea.Autosize>
          ) : null}
          {!loading && debounced && results.length === 0 ? (
            <Text size="sm" c="dimmed" ta="center" py="sm">
              Sin resultados. Puedes crear una clienta nueva.
            </Text>
          ) : null}
          <Divider />
          <Group justify="flex-end">
            <Button
              styles={primaryButtonStyles}
              disabled={!selectedCustomerId}
              size="md"
              onClick={onContinue}
            >
              Continuar
            </Button>
          </Group>
        </>
      ) : (
        <CreateCustomerForm
          onCreated={(c) => {
            pick(c);
            onContinue();
          }}
        />
      )}

      <CustomerReservationsModal
        opened={historyCust !== null}
        onClose={() => setHistoryCust(null)}
        customerId={historyCust?.id ?? null}
        customerName={
          historyCust ? `${historyCust.firstName} ${historyCust.lastName}` : ""
        }
        onSelectReservation={(id) => {
          setHistoryCust(null);
          setDetailId(id);
        }}
      />
      <ReservationDetailModal
        opened={detailId !== null}
        onClose={() => setDetailId(null)}
        reservationId={detailId}
      />
    </Stack>
  );
}
