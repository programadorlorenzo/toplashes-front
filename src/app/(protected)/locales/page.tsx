"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ActionIcon,
  Center,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Pencil, Power } from "lucide-react";
import { ActiveBadge } from "@/components/crud/active-badge";
import { ListPageHeader } from "@/components/crud/list-page-header";
import type { BranchResponseDto } from "@/generated-client";
import { sucursalesApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { formatWorkDays } from "@/lib/constants";
import { cardPaperStyle } from "@/lib/crud-styles";
import { hasAnyPermission } from "@/lib/permissions";
import { useAuthStore } from "@/stores/auth-store";
import { BranchFormModal } from "./components/branch-form-modal";

export default function LocalesPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canManage = hasAnyPermission(permissions, ["branches.manage"]);

  const [items, setItems] = useState<BranchResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BranchResponseDto | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await sucursalesApi.branchControllerFindAll();
      setItems(data);
    } catch (error) {
      notifications.show({
        title: "Error al cargar",
        message: getApiErrorMessage(error, "No se pudieron cargar los locales"),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    open();
  };

  const openEdit = (branch: BranchResponseDto) => {
    setEditing(branch);
    open();
  };

  const toggleActive = async (branch: BranchResponseDto) => {
    try {
      await sucursalesApi.branchControllerUpdate(branch.id, {
        isActive: !branch.isActive,
      });
      notifications.show({
        title: branch.isActive ? "Local desactivado" : "Local activado",
        message: branch.name,
        color: "green",
      });
      void load();
    } catch (error) {
      notifications.show({
        title: "Error",
        message: getApiErrorMessage(error),
        color: "red",
      });
    }
  };

  return (
    <Stack gap="lg">
      <ListPageHeader
        title="Locales"
        description="Administra sucursales, horarios y días de atención."
        actionLabel="Nuevo local"
        onAction={canManage ? openCreate : undefined}
      />

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : items.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay locales registrados.
          </Text>
        ) : (
          <ScrollArea type="auto">
            <Table striped highlightOnHover miw={720}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>Dirección</Table.Th>
                  <Table.Th>Teléfono</Table.Th>
                  <Table.Th>Horario</Table.Th>
                  <Table.Th>Días</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  {canManage ? <Table.Th w={100} /> : null}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {items.map((branch) => (
                  <Table.Tr key={branch.id}>
                    <Table.Td fw={500}>{branch.name}</Table.Td>
                    <Table.Td>{branch.address}</Table.Td>
                    <Table.Td>{branch.phone ?? "—"}</Table.Td>
                    <Table.Td>
                      {branch.openTime} – {branch.closeTime}
                    </Table.Td>
                    <Table.Td>{formatWorkDays(branch.workDays)}</Table.Td>
                    <Table.Td>
                      <ActiveBadge active={branch.isActive} />
                    </Table.Td>
                    {canManage ? (
                      <Table.Td>
                        <Group gap={4} wrap="nowrap">
                          <Tooltip label="Editar">
                            <ActionIcon
                              variant="subtle"
                              color="gray"
                              onClick={() => openEdit(branch)}
                              aria-label="Editar local"
                            >
                              <Pencil size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip
                            label={branch.isActive ? "Desactivar" : "Activar"}
                          >
                            <ActionIcon
                              variant="subtle"
                              color={branch.isActive ? "orange" : "green"}
                              onClick={() => void toggleActive(branch)}
                              aria-label="Cambiar estado"
                            >
                              <Power size={16} />
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
        )}
      </Paper>

      <BranchFormModal
        opened={opened}
        onClose={close}
        branch={editing}
        onSaved={load}
      />
    </Stack>
  );
}
