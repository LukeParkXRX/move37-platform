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

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    // Safety net: release loading state after 3s even if Supabase hangs
    const timeoutId = setTimeout(() => {
      if (mounted) {
        console.warn("[useAuth] timeout — proceeding as guest");
        setState((prev) => (prev.loading ? { ...prev, loading: false } : prev));
      }
    }, 3000);

    async function getUser() {
      try {
        // Use getSession (reads from cookies, fast) before getUser (validates with server)
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user ?? null;

        if (!mounted) return;

        if (user) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();
          if (!mounted) return;
          setState({ user, profile: profile as DbUser | null, loading: false });
        } else {
          setState({ user: null, profile: null, loading: false });
        }
      } catch (err) {
        console.error("[useAuth] getSession failed:", err);
        if (mounted) setState({ user: null, profile: null, loading: false });
      } finally {
        clearTimeout(timeoutId);
      }
    }

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (!mounted) return;
        if (session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();
          if (!mounted) return;
          setState({
            user: session.user,
            profile: profile as DbUser | null,
            loading: false,
          });
        } else {
          setState({ user: null, profile: null, loading: false });
        }
      } catch (err) {
        console.error("[useAuth] onAuthStateChange failed:", err);
        if (mounted) setState({ user: null, profile: null, loading: false });
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
