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

    // onAuthStateChange 콜백은 SDK 내부 lock 안에서 실행 — 콜백 body에서 같은 client의
    // await 호출은 재귀 lock 획득 시도로 deadlock. 비동기 작업은 queueMicrotask로 분리.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      const user = session?.user ?? null;
      setState((s) => ({ ...s, user, loading: false }));

      if (!user) {
        setState((s) => ({ ...s, profile: null }));
        return;
      }

      // profile은 세션이 새로 들어올 때만 조회. TOKEN_REFRESHED에서 재조회하면
      // 장시간 열어둔 탭에서 1시간마다 불필요한 쿼리가 발생.
      if (event !== "INITIAL_SESSION" && event !== "SIGNED_IN" && event !== "USER_UPDATED") {
        return;
      }

      queueMicrotask(async () => {
        if (!mounted) return;
        try {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single<DbUser>();
          if (mounted) setState((s) => ({ ...s, profile: data ?? null }));
        } catch (err) {
          console.warn("[useAuth] profile fetch failed:", err);
        }
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
