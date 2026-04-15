import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { DbStartupProfile, DbEnablerProfile, DbUser } from "@/lib/db/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile, error } = await db
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const typedProfile = profile as DbUser | null;

    // Fetch role-specific profile
    let roleProfile: DbStartupProfile | DbEnablerProfile | null = null;
    if (typedProfile?.role === "startup") {
      const { data } = await db.from("startup_profiles").select("*").eq("user_id", user.id).single();
      roleProfile = data as DbStartupProfile | null;
    } else if (typedProfile?.role === "enabler") {
      const { data } = await db.from("enabler_profiles").select("*").eq("user_id", user.id).single();
      roleProfile = data as DbEnablerProfile | null;
    }

    return NextResponse.json({ user: typedProfile, roleProfile });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabase as any;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json() as Partial<Pick<DbUser, "full_name" | "avatar_url">>;
    const { full_name, avatar_url } = body;

    const { data, error } = await db
      .from("users")
      .update({
        ...(full_name !== undefined && { full_name }),
        ...(avatar_url !== undefined && { avatar_url }),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ user: data as DbUser });
  } catch { return NextResponse.json({ error: "Internal server error" }, { status: 500 }); }
}
