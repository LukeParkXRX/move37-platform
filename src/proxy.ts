import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * 로그인이 필요한 경로 prefix.
 * 새 공개 페이지는 수정 없이 자동 공개 — 보호가 필요한 prefix를 추가할 때만 업데이트.
 */
const PROTECTED_PREFIXES = [
  "/admin",
  "/bookings",
  "/matching",
  "/meeting",
  "/my",
  "/onboarding",
  "/org",
  "/projects",
  "/session",
  "/settings",
] as const;

/** 로그인 상태면 진입 금지 — 이미 로그인한 유저는 /my로 보냄. */
const AUTH_ROUTES = ["/login", "/signup"] as const;

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );
}

function isAuthRoute(pathname: string): boolean {
  return (AUTH_ROUTES as readonly string[]).includes(pathname);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 정적/에셋은 matcher에서 대부분 걸러지지만 안전망으로 한 번 더
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const { user, supabaseResponse } = await updateSession(request);

  // API는 middleware에서 리다이렉트하지 않고 각 route handler가 401 처리
  if (pathname.startsWith("/api/")) {
    return supabaseResponse;
  }

  // 로그인 유저가 로그인/가입 페이지 진입 → /my
  if (user && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/my", request.url));
  }

  // 비로그인 유저가 보호 경로 진입 → /login?redirect=...
  if (!user && isProtected(pathname)) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
