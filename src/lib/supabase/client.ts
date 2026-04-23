import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/db/types";

/**
 * 브라우저용 Supabase 클라이언트 — 공식 @supabase/ssr 바닐라 설정.
 * 커스텀 auth 옵션 없음. 내부 싱글톤/락/세션 감지 전부 SDK 기본 동작에 위임.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
