"use client";

import { Table, Text, UnstyledButton } from "@mantine/core";
import type { PaymentResponseDto } from "@/generated-client";
import { formatDateTime } from "@/lib/date-utils";
import { formatSoles } from "@/lib/format";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_TYPE_LABELS,
} from "@/lib/reservation-utils";

interface PaymentsTableProps {
  payments: PaymentResponseDto[];
  customerNames: Record<number, string>;
  reservationCustomerMap: Record<number, number>;
  userNames: Record<number, string>;
  totalNet: number;
  onViewReservation: (id: number) => void;
  onViewCustomerHistory: (customerId: number, name: string) => void;
}

export function PaymentsTable({
  payments,
  customerNames,
  reservationCustomerMap,
  userNames,
  totalNet,
  onViewReservation,
  onViewCustomerHistory,
}: PaymentsTableProps) {
  return (
    <Table.ScrollContainer minWidth={960}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Fecha</Table.Th>
            <Table.Th>Cliente</Table.Th>
            <Table.Th>Reserva</Table.Th>
            <Table.Th>Monto</Table.Th>
            <Table.Th>Método</Table.Th>
            <Table.Th>Tipo</Table.Th>
            <Table.Th>Registrado por</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {payments.map((payment) => {
            const custId = reservationCustomerMap[payment.reservationId];
            return (
              <Table.Tr key={payment.id}>
                <Table.Td>{formatDateTime(payment.createdAt)}</Table.Td>
                <Table.Td>
                  {custId ? (
                    <UnstyledButton
                      onClick={() =>
                        onViewCustomerHistory(
                          custId,
                          customerNames[custId] ?? "Cliente",
                        )
                      }
                    >
                      <Text size="sm" td="underline" c="inherit">
                        {customerNames[custId] ?? "—"}
                      </Text>
                    </UnstyledButton>
                  ) : (
                    "—"
                  )}
                </Table.Td>
                <Table.Td>
                  <UnstyledButton
                    onClick={() => onViewReservation(payment.reservationId)}
                  >
                    <Text size="sm" td="underline" c="inherit">
                      #{payment.reservationId}
                    </Text>
                  </UnstyledButton>
                </Table.Td>
                <Table.Td>
                  {payment.type === "refund" ? "−" : ""}
                  {formatSoles(parseFloat(payment.amount))}
                </Table.Td>
                <Table.Td>
                  {PAYMENT_METHOD_LABELS[payment.method] ?? payment.method}
                </Table.Td>
                <Table.Td>
                  {PAYMENT_TYPE_LABELS[payment.type] ?? payment.type}
                </Table.Td>
                <Table.Td>
                  {userNames[payment.registeredById] ??
                    `#${payment.registeredById}`}
                </Table.Td>
              </Table.Tr>
            );
          })}
          <Table.Tr>
            <Table.Td colSpan={3} fw={600}>
              Total neto
            </Table.Td>
            <Table.Td fw={600} colSpan={4}>
              {formatSoles(totalNet)}
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
