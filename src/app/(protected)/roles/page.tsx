"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Group,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { Pencil, Power, Trash2 } from "lucide-react";
import { ActiveBadge } from "@/components/crud/active-badge";
import { ListPageHeader } from "@/components/crud/list-page-header";
import type {
  PermissionResponseDto,
  RoleResponseDto,
} from "@/generated-client";
import { rolesApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { cardPaperStyle } from "@/lib/crud-styles";
import { hasAnyPermission } from "@/lib/permissions";
import { useAuthStore } from "@/stores/auth-store";
import { RoleFormModal } from "./components/role-form-modal";

export default function RolesPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canManage = hasAnyPermission(permissions, ["roles.manage"]);

  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionResponseDto[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<RoleResponseDto | null>(null);
  const [toDelete, setToDelete] = useState<RoleResponseDto | null>(null);
  const [formOpened, formHandlers] = useDisclosure(false);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        rolesApi.roleControllerFindAll(),
        rolesApi.roleControllerFindAllPermissions(),
      ]);
      setRoles(rolesRes.data);
      setAllPermissions(permsRes.data);
    } catch (error) {
      notifications.show({
        title: "Error al cargar",
        message: getApiErrorMessage(error),
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleActive = async (role: RoleResponseDto) => {
    if (role.isSystem) return;
    try {
      await rolesApi.roleControllerUpdate(role.id, {
        isActive: !role.isActive,
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

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await rolesApi.roleControllerRemove(toDelete.id);
      notifications.show({
        title: "Rol eliminado",
        message: toDelete.name,
        color: "green",
      });
      deleteHandlers.close();
      setToDelete(null);
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
        title="Roles"
        description="Permisos de acceso agrupados por módulo."
        actionLabel="Nuevo rol"
        onAction={
          canManage
            ? () => {
                setEditing(null);
                formHandlers.open();
              }
            : undefined
        }
      />

      <Paper withBorder radius="md" p="md" style={cardPaperStyle}>
        {loading ? (
          <Center py="xl">
            <Loader color="gray" type="dots" />
          </Center>
        ) : roles.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay roles registrados.
          </Text>
        ) : (
          <ScrollArea type="auto">
            <Table striped highlightOnHover miw={640}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Rol</Table.Th>
                  <Table.Th>Descripción</Table.Th>
                  <Table.Th>Permisos</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  {canManage ? <Table.Th w={120} /> : null}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {roles.map((role) => (
                  <Table.Tr key={role.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <Text fw={500}>{role.name}</Text>
                        {role.isSystem ? (
                          <Badge size="xs" variant="outline">
                            Sistema
                          </Badge>
                        ) : null}
                      </Group>
                    </Table.Td>
                    <Table.Td>{role.description ?? "—"}</Table.Td>
                    <Table.Td>
                      <Badge variant="light">{role.permissions.length}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <ActiveBadge active={role.isActive} />
                    </Table.Td>
                    {canManage ? (
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="Editar">
                            <ActionIcon
                              variant="subtle"
                              onClick={() => {
                                setEditing(role);
                                formHandlers.open();
                              }}
                            >
                              <Pencil size={16} />
                            </ActionIcon>
                          </Tooltip>
                          {!role.isSystem ? (
                            <>
                              <Tooltip
                                label={role.isActive ? "Desactivar" : "Activar"}
                              >
                                <ActionIcon
                                  variant="subtle"
                                  color={role.isActive ? "orange" : "green"}
                                  onClick={() => void toggleActive(role)}
                                >
                                  <Power size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Eliminar">
                                <ActionIcon
                                  variant="subtle"
                                  color="red"
                                  onClick={() => {
                                    setToDelete(role);
                                    deleteHandlers.open();
                                  }}
                                >
                                  <Trash2 size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          ) : null}
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

      <RoleFormModal
        opened={formOpened}
        onClose={formHandlers.close}
        role={editing}
        allPermissions={allPermissions}
        onSaved={load}
      />

      <Modal
        opened={deleteOpened}
        onClose={deleteHandlers.close}
        title="Eliminar rol"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            ¿Eliminar el rol <strong>{toDelete?.name}</strong>?
          </Text>
          <Group justify="flex-end">
            <Button variant="default" onClick={deleteHandlers.close}>
              Cancelar
            </Button>
            <Button color="red" onClick={() => void confirmDelete()}>
              Eliminar
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
