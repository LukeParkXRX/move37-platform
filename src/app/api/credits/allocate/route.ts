import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { UserRole } from "@/lib/db/types";

interface ProfileRow {
  role: UserRole;
  org_id: string | null;
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile } = await (supabase as any)
      .from("users")
      .select("role, org_id")
      .eq("id", user.id)
      .single() as { data: ProfileRow | null };

    if (!profile || !["super_admin", "org_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { org_id, startup_id, amount, description } = body;

    if (!org_id || !startup_id || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    // Org admins can only allocate from their own org
    if (profile.role === "org_admin" && profile.org_id !== org_id) {
      return NextResponse.json({ error: "Cannot allocate from another organization" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("allocate_credits_to_startup", {
      p_org_id: org_id,
      p_startup_id: startup_id,
      p_amount: amount,
      p_description: description || "크레딧 배분",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ transaction: data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
