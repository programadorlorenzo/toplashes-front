import { useCallback, useEffect, useMemo, useState } from "react";
import { notifications } from "@mantine/notifications";
import { DateTime } from "luxon";
import type {
  CustomerResponseDto,
  EmployeeResponseDto,
  ReservationResponseDto,
  ServiceResponseDto,
} from "@/generated-client";
import {
  clientesApi,
  colaboradorasApi,
  reservasApi,
  serviciosApi,
} from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { todayISO } from "@/lib/date-utils";
import { useBranchStore } from "@/stores/branch-store";
import type { EmployeeBooking } from "./employee-day-card";

export interface ServiceSelection {
  serviceId: number;
  employeeId: number | null;
  startTime: string;
  endTime: string;
  employeeName: string;
  agreedPrice: number;
}

interface Defaults {
  branchId?: number;
  date?: string;
}

export function useCreateReservation(opened: boolean, defaults: Defaults) {
  const branches = useBranchStore((s) => s.branches);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);

  const [customers, setCustomers] = useState<CustomerResponseDto[]>([]);
  const [services, setServices] = useState<ServiceResponseDto[]>([]);
  const [employees, setEmployees] = useState<EmployeeResponseDto[]>([]);
  const [reservations, setReservations] = useState<ReservationResponseDto[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [branchId, setBranchId] = useState<number | null>(
    defaults.branchId ?? selectedBranch?.id ?? null,
  );
  const [date, setDate] = useState(defaults.date ?? todayISO());
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [channel, setChannel] = useState("whatsapp");
  const [notes, setNotes] = useState("");
  const [discount, setDiscount] = useState<number | string>(0);
  const [times, setTimes] = useState<Record<string, string>>({});
  const [selections, setSelections] = useState<ServiceSelection[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: c }, { data: s }, { data: e }] = await Promise.all([
        clientesApi.customerControllerFindAll(),
        serviciosApi.serviceControllerFindAll(),
        colaboradorasApi.employeeControllerFindAll(),
      ]);
      setCustomers(c);
      setServices(s);
      setEmployees(e);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReservations = useCallback(async () => {
    if (!branchId) return;
    try {
      const { data } = await reservasApi.reservationControllerFindAll(
        branchId,
        date,
      );
      setReservations(data);
    } catch {
      setReservations([]);
    }
  }, [branchId, date]);

  useEffect(() => {
    if (opened) void loadInitial();
  }, [opened, loadInitial]);

  useEffect(() => {
    if (opened && branchId) void loadReservations();
  }, [opened, branchId, date, loadReservations]);

  useEffect(() => {
    if (!opened) return;
    setBranchId(defaults.branchId ?? selectedBranch?.id ?? null);
    setDate(defaults.date ?? todayISO());
    setCustomerId(null);
    setSelectedServiceIds([]);
    setSelections([]);
    setTimes({});
    setNotes("");
    setDiscount(0);
  }, [opened, defaults.branchId, defaults.date, selectedBranch]);

  const servicesById = useMemo(
    () =>
      Object.fromEntries(services.map((s) => [s.id, s])) as Record<
        number,
        ServiceResponseDto
      >,
    [services],
  );

  const serviceIdsNum = selectedServiceIds.map((id) => parseInt(id, 10));
  const activeServiceId = serviceIdsNum.find(
    (id) => !selections.some((s) => s.serviceId === id),
  );
  const activeService = activeServiceId
    ? servicesById[activeServiceId]
    : undefined;

  const qualifiedEmployees = useMemo(() => {
    if (!activeServiceId || !branchId) return [] as EmployeeResponseDto[];
    return employees.filter(
      (e) =>
        e.isActive &&
        e.branchIds.includes(branchId) &&
        e.serviceIds.includes(activeServiceId),
    );
  }, [employees, activeServiceId, branchId]);

  const bookingsByEmployee = useMemo(() => {
    const map: Record<number, EmployeeBooking[]> = {};
    for (const r of reservations) {
      for (const line of r.services) {
        if (line.employeeId === null) continue;
        const list = map[line.employeeId] ?? [];
        list.push({
          startTime: line.startTime,
          endTime: line.endTime,
          serviceName:
            servicesById[line.serviceId]?.name ?? `#${line.serviceId}`,
          status: r.status,
        });
        map[line.employeeId] = list;
      }
    }
    return map;
  }, [reservations, servicesById]);

  const handleSelectEmp = (empId: number | null, empName: string) => {
    if (!activeServiceId || !activeService) return;
    const key = empId !== null ? String(empId) : "none";
    const time = times[key];
    if (!time) return;
    const start = DateTime.fromISO(`${date}T${time}`, {
      zone: "America/Lima",
    });
    if (!start.isValid) return;
    const end = start.plus({ minutes: activeService.duration });
    setSelections((prev) => [
      ...prev,
      {
        serviceId: activeServiceId,
        employeeId: empId,
        startTime: start.toISO()!,
        endTime: end.toISO()!,
        employeeName: empName,
        agreedPrice: activeService.price,
      },
    ]);
  };

  const allAssigned = serviceIdsNum.every((id) =>
    selections.some((s) => s.serviceId === id),
  );
  const discountNum =
    typeof discount === "number" ? discount : parseFloat(discount || "0");
  const subtotal = selections.reduce((s, l) => s + l.agreedPrice, 0);
  const total = Math.max(
    subtotal - (Number.isFinite(discountNum) ? discountNum : 0),
    0,
  );

  const customerOpts = customers.map((c) => ({
    value: String(c.id),
    label: `${c.firstName} ${c.lastName}${c.whatsapp ? ` · ${c.whatsapp}` : ""}`,
  }));
  const branchOpts = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));
  const svcOpts = services
    .filter(
      (s) =>
        s.isActive &&
        (!branchId ||
          s.branchAssignments.length === 0 ||
          s.branchAssignments.some(
            (a) => a.branchId === branchId && a.isActive,
          )),
    )
    .map((s) => ({
      value: String(s.id),
      label: `${s.name} · S/ ${s.price.toFixed(2)} · ${s.duration}min`,
    }));

  return {
    loading,
    submitting,
    setSubmitting,
    customerId,
    setCustomerId,
    branchId,
    setBranchId,
    date,
    setDate,
    channel,
    setChannel,
    notes,
    setNotes,
    discount,
    setDiscount,
    selectedServiceIds,
    setSelectedServiceIds,
    selections,
    setSelections,
    times,
    setTimes,
    servicesById,
    activeService,
    qualifiedEmployees,
    bookingsByEmployee,
    allAssigned,
    total,
    discountNum,
    handleSelectEmp,
    customerOpts,
    branchOpts,
    svcOpts,
  };
}
