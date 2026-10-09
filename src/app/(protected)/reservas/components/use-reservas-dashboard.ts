import { useCallback, useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import type {
  EmployeeResponseDto,
  ReservationResponseDto,
  ReservationResponseDtoStatusEnum,
  ServiceResponseDto,
} from "@/generated-client";
import {
  clientesApi,
  colaboradorasApi,
  reservasApi,
  serviciosApi,
} from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";

export interface BookingItem {
  reservationId: number;
  lineId: number;
  serviceId: number;
  serviceName: string;
  customerId: number;
  customerName: string;
  startTime: string;
  endTime: string;
  status: ReservationResponseDtoStatusEnum;
  employeeId: number | null;
  hasCalendarEvent: boolean;
}

export function useReservasDashboard(branchId: number | null, date: string) {
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [services, setServices] = useState<ServiceResponseDto[]>([]);
  const [reservations, setReservations] = useState<ReservationResponseDto[]>(
    [],
  );
  const [customerNames, setCustomerNames] = useState<Record<number, string>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [{ data: emps }, { data: svcs }] = await Promise.all([
          colaboradorasApi.employeeControllerFindAll(),
          serviciosApi.serviceControllerFindAll(),
        ]);
        setEmployees(emps);
        setServices(svcs);
      } catch (error) {
        notifications.show({
          title: "Error",
          message: getApiErrorMessage(error),
          color: "red",
        });
      }
    }
    void load();
  }, []);

  const loadReservations = useCallback(async () => {
    if (!branchId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await reservasApi.reservationControllerFindAll(
        branchId,
        date,
      );
      setReservations(data);
      const ids = [...new Set(data.map((r) => r.customerId))];
      const names: Record<number, string> = {};
      await Promise.all(
        ids.map(async (id) => {
          try {
            const { data: c } = await clientesApi.customerControllerFindOne(id);
            names[id] = `${c.firstName} ${c.lastName}`;
          } catch {
            names[id] = `Cliente #${id}`;
          }
        }),
      );
      setCustomerNames(names);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, [branchId, date]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const servicesById = useMemo(
    () =>
      Object.fromEntries(services.map((s) => [s.id, s])) as Record<
        number,
        ServiceResponseDto
      >,
    [services],
  );

  const allBookings = useMemo(() => {
    const items: BookingItem[] = [];
    for (const r of reservations) {
      for (const line of r.services) {
        items.push({
          reservationId: r.id,
          lineId: line.id,
          serviceId: line.serviceId,
          serviceName:
            servicesById[line.serviceId]?.name ?? `#${line.serviceId}`,
          customerId: r.customerId,
          customerName: customerNames[r.customerId] ?? `#${r.customerId}`,
          startTime: line.startTime,
          endTime: line.endTime,
          status: r.status,
          employeeId: line.employeeId,
          hasCalendarEvent: !!r.googleCalendarEventId,
        });
      }
    }
    return items;
  }, [reservations, servicesById, customerNames]);

  const bookingsByEmployee = useMemo(() => {
    const map: Record<number, BookingItem[]> = {};
    for (const b of allBookings) {
      if (b.employeeId === null) continue;
      const list = map[b.employeeId] ?? [];
      list.push(b);
      map[b.employeeId] = list;
    }
    for (const list of Object.values(map)) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [allBookings]);

  const queue = useMemo(
    () =>
      allBookings
        .filter((b) => b.employeeId === null)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    [allBookings],
  );

  const branchEmployees = useMemo(
    () =>
      branchId
        ? employees.filter((e) => e.isActive && e.branchIds.includes(branchId))
        : [],
    [employees, branchId],
  );

  return {
    loading,
    branchEmployees,
    services,
    servicesById,
    bookingsByEmployee,
    queue,
    customerNames,
    reload: loadReservations,
  };
}
