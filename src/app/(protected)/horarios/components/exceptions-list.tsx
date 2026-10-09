"use client";

import {
  ActionIcon,
  Group,
  ScrollArea,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/date-utils";
import { SCHEDULE_EXCEPTION_LABELS } from "@/lib/reservation-utils";
import type { ScheduleExceptionResponseDto } from "@/generated-client";

interface ExceptionsListProps {
  items: ScheduleExceptionResponseDto[];
  canManage: boolean;
  onEdit: (item: ScheduleExceptionResponseDto) => void;
  onDelete: (id: number) => void;
  deletingId: number | null;
}

export function ExceptionsList({
  items,
  canManage,
  onEdit,
  onDelete,
  deletingId,
}: ExceptionsListProps) {
  if (items.length === 0) {
    return (
      <Text c="dimmed" size="sm">
        No hay excepciones registradas para esta colaboradora.
      </Text>
    );
  }

  return (
    <ScrollArea type="auto">
      <Table miw={640} striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Fecha</Table.Th>
            <Table.Th>Tipo</Table.Th>
            <Table.Th>Horario</Table.Th>
            <Table.Th>Motivo</Table.Th>
            {canManage ? <Table.Th w={90} /> : null}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {items.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td>{formatDate(item.date)}</Table.Td>
              <Table.Td>
                {SCHEDULE_EXCEPTION_LABELS[item.type] ?? item.type}
              </Table.Td>
              <Table.Td>
                {item.startTime && item.endTime
                  ? `${item.startTime} – ${item.endTime}`
                  : (item.startTime ?? "—")}
              </Table.Td>
              <Table.Td>{item.reason ?? "—"}</Table.Td>
              {canManage ? (
                <Table.Td>
                  <Group gap={4} wrap="nowrap">
                    <Tooltip label="Editar">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => onEdit(item)}
                        aria-label="Editar"
                      >
                        <Pencil size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Eliminar">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        loading={deletingId === item.id}
                        onClick={() => onDelete(item.id)}
                        aria-label="Eliminar"
                      >
                        <Trash2 size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              ) : null}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
