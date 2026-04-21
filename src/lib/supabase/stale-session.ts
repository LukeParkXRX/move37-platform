// 브라우저에 남은 stale Supabase 인증 데이터를 완전히 정리
// - localStorage의 sb-* 키 삭제
// - document.cookie에서 sb-* 쿠키 삭제 (path=/)
// 서버사이드에서 import 돼도 안전하도록 typeof window 가드
export function clearStaleSupabaseAuth() {
  if (typeof window === "undefined") return;

  try {
    const ls = window.localStorage;
    const keysToRemove: string[] = [];
    for (let i = 0; i < ls.length; i++) {
      const key = ls.key(i);
      if (!key) continue;
      if (key.startsWith("sb-") || key.includes("supabase")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => ls.removeItem(k));
  } catch {
    // 프라이빗 브라우징 등 localStorage 접근 불가 시 무시
  }

  try {
    const cookies = document.cookie.split(";");
    const host = window.location.hostname;
    for (const raw of cookies) {
      const name = raw.split("=")[0]?.trim();
      if (!name) continue;
      if (!name.startsWith("sb-")) continue;
      // 가능한 모든 domain/path 조합으로 만료
      const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = `${name}=; ${expire}; path=/`;
      document.cookie = `${name}=; ${expire}; path=/; domain=${host}`;
      document.cookie = `${name}=; ${expire}; path=/; domain=.${host}`;
    }
  } catch {
    // 쿠키 접근 실패 시 무시
  }
}
