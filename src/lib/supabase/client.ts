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
        // navigator.locks no-op 유지.
        // 기본 lock 복원 시 React Strict Mode effect 이중 실행·HMR 리로드에서
        // orphan lock이 발생해 onAuthStateChange의 INITIAL_SESSION이 영구 지연되는 증상 재현됨.
        // 멀티탭 race 리스크는 SDK BroadcastChannel로 세션 동기화되므로 실사용상 영향 미미.
        // (이전 이력: c30900b 싱글톤 도입 → e302f78 no-op lock으로 최종 해결)
        lock: async (_name, _acquireTimeout, fn) => fn(),
      },
    },
  );
}
