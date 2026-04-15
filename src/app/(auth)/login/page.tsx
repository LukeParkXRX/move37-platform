"use client";

import { useState } from "react";
import Link from "next/link";
import { FieldLabel, FieldInput } from "@/components/ui";

type TabMode = "startup" | "enabler";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<TabMode>("startup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: 로그인 로직 연결
  }

  return (
    <>
      {/* 반응형: 모바일에서 왼쪽 패널 숨김 */}
      <style>{`
        @media (max-width: 767px) {
          .auth-left-panel { display: none !important; }
          .auth-outer { flex-direction: column !important; }
        }
      `}</style>

      <div
        className="auth-outer"
        style={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "var(--font-body)",
          backgroundColor: "var(--color-black)",
        }}
      >
        {/* ═══════════════════════════════════════════════════════════
            LEFT HALF — Editorial pull-quote panel
        ═══════════════════════════════════════════════════════════ */}
        <div
          className="auth-left-panel"
          style={{
            flex: 1,
            position: "relative",
            backgroundColor: "var(--color-dark)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "52px 56px 52px",
            overflow: "hidden",
          }}
        >
          {/* Grain texture overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Subtle gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 90% 70% at 35% 45%, oklch(0.2 0.008 280 / 0.6) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* Accent glow — bottom left */}
          <div
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "-60px",
              width: "320px",
              height: "320px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, oklch(0.91 0.2 110 / 0.06) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />

          {/* ── Top: Logo wordmark ── */}
          <div style={{ position: "relative", zIndex: 1, animation: "var(--animate-fade-in)" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--color-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: "oklch(0.1 0 0)" }}>
                  <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "15px",
                  color: "var(--color-text)",
                  letterSpacing: "-0.02em",
                }}
              >
                Move 37
              </span>
            </div>
          </div>

          {/* ── Center: Pull-quote ── */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              animation: "var(--animate-slide-up)",
              animationDelay: "0.1s",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "120px",
                lineHeight: 0.8,
                color: "oklch(0.91 0.2 110 / 0.12)",
                marginBottom: "8px",
                marginLeft: "-8px",
                userSelect: "none",
              }}
            >
              &ldquo;
            </div>

            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "28px",
                lineHeight: 1.35,
                color: "var(--color-text)",
                letterSpacing: "-0.025em",
                marginBottom: "20px",
              }}
            >
              Move 37은 단순한 멘토링이 아닙니다.
              <br />
              실제{" "}
              <span style={{ color: "var(--color-accent)", position: "relative", display: "inline-block" }}>
                실행
                <span
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    left: 0,
                    right: 0,
                    height: "2px",
                    backgroundColor: "var(--color-accent)",
                    borderRadius: "2px",
                    opacity: 0.5,
                  }}
                />
              </span>
              을 대신해주는
              <br />
              미국 현지 파트너입니다.
            </h2>

            <p
              style={{
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                color: "var(--color-dim)",
                lineHeight: 1.7,
                maxWidth: "360px",
              }}
            >
              탑-티어 MBA 학생과 직접 연결되어, 시장 조사부터 파트너십 체결까지
              현지에서 직접 실행합니다.
            </p>
          </div>

          {/* ── Bottom: Testimonial card ── */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              animation: "var(--animate-slide-up)",
              animationDelay: "0.2s",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "1px",
                backgroundColor: "oklch(0.91 0.2 110 / 0.4)",
                marginBottom: "20px",
              }}
            />

            <div
              style={{
                backgroundColor: "oklch(0.18 0.006 280 / 0.7)",
                border: "1px solid oklch(0.24 0.008 280 / 0.8)",
                borderRadius: "var(--radius-xl)",
                padding: "20px 22px",
                backdropFilter: "blur(8px)",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  color: "oklch(0.75 0.005 280)",
                  lineHeight: 1.65,
                  marginBottom: "16px",
                }}
              >
                "Move 37 덕분에 Wharton MBA 파트너와 3주 만에 파일럿 계약을 체결했습니다.
                혼자였다면 6개월은 걸렸을 일입니다."
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "12px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "oklch(0.1 0 0)",
                  }}
                >
                  김
                </div>

                <div>
                  <p style={{ fontSize: "13px", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--color-text)", lineHeight: 1.3 }}>
                    김재원
                  </p>
                  <p style={{ fontSize: "11px", fontFamily: "var(--font-body)", color: "var(--color-dim)", lineHeight: 1.3 }}>
                    CEO · Nexlayer AI
                  </p>
                </div>

                <div style={{ marginLeft: "auto", color: "var(--color-gold)", fontSize: "12px", letterSpacing: "1px" }}>
                  ★★★★★
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            RIGHT HALF — Login form panel
        ═══════════════════════════════════════════════════════════ */}
        <div
          style={{
            flex: 1,
            backgroundColor: "var(--color-card)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 56px",
            overflowY: "auto",
            position: "relative",
          }}
        >
          {/* Subtle top-right glow */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "radial-gradient(circle, oklch(0.65 0.15 250 / 0.05) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: "440px",
              width: "100%",
              margin: "0 auto",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* ── Logo ── */}
            <div style={{ marginBottom: "32px", animation: "var(--animate-fade-in)" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "var(--color-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ color: "oklch(0.1 0 0)" }}>
                    <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", color: "var(--color-text)", letterSpacing: "-0.02em" }}>
                  Move 37
                </span>
              </div>
            </div>

            {/* ── Heading ── */}
            <div style={{ marginBottom: "28px", animation: "var(--animate-slide-up)", animationDelay: "0.05s" }}>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "24px",
                  color: "var(--color-text)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.2,
                  marginBottom: "6px",
                }}
              >
                로그인
              </h1>
              <p style={{ fontSize: "14px", fontFamily: "var(--font-body)", color: "var(--color-dim)", lineHeight: 1.5 }}>
                계정에 로그인하세요.
              </p>
            </div>

            {/* ── Tab switcher ── */}
            <div
              style={{
                display: "flex",
                backgroundColor: "oklch(0.14 0.005 280 / 0.8)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                padding: "3px",
                marginBottom: "28px",
                animation: "var(--animate-slide-up)",
                animationDelay: "0.1s",
              }}
            >
              {(
                [
                  { key: "startup" as TabMode, label: "스타트업 / 기업" },
                  { key: "enabler" as TabMode, label: "Market Enabler" },
                ] as const
              ).map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      borderRadius: "var(--radius-md)",
                      fontSize: "13px",
                      fontFamily: "var(--font-display)",
                      fontWeight: active ? 700 : 500,
                      color: active ? "oklch(0.1 0 0)" : "var(--color-dim)",
                      backgroundColor: active ? "var(--color-accent)" : "transparent",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s var(--ease-out-expo)",
                      letterSpacing: active ? "-0.01em" : "0",
                      boxShadow: active ? "0 1px 6px oklch(0.91 0.2 110 / 0.25)" : "none",
                    }}
                  >
                    {tab.key === "startup" ? "🚀 " : "🇺🇸 "}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* ── Login form ── */}
            <form
              onSubmit={handleSubmit}
              style={{ animation: "var(--animate-slide-up)", animationDuration: "0.28s" }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "24px" }}>
                <div>
                  <FieldLabel>이메일</FieldLabel>
                  <FieldInput
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={setEmail}
                    required
                  />
                </div>
                <div>
                  <FieldLabel>비밀번호</FieldLabel>
                  <FieldInput
                    type="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={setPassword}
                    required
                  />
                </div>
              </div>

              {/* ── Submit button ── */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "13px 20px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: "var(--color-accent)",
                  color: "oklch(0.1 0 0)",
                  fontSize: "14px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  letterSpacing: "-0.01em",
                  transition: "opacity 0.15s ease, transform 0.15s ease",
                  boxShadow: "var(--shadow-accent)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                로그인
              </button>
            </form>

            {/* ── Divider ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
              <span style={{ fontSize: "11px", fontFamily: "var(--font-body)", color: "var(--color-dim)", letterSpacing: "0.06em", flexShrink: 0 }}>
                또는
              </span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-border)" }} />
            </div>

            {/* ── Google login button ── */}
            <button
              type="button"
              style={{
                width: "100%",
                padding: "11px 20px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "transparent",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                fontSize: "14px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                transition: "border-color 0.15s ease, background-color 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "oklch(0.4 0.008 280)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "oklch(0.14 0.005 280 / 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--color-border)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google로 계속하기
            </button>

            {/* ── Bottom link ── */}
            <p
              style={{
                textAlign: "center",
                marginTop: "24px",
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                color: "var(--color-dim)",
              }}
            >
              계정이 없으신가요?{" "}
              <Link
                href="/signup"
                style={{
                  color: "var(--color-accent)",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "0.75")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = "1")}
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
