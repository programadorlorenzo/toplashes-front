"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, Burger, Center, Group, Loader } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { sucursalesApi } from "@/lib/api";
import { hasAnyPermission } from "@/lib/permissions";
import { Sidebar } from "@/components/sidebar";
import { useAuthStore } from "@/stores/auth-store";
import { useBranchStore, type BranchOption } from "@/stores/branch-store";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [opened, { toggle, close }] = useDisclosure();
  const [ready, setReady] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const setBranches = useBranchStore((s) => s.setBranches);
  const selectBranch = useBranchStore((s) => s.selectBranch);
  const selectedBranch = useBranchStore((s) => s.selectedBranch);

  useEffect(() => {
    const finishHydration = () => setReady(true);
    if (useAuthStore.persist.hasHydrated()) {
      finishHydration();
      return;
    }
    return useAuthStore.persist.onFinishHydration(finishHydration);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [ready, isAuthenticated, router]);

  useEffect(() => {
    if (!ready || !isAuthenticated || !user) return;

    let cancelled = false;

    async function loadBranches() {
      if (!user) return;

      const branchIds = user.branchIds ?? [];
      let options: BranchOption[] = [];

      if (
        branchIds.length > 0 &&
        hasAnyPermission(user.permissions, ["branches.read", "branches.manage"])
      ) {
        try {
          const { data } = await sucursalesApi.branchControllerFindAll();
          options = data
            .filter((b) => branchIds.includes(b.id))
            .map((b) => ({
              id: b.id,
              name: b.name,
              openTime: b.openTime,
              closeTime: b.closeTime,
            }));
        } catch {
          options = branchIds.map((id) => ({
            id,
            name: `Local ${id}`,
          }));
        }
      } else if (branchIds.length > 0) {
        options = branchIds.map((id) => ({
          id,
          name: `Local ${id}`,
        }));
      }

      if (cancelled) return;

      setBranches(options);

      if (options.length === 0) {
        return;
      }

      const currentValid =
        selectedBranch && options.some((b) => b.id === selectedBranch.id);

      if (!currentValid) {
        selectBranch(options[0]);
      }
    }

    void loadBranches();

    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated, user, setBranches, selectBranch, selectedBranch]);

  if (!ready || !isAuthenticated) {
    return (
      <Center mih="100dvh">
        <Loader color="gray" type="dots" />
      </Center>
    );
  }

  return (
    <AppShell
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        main: {
          backgroundColor: "hsl(var(--background))",
        },
        navbar: {
          backgroundColor: "hsl(var(--sidebar-bg))",
          borderRight: "none",
        },
      }}
    >
      <AppShell.Navbar>
        <Sidebar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Group hiddenFrom="sm" mb="sm">
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            aria-label="Menú"
            color="hsl(var(--tl-brown-dark))"
          />
        </Group>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
