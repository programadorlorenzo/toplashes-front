import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  CreditCard,
  LayoutDashboard,
  Scissors,
  Settings,
  Shield,
  UserCog,
  Users,
  UsersRound,
} from "lucide-react";

export function hasPermission(
  userPermissions: string[],
  required: string,
): boolean {
  return userPermissions.includes(required);
}

export function hasAnyPermission(
  userPermissions: string[],
  required: string[],
): boolean {
  return required.some((permission) => userPermissions.includes(permission));
}

export interface MenuItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  permissions: string[];
}

/** Menú principal: visible si el usuario tiene al menos uno de los permisos listados. */
export const MENU_ITEMS: MenuItemConfig[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permissions: ["dashboard.read"],
  },
  {
    label: "Calendario",
    href: "/calendario",
    icon: CalendarDays,
    permissions: ["schedules.read", "reservations.read"],
  },
  {
    label: "Horarios",
    href: "/horarios",
    icon: Clock,
    permissions: ["schedules.read", "schedules.manage"],
  },
  {
    label: "Reservas",
    href: "/reservas",
    icon: ClipboardList,
    permissions: ["reservations.read"],
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users,
    permissions: ["customers.read", "customers.manage"],
  },
  {
    label: "Colaboradoras",
    href: "/colaboradoras",
    icon: UsersRound,
    permissions: ["employees.read", "employees.manage"],
  },
  {
    label: "Servicios",
    href: "/servicios",
    icon: Scissors,
    permissions: ["services.read", "services.manage"],
  },
  {
    label: "Locales",
    href: "/locales",
    icon: Building2,
    permissions: ["branches.read", "branches.manage"],
  },
  {
    label: "Pagos",
    href: "/pagos",
    icon: CreditCard,
    permissions: ["payments.read", "payments.create"],
  },
  {
    label: "Reportes",
    href: "/reportes",
    icon: BarChart3,
    permissions: ["reports.read"],
  },
  {
    label: "Usuarios",
    href: "/usuarios",
    icon: UserCog,
    permissions: ["users.manage"],
  },
  {
    label: "Roles",
    href: "/roles",
    icon: Shield,
    permissions: ["roles.manage"],
  },
  {
    label: "Configuración",
    href: "/configuracion",
    icon: Settings,
    permissions: ["branches.manage"],
  },
];

export function getVisibleMenuItems(
  userPermissions: string[],
): MenuItemConfig[] {
  return MENU_ITEMS.filter((item) =>
    hasAnyPermission(userPermissions, item.permissions),
  );
}
