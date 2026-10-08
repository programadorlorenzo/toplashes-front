'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Burger, Center, Group, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import { api } from '@/lib/api';
import { hasAnyPermission } from '@/lib/permissions';
import { Sidebar } from '@/components/sidebar';
import { useAuthStore } from '@/stores/auth-store';
import {
  useBranchStore,
  type BranchOption,
} from '@/stores/branch-store';

interface BranchResponse {
  id: number;
  name: string;
}

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
      router.replace('/auth/login');
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
        hasAnyPermission(user.permissions, [
          'branches.read',
          'branches.manage',
        ])
      ) {
        try {
          const { data } = await api.get<BranchResponse[]>('/branches');
          options = data
            .filter((b) => branchIds.includes(b.id))
            .map((b) => ({ id: b.id, name: b.name }));
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
        selectedBranch &&
        options.some((b) => b.id === selectedBranch.id);

      if (!currentValid) {
        selectBranch(options[0]);
      }
    }

    void loadBranches();

    return () => {
      cancelled = true;
    };
  }, [
    ready,
    isAuthenticated,
    user,
    setBranches,
    selectBranch,
    selectedBranch,
  ]);

  if (!ready || !isAuthenticated) {
    return (
      <Center mih="100dvh">
        <Loader color="gray" type="dots" />
      </Center>
    );
  }

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        main: {
          backgroundColor: 'hsl(var(--background))',
        },
        navbar: {
          backgroundColor: 'hsl(var(--sidebar-bg))',
          borderRight: 'none',
        },
        header: {
          backgroundColor: 'hsl(var(--card))',
          borderBottom: '1px solid hsl(var(--border))',
        },
      }}
    >
      <AppShell.Header px="md">
        <Group h="100%" justify="space-between">
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
              aria-label="Menú"
            />
            <Image
              src="/brand/logo-toplashes.jpg"
              alt="Top Lashes Perú"
              width={80}
              height={36}
              style={{
                objectFit: 'contain',
                borderRadius: '4px',
              }}
            />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar onNavigate={close} />
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
