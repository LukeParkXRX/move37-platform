import type { UserRole } from "@/lib/db/types";

export const ROLE_HOME: Record<UserRole, string> = {
  startup: "/my",
  enabler: "/enabler-dashboard",
  org_admin: "/org/dashboard",
  super_admin: "/admin/dashboard",
};

export function roleHome(role: UserRole): string {
  return ROLE_HOME[role];
}
