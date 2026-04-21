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
    {
      auth: {
        // 초기화 시 네트워크 refresh 호출 비활성화 (hang 방지)
        autoRefreshToken: true,
        // URL hash (#access_token=...) 자동 파싱 비활성화
        // - OAuth 는 우리 /auth/callback 이 처리하므로 불필요
        // - 이게 true면 getSession() 이 hang 하는 경우 있음
        detectSessionInUrl: false,
        persistSession: true,
        // navigator.locks API 기반 락 사용 해제 (orphaned lock 방지)
        // 여러 탭/컴포넌트 race 리스크는 있지만 hang 보다 낫다
        lock: async (_name, _acquireTimeout, fn) => fn(),
      },
    },
  );
  return browserClient;
}

// CookieOptions 재export (필요한 경우)
export type { CookieOptions };
