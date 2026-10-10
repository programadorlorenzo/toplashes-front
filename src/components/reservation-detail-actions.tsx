"use client";

import { ActionIcon, Button, Group, Menu } from "@mantine/core";
import { CalendarSync, CreditCard, MoreVertical, Undo2 } from "lucide-react";
import type { ReservationResponseDtoStatusEnum } from "@/generated-client";
import { primaryButtonStyles } from "@/lib/crud-styles";
import {
  RESERVATION_STATUS_ACTION_LABELS,
  RESERVATION_STATUS_LABELS,
} from "@/lib/reservation-utils";

interface ReservationDetailActionsProps {
  transitions: ReservationResponseDtoStatusEnum[];
  revertTo?: ReservationResponseDtoStatusEnum;
  hasCalendarEvent: boolean;
  isPaid: boolean;
  canUpdate: boolean;
  canCancel: boolean;
  canPay: boolean;
  updating: boolean;
  syncing: boolean;
  onStatus: (status: ReservationResponseDtoStatusEnum) => void;
  onSync: () => void;
  onPayment: () => void;
  onClose: () => void;
}

export function ReservationDetailActions({
  transitions,
  revertTo,
  hasCalendarEvent,
  isPaid,
  canUpdate,
  canCancel,
  canPay,
  updating,
  syncing,
  onStatus,
  onSync,
  onPayment,
  onClose,
}: ReservationDetailActionsProps) {
  const hasMenuItems = canUpdate && (revertTo || true);

  return (
    <Group justify="space-between" gap="xs">
      {hasMenuItems ? (
        <Menu shadow="md" width={220} position="top-start" withArrow>
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="md">
              <MoreVertical size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {revertTo ? (
              <Menu.Item
                leftSection={<Undo2 size={14} />}
                color="orange"
                onClick={() => onStatus(revertTo)}
                disabled={updating}
              >
                Revertir a {RESERVATION_STATUS_LABELS[revertTo]}
              </Menu.Item>
            ) : null}
            <Menu.Item
              leftSection={<CalendarSync size={14} />}
              color={hasCalendarEvent ? "teal" : "gray"}
              onClick={onSync}
              disabled={syncing}
            >
              {hasCalendarEvent
                ? "Resincronizar Calendar"
                : "Sincronizar Calendar"}
            </Menu.Item>
            {transitions.includes(
              "cancelled" as ReservationResponseDtoStatusEnum,
            ) && canCancel ? (
              <>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  onClick={() =>
                    onStatus("cancelled" as ReservationResponseDtoStatusEnum)
                  }
                  disabled={updating}
                >
                  Cancelar reserva
                </Menu.Item>
              </>
            ) : null}
          </Menu.Dropdown>
        </Menu>
      ) : (
        <div />
      )}

      <Group gap="xs">
        {canPay && !isPaid ? (
          <Button
            variant="light"
            size="xs"
            leftSection={<CreditCard size={14} />}
            onClick={onPayment}
          >
            Registrar pago
          </Button>
        ) : null}
        {canUpdate
          ? transitions
              .filter((s) => s !== "cancelled")
              .map((status) => (
                <Button
                  key={status}
                  size="xs"
                  styles={primaryButtonStyles}
                  loading={updating}
                  onClick={() => onStatus(status)}
                >
                  {RESERVATION_STATUS_ACTION_LABELS[status] ??
                    RESERVATION_STATUS_LABELS[status]}
                </Button>
              ))
          : null}
        <Button variant="default" size="xs" onClick={onClose}>
          Cerrar
        </Button>
      </Group>
    </Group>
  );
}
