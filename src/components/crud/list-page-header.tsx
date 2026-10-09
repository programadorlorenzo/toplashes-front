import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { Plus } from "lucide-react";
import { pageTitleStyle, primaryButtonStyles } from "@/lib/crud-styles";

interface ListPageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  extra?: React.ReactNode;
}

export function ListPageHeader({
  title,
  description,
  actionLabel = "Nuevo",
  onAction,
  actionDisabled,
  extra,
}: ListPageHeaderProps) {
  return (
    <Group justify="space-between" align="flex-end" wrap="wrap" gap="md">
      <Stack gap={4}>
        <Title order={2} style={pageTitleStyle}>
          {title}
        </Title>
        {description ? <Text c="dimmed">{description}</Text> : null}
      </Stack>
      <Group gap="sm">
        {extra}
        {onAction ? (
          <Button
            leftSection={<Plus size={16} />}
            onClick={onAction}
            disabled={actionDisabled}
            styles={primaryButtonStyles}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Group>
    </Group>
  );
}
