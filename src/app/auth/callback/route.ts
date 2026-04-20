import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextOverride = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth_missing_code`);
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  // Check if user profile exists in public.users
  const { data: profile } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", data.user.id)
    .single<{ id: string; role: string }>();

  // No profile → new user → onboarding
  if (!profile) {
    return NextResponse.redirect(`${origin}/onboarding/role`);
  }

  // Has profile → respect next param or role-based default
  if (nextOverride) {
    return NextResponse.redirect(`${origin}${nextOverride}`);
  }

  const roleDefaults: Record<string, string> = {
    startup: "/my",
    enabler: "/my",
    org_admin: "/org/dashboard",
    super_admin: "/admin",
  };
  const destination = roleDefaults[profile.role] ?? "/my";
  return NextResponse.redirect(`${origin}${destination}`);
}
