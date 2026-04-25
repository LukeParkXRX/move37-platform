import { cache } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./server";
import { ROLE_HOME } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/db/types";

/**
 * 서버 사이드 role 가드. 보호 라우트 그룹의 server layout에서 호출.
 * getUser()로 토큰 서명 검증까지 수행(session.user는 쿠키 기반이라 부적합).
 * React.cache로 동일 요청 중 중첩 호출 시 네트워크 1회로 축약.
 */
export const requireRole = cache(async function requireRole(
  allowedRoles: readonly UserRole[],
  fallbackRedirect: string,
): Promise<{ userId: string; role: UserRole }> {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(fallbackRedirect)}`);
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single<{ role: UserRole | null }>();

  if (!profile?.role) {
    redirect("/onboarding/role");
  }

  if (!allowedRoles.includes(profile.role)) {
    // 권한 부족 → 본인 역할의 home으로. 무한 리다이렉트 방지를 위해
    // 현재 home과 같으면 안전 fallback("/")으로.
    const home = ROLE_HOME[profile.role];
    redirect(home === fallbackRedirect ? "/" : home);
  }

  return { userId: user.id, role: profile.role };
});
