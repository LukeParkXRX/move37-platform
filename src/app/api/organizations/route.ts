import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data, error } = await db
      .from("organizations")
      .select("id, name, slug, program_name, logo_url, total_credits")
      .order("name");

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ organizations: data });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json() as { invite_code?: string };
    const { invite_code } = body;

    if (!invite_code) {
      return NextResponse.json({ error: "Invite code required" }, { status: 400 });
    }

    const { data: orgs } = await db
      .from("organizations")
      .select("id")
      .eq("invite_code", invite_code)
      .limit(1);

    const orgId = (orgs as Array<{ id: string }> | null)?.[0]?.id ?? null;

    if (!orgId) {
      return NextResponse.json({ error: "유효하지 않은 초대 코드입니다" }, { status: 404 });
    }

    await db.from("users").update({ org_id: orgId }).eq("id", user.id);
    await db.from("startup_profiles").update({ org_id: orgId }).eq("user_id", user.id);

    return NextResponse.json({ organization_id: orgId });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
