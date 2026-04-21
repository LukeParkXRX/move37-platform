"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearStaleSupabaseAuth } from "@/lib/supabase/stale-session";
import type { User } from "@supabase/supabase-js";
import type { DbUser } from "@/lib/db/types";

interface AuthState {
  user: User | null;
  profile: DbUser | null;
  loading: boolean;
}

// getSession() 이 stale refresh_token 으로 hang 하는 경우가 있어
// 짧은 타임아웃으로 감싼다. 타임아웃 시 브라우저 스토리지를 정리하여
// 다음 번 부팅에서 완전히 깨끗한 게스트 상태가 되도록 한다.
const SESSION_READ_TIMEOUT_MS = 1500;

async function getSessionWithTimeout(
  supabase: ReturnType<typeof createClient>,
): Promise<User | null> {
  const sessionPromise = supabase.auth.getSession().then((res) => {
    return res.data.session?.user ?? null;
  });

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
      try {
        const user = await getSessionWithTimeout(supabase);
        if (!mounted) return;

        if (!user) {
          // stale 토큰으로 인한 hang 이었다면 정리
          clearStaleSupabaseAuth();
          setState({ user: null, profile: null, loading: false });
          return;
        }

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
        console.warn("[useAuth] bootstrap failed:", err);
        if (mounted) {
          clearStaleSupabaseAuth();
          setState({ user: null, profile: null, loading: false });
        }
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
