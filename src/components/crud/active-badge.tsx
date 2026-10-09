import { Badge } from "@mantine/core";

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <Badge variant="light" color={active ? "green" : "gray"} size="sm">
      {active ? "Activo" : "Inactivo"}
    </Badge>
  );
}
