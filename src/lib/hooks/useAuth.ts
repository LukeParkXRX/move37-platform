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

// 안전장치용 타임아웃. 네트워크 hang 방지 목적만.
// 이 시간 안에 세션을 못 읽으면 일단 게스트로 렌더링 (쿠키는 지우지 않는다).
const SESSION_READ_TIMEOUT_MS = 4000;

async function readSession(
  supabase: ReturnType<typeof createClient>,
): Promise<User | null> {
  const sessionPromise = supabase.auth
    .getSession()
    .then((res) => res.data.session?.user ?? null);
  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), SESSION_READ_TIMEOUT_MS);
  });
  return Promise.race([sessionPromise, timeoutPromise]).catch(() => null);
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function bootstrap() {
      const user = await readSession(supabase);
      if (!mounted) return;

      if (!user) {
        setState({ user: null, profile: null, loading: false });
        return;
      }

      try {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (!mounted) return;
        setState({
          user,
          profile: (profile as DbUser | null) ?? null,
          loading: false,
        });
      } catch (err) {
        console.warn("[useAuth] profile fetch failed:", err);
        if (mounted) setState({ user, profile: null, loading: false });
      }
    }

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (!session?.user) {
        setState({ user: null, profile: null, loading: false });
        return;
      }
      try {
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (!mounted) return;
        setState({
          user: session.user,
          profile: (profile as DbUser | null) ?? null,
          loading: false,
        });
      } catch (err) {
        console.warn("[useAuth] onAuthStateChange profile fetch failed:", err);
        if (mounted) {
          setState({ user: session.user, profile: null, loading: false });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
