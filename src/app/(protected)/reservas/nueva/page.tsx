'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Center, Loader, Paper, Stack, Stepper, Text, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { StepCustomer } from './components/step-customer';
import { StepServices } from './components/step-services';
import {
  StepAvailability,
  type SelectedServiceSlot,
} from './components/step-availability';
import { StepConfirm } from './components/step-confirm';
import { api } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/api-error';
import { cardPaperStyle, pageTitleStyle } from '@/lib/crud-styles';
import { todayISO } from '@/lib/date-utils';
import { useBranchStore } from '@/stores/branch-store';
import type { Customer, Service } from '@/types/api';

export default function NuevaReservaPage() {
  const searchParams = useSearchParams();
  const branches = useBranchStore((s) => s.branches);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);

  const [active, setActive] = useState(0);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [branchId, setBranchId] = useState<number | null>(
    selectedBranch?.id ?? null,
  );
  const [date, setDate] = useState(
    searchParams.get('date') ?? todayISO(),
  );
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [selections, setSelections] = useState<SelectedServiceSlot[]>([]);

  const preselectedEmployeeId = searchParams.get('employeeId')
    ? parseInt(searchParams.get('employeeId')!, 10)
    : undefined;
  const preselectedStartTime = searchParams.get('startTime') ?? undefined;

  useEffect(() => {
    const paramBranch = searchParams.get('branchId');
    if (paramBranch) {
      setBranchId(parseInt(paramBranch, 10));
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadServices() {
      setLoadingMeta(true);
      try {
        const { data } = await api.get<Service[]>('/services');
        setServices(data);
      } catch (error) {
        notifications.show({
          title: 'Error al cargar servicios',
          message: getApiErrorMessage(error),
          color: 'red',
        });
      } finally {
        setLoadingMeta(false);
      }
    }
    void loadServices();
  }, []);

  const servicesById = useMemo(
    () => Object.fromEntries(services.map((s) => [s.id, s])),
    [services],
  );

  const branchName =
    branches.find((b) => b.id === branchId)?.name ?? `Local ${branchId ?? ''}`;

  const serviceIdsNumeric = selectedServiceIds.map((id) => parseInt(id, 10));

  if (loadingMeta) {
    return (
      <Center py="xl">
        <Loader color="gray" type="dots" />
      </Center>
    );
  }

  return (
    <Stack gap="lg">
      <Stack gap={4}>
        <Title order={2} style={pageTitleStyle}>
          Nueva reserva
        </Title>
        <Text c="dimmed">
          Busca o crea la clienta, elige servicios y confirma el horario.
        </Text>
      </Stack>

      <Paper withBorder radius="md" p="lg" style={cardPaperStyle}>
        <Stepper active={active} onStepClick={setActive} allowNextStepsSelect={false}>
          <Stepper.Step label="Clienta" description="Buscar o crear">
            <StepCustomer
              selectedCustomerId={customer?.id ?? null}
              onSelectCustomer={setCustomer}
              onContinue={() => setActive(1)}
            />
          </Stepper.Step>

          <Stepper.Step label="Servicios" description="Local y fecha">
            <StepServices
              branches={branches}
              branchId={branchId}
              onBranchChange={setBranchId}
              date={date}
              onDateChange={setDate}
              services={services}
              selectedServiceIds={selectedServiceIds}
              onServiceIdsChange={setSelectedServiceIds}
              onBack={() => setActive(0)}
              onContinue={() => setActive(2)}
            />
          </Stepper.Step>

          <Stepper.Step label="Horario" description="Disponibilidad">
            {branchId ? (
              <StepAvailability
                branchId={branchId}
                date={date}
                serviceIds={serviceIdsNumeric}
                servicesById={servicesById}
                preselectedEmployeeId={preselectedEmployeeId}
                preselectedStartTime={preselectedStartTime}
                selections={selections}
                onSelectionsChange={setSelections}
                onBack={() => setActive(1)}
                onContinue={() => setActive(3)}
              />
            ) : (
              <Text c="dimmed">Selecciona un local en el paso anterior.</Text>
            )}
          </Stepper.Step>

          <Stepper.Step label="Confirmar" description="Precio y canal">
            {customer && branchId ? (
              <StepConfirm
                customer={customer}
                branchName={branchName}
                branchId={branchId}
                date={date}
                selections={selections}
                servicesById={servicesById}
                onBack={() => setActive(2)}
              />
            ) : (
              <Text c="dimmed">Completa los pasos anteriores.</Text>
            )}
          </Stepper.Step>
        </Stepper>
      </Paper>
    </Stack>
  );
}
