import { requireRole } from "@/lib/supabase/guards";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // super_admin 전용. 미인증·미온보딩·권한 부족은 guards가 리다이렉트.
  await requireRole(["super_admin"], "/admin/dashboard");
  return <AdminSidebar>{children}</AdminSidebar>;
}
