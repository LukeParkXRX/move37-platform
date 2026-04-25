import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { requireRole } from "@/lib/supabase/guards";

export default async function EnablerLayout({ children }: { children: ReactNode }) {
  await requireRole(["enabler", "super_admin"], "/enabler-dashboard");
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
