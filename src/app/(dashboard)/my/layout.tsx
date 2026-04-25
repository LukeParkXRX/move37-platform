import type { ReactNode } from "react";
import { requireRole } from "@/lib/supabase/guards";

export default async function MyDashboardLayout({ children }: { children: ReactNode }) {
  // /my 는 Startup 전용 대시보드. enabler/org_admin은 본인 home으로 redirect됨.
  await requireRole(["startup", "super_admin"], "/my");
  return <>{children}</>;
}
