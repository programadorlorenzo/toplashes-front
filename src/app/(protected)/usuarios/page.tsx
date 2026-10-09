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
  BranchResponseDto,
  RoleResponseDto,
  UserResponseDto,
} from "@/generated-client";
import { rolesApi, sucursalesApi, usuariosApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-error";
import { cardPaperStyle } from "@/lib/crud-styles";
import { hasAnyPermission } from "@/lib/permissions";
import { useAuthStore } from "@/stores/auth-store";
import { UserFormModal } from "./components/user-form-modal";

export default function UsuariosPage() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? []);
  const canManage = hasAnyPermission(permissions, ["users.manage"]);

  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [roles, setRoles] = useState<RoleResponseDto[]>([]);
  const [branches, setBranches] = useState<BranchResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<UserResponseDto | null>(null);
  const [toDelete, setToDelete] = useState<UserResponseDto | null>(null);
  const [formOpened, formHandlers] = useDisclosure(false);
  const [deleteOpened, deleteHandlers] = useDisclosure(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, r, b] = await Promise.all([
        usuariosApi.userControllerFindAll(),
        rolesApi.roleControllerFindAll(),
        sucursalesApi.branchControllerFindAll(),
      ]);
      setUsers(u.data);
      setRoles(r.data);
      setBranches(b.data);
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

  const toggleActive = async (user: UserResponseDto) => {
    try {
      await usuariosApi.userControllerUpdate(user.id, {
        isActive: !user.isActive,
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
      await usuariosApi.userControllerRemove(toDelete.id);
      notifications.show({
        title: "Usuario eliminado",
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
        title="Usuarios"
        description="Accesos al sistema, roles y locales."
        actionLabel="Nuevo usuario"
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
        ) : users.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            No hay usuarios registrados.
          </Text>
        ) : (
          <ScrollArea type="auto">
            <Table striped highlightOnHover miw={720}>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nombre</Table.Th>
                  <Table.Th>Correo</Table.Th>
                  <Table.Th>Rol</Table.Th>
                  <Table.Th>Locales</Table.Th>
                  <Table.Th>Estado</Table.Th>
                  {canManage ? <Table.Th w={120} /> : null}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {users.map((user) => (
                  <Table.Tr key={user.id}>
                    <Table.Td fw={500}>{user.name}</Table.Td>
                    <Table.Td>{user.email}</Table.Td>
                    <Table.Td>
                      <Badge variant="light">{user.roleName}</Badge>
                    </Table.Td>
                    <Table.Td>{user.branches.length}</Table.Td>
                    <Table.Td>
                      <ActiveBadge active={user.isActive} />
                    </Table.Td>
                    {canManage ? (
                      <Table.Td>
                        <Group gap={4}>
                          <Tooltip label="Editar">
                            <ActionIcon
                              variant="subtle"
                              onClick={() => {
                                setEditing(user);
                                formHandlers.open();
                              }}
                            >
                              <Pencil size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip
                            label={user.isActive ? "Desactivar" : "Activar"}
                          >
                            <ActionIcon
                              variant="subtle"
                              color={user.isActive ? "orange" : "green"}
                              onClick={() => void toggleActive(user)}
                            >
                              <Power size={16} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Eliminar">
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              onClick={() => {
                                setToDelete(user);
                                deleteHandlers.open();
                              }}
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
        )}
      </Paper>

      <UserFormModal
        opened={formOpened}
        onClose={formHandlers.close}
        user={editing}
        roles={roles}
        branches={branches}
        onSaved={load}
      />

      <Modal
        opened={deleteOpened}
        onClose={deleteHandlers.close}
        title="Eliminar usuario"
        centered
      >
        <Stack gap="md">
          <Text size="sm">
            ¿Eliminar a <strong>{toDelete?.name}</strong>? Esta acción no se
            puede deshacer.
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
