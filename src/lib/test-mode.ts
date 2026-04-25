import { createServerSupabaseClient } from "./supabase/server";

/**
 * 공개 페이지에서 테스트 데이터를 노출할지 판정.
 * 조건: 환경변수 ON 또는 현재 사용자가 super_admin.
 */
export async function shouldShowTestData(): Promise<boolean> {
  if (process.env.NEXT_PUBLIC_SHOW_TEST_DATA === "true") return true;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const row = data as { role: string | null } | null;
  return row?.role === "super_admin";
}
