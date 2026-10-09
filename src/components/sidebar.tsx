"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Divider,
  NavLink,
  ScrollArea,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useBranchStore } from "@/stores/branch-store";
import { getVisibleMenuItems } from "@/lib/permissions";

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const branches = useBranchStore((s) => s.branches);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);
  const selectBranch = useBranchStore((s) => s.selectBranch);

  const permissions = user?.permissions ?? [];
  const visibleItems = getVisibleMenuItems(permissions);

  const handleLogout = () => {
    logout();
    router.replace("/auth/login");
  };

  const branchOptions = branches.map((b) => ({
    value: String(b.id),
    label: b.name,
  }));

  return (
    <Stack
      h="100%"
      gap={0}
      style={{
        backgroundColor: "hsl(var(--sidebar-bg))",
        color: "hsl(var(--sidebar-text))",
      }}
    >
      {/* Brand Logo */}
      <Box py="md" px="md">
        <Box
          style={{
            width: 130,
            height: 56,
            position: "relative",
            margin: "0 auto",
            filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.25))",
          }}
        >
          <Image
            src="/brand/logo-toplashes.jpg"
            alt="Top Lashes Perú"
            fill
            sizes="130px"
            style={{
              objectFit: "contain",
              borderRadius: "6px",
            }}
          />
        </Box>
      </Box>

      {/* Branch selector */}
      {branches.length > 1 && (
        <Box px="sm" pb="sm">
          <Select
            placeholder="Selecciona un local"
            data={branchOptions}
            value={selectedBranch ? String(selectedBranch.id) : null}
            onChange={(value) => {
              const branch = branches.find((b) => String(b.id) === value);
              if (branch) selectBranch(branch);
            }}
            size="xs"
            comboboxProps={{ withinPortal: true }}
            styles={{
              input: {
                backgroundColor: "hsl(var(--sidebar-hover))",
                borderColor: "hsl(var(--sidebar-muted))",
                color: "hsl(var(--sidebar-text))",
                fontSize: "0.8rem",
              },
              label: {
                color: "hsl(var(--sidebar-muted))",
                fontSize: "0.7rem",
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
              },
            }}
          />
        </Box>
      )}

      <Divider color="hsl(var(--sidebar-hover))" style={{ opacity: 0.5 }} />

      {/* Navigation */}
      <ScrollArea flex={1} type="auto" offsetScrollbars>
        <Stack gap={2} py="sm" px="xs">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<Icon size={17} strokeWidth={1.5} />}
                active={active}
                onClick={onNavigate}
                styles={{
                  root: {
                    borderRadius: "var(--mantine-radius-md)",
                    color: active
                      ? "hsl(var(--sidebar-active-text))"
                      : "hsl(var(--sidebar-text))",
                    backgroundColor: active
                      ? "hsl(var(--sidebar-active))"
                      : "transparent",
                    fontSize: "0.85rem",
                    fontWeight: active ? 500 : 400,
                  },
                }}
              />
            );
          })}
        </Stack>
      </ScrollArea>

      <Divider color="hsl(var(--sidebar-hover))" style={{ opacity: 0.5 }} />

      {/* User info + Logout */}
      <Box p="sm">
        <Stack gap={4}>
          {user && (
            <>
              <Text
                size="xs"
                fw={500}
                lineClamp={1}
                style={{ color: "hsl(var(--sidebar-text))" }}
              >
                {user.name}
              </Text>
              <Text
                size="xs"
                lineClamp={1}
                style={{ color: "hsl(var(--sidebar-muted))" }}
              >
                {user.roleName}
              </Text>
            </>
          )}
          <Button
            variant="subtle"
            size="xs"
            leftSection={<LogOut size={14} />}
            onClick={handleLogout}
            fullWidth
            justify="flex-start"
            styles={{
              root: {
                color: "hsl(var(--sidebar-muted))",
              },
            }}
          >
            Cerrar sesión
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}
