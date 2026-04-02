"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Enabler 찾기", href: "/enablers" },
  { label: "프로젝트 등록", href: "/projects/new" },
  { label: "화상채팅", href: "/meeting" },
  { label: "인사이트", href: "/insights" },
  { label: "기업 서비스", href: "/organizations" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 모바일 메뉴 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          height: "56px",
          backgroundColor: scrolled
            ? "oklch(0.1 0 0 / 0.92)"
            : "oklch(0.1 0 0 / 0.6)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto h-full px-5 flex items-center justify-between gap-6">

          {/* 로고 */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="Move 37 홈"
          >
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition-transform duration-200 group-hover:scale-105"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "oklch(0.1 0 0)",
                fontFamily: "var(--font-display)",
              }}
            >
              M
            </span>
            <span
              className="text-[16px] font-bold tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-text)",
              }}
            >
              Move 37
            </span>
          </Link>

          {/* 센터 네비 — 데스크탑 */}
          <nav className="hidden md:flex items-center gap-1" aria-label="주요 메뉴">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 text-[15px] rounded-md transition-colors duration-150"
                style={{
                  color: "var(--color-dim)",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-text)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "var(--color-card)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "var(--color-dim)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 — 데스크탑 */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="px-4 py-1.5 text-[15px] rounded-md border transition-colors duration-150"
              style={{
                color: "var(--color-dim)",
                borderColor: "var(--color-border)",
                backgroundColor: "transparent",
                fontFamily: "var(--font-body)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-text)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--color-dim)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color =
                  "var(--color-dim)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor =
                  "var(--color-border)";
              }}
            >
              로그인
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 text-[15px] rounded-md font-bold transition-all duration-150"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "oklch(0.1 0 0)",
                fontFamily: "var(--font-display)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
              }}
            >
              시작하기
            </Link>
          </div>

          {/* 햄버거 — 모바일 */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-md transition-colors duration-150"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={menuOpen}
            style={{ backgroundColor: menuOpen ? "var(--color-card)" : "transparent" }}
          >
            <span
              className="block h-[1.5px] w-5 rounded-full transition-all duration-300 origin-center"
              style={{
                backgroundColor: "var(--color-text)",
                transform: menuOpen
                  ? "translateY(6.5px) rotate(45deg)"
                  : "none",
              }}
            />
            <span
              className="block h-[1.5px] w-5 rounded-full transition-all duration-200"
              style={{
                backgroundColor: "var(--color-text)",
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block h-[1.5px] w-5 rounded-full transition-all duration-300 origin-center"
              style={{
                backgroundColor: "var(--color-text)",
                transform: menuOpen
                  ? "translateY(-6.5px) rotate(-45deg)"
                  : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* 모바일 드로어 */}
      <div
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          pointerEvents: menuOpen ? "auto" : "none",
          opacity: menuOpen ? 1 : 0,
        }}
        aria-hidden={!menuOpen}
      >
        {/* 딤 오버레이 */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "oklch(0 0 0 / 0.6)" }}
          onClick={() => setMenuOpen(false)}
        />

        {/* 드로어 패널 */}
        <nav
          className="absolute top-[56px] left-0 right-0 flex flex-col p-4 gap-1 transition-transform duration-300"
          style={{
            backgroundColor: "var(--color-dark)",
            borderBottom: "1px solid var(--color-border)",
            transform: menuOpen ? "translateY(0)" : "translateY(-8px)",
          }}
          aria-label="모바일 메뉴"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-sm rounded-md transition-colors duration-150"
              style={{
                color: "var(--color-dim)",
                fontFamily: "var(--font-body)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="h-px my-2"
            style={{ backgroundColor: "var(--color-border)" }}
          />

          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 text-sm rounded-md border transition-colors duration-150"
            style={{
              color: "var(--color-dim)",
              borderColor: "var(--color-border)",
              fontFamily: "var(--font-body)",
            }}
          >
            로그인
          </Link>
          <Link
            href="/signup"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 text-sm rounded-md font-bold text-center mt-1"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "oklch(0.1 0 0)",
              fontFamily: "var(--font-display)",
            }}
          >
            시작하기
          </Link>
        </nav>
      </div>

      {/* 56px 상단 여백 보정용 placeholder — 필요한 페이지에서 사용 */}
      {/* <div style={{ height: "56px" }} /> */}
    </>
  );
}
