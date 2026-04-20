import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/careers",
  "/cases",
  "/contact",
  "/credits",
  "/enabler-apply",
  "/enablers",
  "/faq",
  "/insights",
  "/login",
  "/signup",
  "/admin-login",
  "/organizations",
  "/program",
  "/terms",
  "/privacy",
  "/refund",
  "/forgot-password",
  "/unauthorized",
  "/verify-email",
  "/sitemap.xml",
  "/robots.txt",
];

const AUTH_ROUTES = ["/login", "/signup"];

function isPublicRoute(pathname: string): boolean {
  return (
    PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    ) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and API routes — skip
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const { user, supabaseResponse } = await updateSession(request);

  // Redirect logged-in users away from auth pages
  if (user && AUTH_ROUTES.some((r) => pathname === r)) {
    return NextResponse.redirect(new URL("/my", request.url));
  }

  // Public routes — allow all
  if (isPublicRoute(pathname)) {
    return supabaseResponse;
  }

  // Protected routes — require login
  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // For admin/org routes, we rely on page-level role checks
  // since middleware can't easily query the users table for role.
  // The pages themselves will check role and redirect if unauthorized.

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
