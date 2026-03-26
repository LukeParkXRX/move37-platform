"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroEnablerStack from "@/components/landing/HeroEnablerStack";
import EnablerCard from "@/components/enabler/EnablerCard";
import { ENABLERS } from "@/lib/constants/mock-data";

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default function LandingPage() {
  const featuredEnablers = ENABLERS.slice(0, 3);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-black)" }}>
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden"
        style={{ backgroundColor: "var(--color-black)" }}
      >
        {/* Background radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 0%, oklch(0.91 0.2 110 / 0.06) 0%, transparent 70%)",
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.24 0.008 280 / 0.25) 1px, transparent 1px), linear-gradient(90deg, oklch(0.24 0.008 280 / 0.25) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.35,
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
              gap: "64px",
              alignItems: "center",
            }}
          >

            {/* LEFT: Copy */}
            <div className="flex flex-col gap-8">

              {/* Animated badge */}
              <div
                className="flex items-center gap-2 w-fit"
              >
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }}
                />
                <span
                  className="text-xs font-bold uppercase"
                  style={{
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.12em",
                  }}
                >
                  US Market Entry Platform
                </span>
              </div>

              {/* Headline */}
              <div>
                <h1
                  className="leading-[1.08] tracking-tight"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 900,
                    fontSize: "clamp(40px, 5.5vw, 58px)",
                    color: "var(--color-text)",
                  }}
                >
                  당신의 스타트업에
                  <br />
                  <span style={{ color: "var(--color-accent)" }}>결정적 한 수</span>를
                </h1>
              </div>

              {/* Subheading */}
              <p
                className="leading-relaxed"
                style={{
                  fontSize: "19px",
                  color: "var(--color-dim)",
                  maxWidth: "460px",
                }}
              >
                검증된 미국 MBA 출신 Market Enabler와 직접 연결됩니다.
                <br />
                GTM 전략, IR, 파트너십 — 실행 중심으로 함께합니다.
              </p>

              {/* CTA buttons */}
              <div
                className="flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/enablers"
                  className="landing-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "oklch(0.1 0 0)",
                    fontFamily: "var(--font-display)",
                    boxShadow: "var(--shadow-accent)",
                  }}
                >
                  Enabler 찾기
                  <span style={{ fontSize: "16px" }}>→</span>
                </Link>
                <Link
                  href="/program"
                  className="landing-btn-ghost inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-text)",
                    backgroundColor: "transparent",
                  }}
                >
                  프로그램 문의
                </Link>
              </div>

              {/* Stats row */}
              <div
                className="flex items-center gap-8 pt-4"
                style={{
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                {[
                  { value: "87+", label: "Sessions" },
                  { value: "4.8", label: "Rating" },
                  { value: "78%", label: "Re-request" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-0.5">
                    <span
                      className="text-4xl font-black leading-none"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "var(--color-text)",
                      }}
                    >
                      {stat.value}
                    </span>
                    <span className="text-[15px]" style={{ color: "var(--color-dim)" }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Floating card stack (client island) */}
            <div>
              <HeroEnablerStack />
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BANNER ──────────────────────────────────────────────────── */}
      <section
        className="py-5"
        style={{
          backgroundColor: "oklch(0.91 0.2 110 / 0.05)",
          borderTop: "1px solid oklch(0.91 0.2 110 / 0.15)",
          borderBottom: "1px solid oklch(0.91 0.2 110 / 0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              columnGap: "40px",
              rowGap: "16px",
            }}
          >
            {[
              { value: "24+", label: "기관 파트너" },
              { value: "50+", label: "Enablers" },
              { value: "312", label: "세션 완료" },
              { value: "4.7", label: "평균 만족도" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span
                  className="text-4xl font-black"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--color-accent)",
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-[17px]" style={{ color: "var(--color-dim)" }}>
                  {stat.label}
                </span>
                {i < 3 && (
                  <span
                    className="hidden sm:block w-px h-4 ml-1"
                    style={{ backgroundColor: "oklch(0.91 0.2 110 / 0.2)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 20% 80%, oklch(0.65 0.15 250 / 0.06) 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section heading */}
          <div className="text-center mb-20">
            <span
              className="text-xs font-bold uppercase"
              style={{ color: "var(--color-accent)", letterSpacing: "0.12em" }}
            >
              How It Works
            </span>
            <h2
              className="mt-3 text-4xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
            >
              4단계로 미국 시장이 열립니다
            </h2>
          </div>

          {/* Steps grid */}
          <div
            className="relative"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "20px",
            }}
          >
            {/* Connector line — desktop */}
            <div
              className="absolute top-9 left-[13%] right-[13%] hidden lg:block"
              style={{
                height: "1px",
                backgroundImage:
                  "repeating-linear-gradient(90deg, var(--color-border) 0, var(--color-border) 5px, transparent 5px, transparent 13px)",
              }}
            />

            {[
              {
                num: "01",
                title: "검색",
                desc: "전공·경력·지역으로 필터링해 나에게 맞는 Enabler를 찾습니다.",
              },
              {
                num: "02",
                title: "무료 상담",
                desc: "15분 Chemistry Call로 핏을 먼저 확인합니다. 크레딧 차감 없음.",
              },
              {
                num: "03",
                title: "크레딧 결제",
                desc: "세션 유형에 맞는 크레딧을 선택하고 일정을 확정합니다.",
              },
              {
                num: "04",
                title: "실행",
                desc: "Enabler와 함께 GTM, IR, 파트너십 전략을 실행에 옮깁니다.",
              },
            ].map((step, i) => (
              <div
                key={step.num}
                className="relative flex flex-col gap-5 p-6 rounded-2xl"
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {/* Ghost step number */}
                <div
                  className="text-5xl font-black leading-none select-none"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "oklch(0.91 0.2 110 / 0.16)",
                    letterSpacing: "-0.04em",
                  }}
                >
                  {step.num}
                </div>

                {/* Accent marker */}
                <div
                  className="w-2 h-2 rounded-full -mt-2"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />

                <div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-dim)" }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ENABLERS ─────────────────────────────────────────────── */}
      <section
        className="py-28"
        style={{
          backgroundColor: "var(--color-dark)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "48px",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <span
                className="text-xs font-bold uppercase"
                style={{ color: "var(--color-accent)", letterSpacing: "0.12em" }}
              >
                Featured Enablers
              </span>
              <h2
                className="mt-3 text-4xl font-black tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
              >
                검증된 Enabler를
                <br />
                지금 만나보세요
              </h2>
            </div>
            <Link
              href="/enablers"
              className="landing-link-underline flex items-center gap-1.5 text-sm font-semibold pb-1"
              style={{
                color: "var(--color-dim)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              전체 보기 →
            </Link>
          </div>

          {/* Enabler card grid — client islands */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {featuredEnablers.map((enabler, i) => (
              <EnablerCard
                key={enabler.userId}
                enabler={enabler}
                delay={0.08 + i * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section className="relative py-36 overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 80% at 50% 50%, oklch(0.91 0.2 110 / 0.07) 0%, transparent 70%)",
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.24 0.008 280 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.24 0.008 280 / 0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.2,
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "768px",
            margin: "0 auto",
            padding: "0 24px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--color-accent)",
              letterSpacing: "0.12em",
              marginBottom: "16px",
            }}
          >
            Get Started
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(36px, 4.5vw, 52px)",
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              wordBreak: "keep-all",
            }}
          >
            다음 결정적 한 수,
            <br />
            <span style={{ color: "var(--color-accent)" }}>지금 시작하세요</span>
          </h2>
          <p
            style={{
              marginTop: "20px",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "var(--color-dim)",
              maxWidth: "400px",
              marginLeft: "auto",
              marginRight: "auto",
              wordBreak: "keep-all",
            }}
          >
            무료 Chemistry Call로 나에게 맞는 Enabler를 먼저 만나보세요.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginTop: "40px",
            }}
          >
            <Link
              href="/enablers"
              className="landing-btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "14px",
                backgroundColor: "var(--color-accent)",
                color: "oklch(0.1 0 0)",
                fontFamily: "var(--font-display)",
                boxShadow: "var(--shadow-accent)",
                textDecoration: "none",
              }}
            >
              Enabler 찾기
              <span style={{ fontSize: "16px" }}>→</span>
            </Link>
            <Link
              href="/program"
              className="landing-btn-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "14px",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                backgroundColor: "transparent",
                textDecoration: "none",
              }}
            >
              기업 프로그램 문의
            </Link>
          </div>

          <p
            style={{
              marginTop: "40px",
              fontSize: "12px",
              color: "var(--color-dim)",
            }}
          >
            Chemistry Call 무료 · 계약 없음 · 언제든 취소 가능
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
