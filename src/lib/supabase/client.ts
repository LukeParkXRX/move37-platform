import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db/types";

/**
 * 브라우저용 Supabase 클라이언트.
 * @supabase/ssr의 createBrowserClient는 동일 URL/Key 조합이면 내부적으로 싱글톤을 반환한다.
 * 모듈 레벨 캐시는 불필요(HMR·테스트 격리 이점 때문에 의도적으로 생략).
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // OAuth code exchange는 /auth/callback 라우트가 처리하므로 URL 자동 파싱 불필요
        detectSessionInUrl: false,
        // navigator.locks 기본값 사용 — SDK 자동 싱글톤이 멀티 인스턴스 경쟁을 구조적으로 차단
      },
    },
  );
}
