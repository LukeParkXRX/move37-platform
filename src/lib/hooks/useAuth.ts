"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { DbUser } from "@/lib/db/types";

interface AuthState {
  user: User | null;
  profile: DbUser | null;
  loading: boolean;
}

/**
 * 세션 상태 구독 훅.
 *
 * 공식 @supabase/ssr 패턴: onAuthStateChange 하나로 전체 생명주기 처리.
 * 구독 직후 INITIAL_SESSION 이벤트가 자동 발생하므로 별도 getSession 호출 불필요.
 * 이후 SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED 등 이벤트도 동일 핸들러로 흐름.
 *
 * 주의: session.user는 로컬 쿠키 기반이다. 서버 API에서 권한을 보호할 때는
 *       반드시 서버 측 `supabase.auth.getUser()` (토큰 서버 검증)을 함께 써야 한다.
 *       이 훅은 UI 표시용 신호에만 사용한다.
 */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      const user = session?.user ?? null;

      if (!user) {
        setState({ user: null, profile: null, loading: false });
        return;
      }

      // profile 조회 실패해도 user 상태는 유지 — DB 에러가 UI 로그인 상태를 뒤집지 않도록
      let profile: DbUser | null = null;
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single<DbUser>();
        profile = data ?? null;
      } catch (err) {
        console.warn("[useAuth] profile fetch failed:", err);
      }

      if (mounted) setState({ user, profile, loading: false });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
