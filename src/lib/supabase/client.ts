import { createBrowserClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/lib/db/types";
import type { SupabaseClient } from "@supabase/supabase-js";

// 🔑 Singleton browser client.
// 매번 new 인스턴스 생성하면 @supabase/gotrue-js 의 auth-token lock 이 경쟁하여
// "Lock not released within 5000ms" 에러 + 세션 읽기 실패.
// 전체 앱에서 동일 인스턴스 사용하도록 모듈 레벨 캐시.
let browserClient: SupabaseClient<Database> | undefined;

export function createClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  return browserClient;
}

// CookieOptions 재export (필요한 경우)
export type { CookieOptions };
