import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "./server";
import type { UserRole } from "@/lib/db/types";

/**
 * 서버 사이드 role 가드.
 *
 * 보호된 라우트 그룹의 server layout에서 호출하여 인가되지 않은 접근을 차단한다.
 * 클라이언트 가드(useAuth 기반)만으로는 SSR 응답에 보호 콘텐츠가 잠시 노출될 수 있고
 * JS 비활성 환경에서는 아예 뚫리므로 서버에서 반드시 한 번 더 확인한다.
 *
 * 분기:
 *  - 미인증       → /login?redirect=<fallbackRedirect>
 *  - role NULL    → /onboarding/role (온보딩 미완료)
 *  - 다른 role    → /my (권한 없음 → 본인 대시보드로 안전 복귀)
 *  - 허용된 role  → { userId, role } 반환, 레이아웃 렌더 진행
 *
 * 공식 권장: session.user가 아닌 getUser()를 쓴다. getUser()는 Supabase 서버에
 * 토큰을 제출해 서명 검증을 거치므로 신뢰 가능.
 */
export async function requireRole(
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
    redirect("/my");
  }

  return { userId: user.id, role: profile.role };
}
