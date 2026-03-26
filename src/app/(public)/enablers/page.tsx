"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ENABLERS } from "@/lib/constants/mock-data";
import type { EnablerBadge } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterCategory =
  | "전체"
  | "B2B SaaS"
  | "Fintech"
  | "AI/DeepTech"
  | "E-commerce"
  | "Healthcare";

// ─── Badge Config ─────────────────────────────────────────────────────────────

const BADGE_CONFIG: Record<
  EnablerBadge,
  { label: string; color: string; bg: string; dot: string }
> = {
  top_rated: {
    label: "Top Rated",
    color: "var(--color-accent)",
    bg: "var(--color-accent-dim)",
    dot: "var(--color-accent)",
  },
  verified: {
    label: "Verified",
    color: "var(--color-blue)",
    bg: "var(--color-blue-dim)",
    dot: "var(--color-blue)",
  },
  rising_star: {
    label: "Rising Star",
    color: "var(--color-amber)",
    bg: "oklch(0.78 0.15 75 / 0.1)",
    dot: "var(--color-amber)",
  },
};

const FILTER_CATEGORIES: FilterCategory[] = [
  "전체",
  "B2B SaaS",
  "Fintech",
  "AI/DeepTech",
  "E-commerce",
  "Healthcare",
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const partial = !filled && rating > star - 1;
        return (
          <svg
            key={star}
            width="18"
            height="18"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.51L6 8.885L2.91 10.51L3.5 7.07L1 4.635L4.455 4.13L6 1Z"
              fill={
                filled
                  ? "var(--color-accent)"
                  : partial
                  ? "url(#half)"
                  : "var(--color-border)"
              }
              stroke="none"
            />
          </svg>
        );
      })}
    </div>
  );
}

// ─── Enabler Card ─────────────────────────────────────────────────────────────

type EnablerData = (typeof ENABLERS)[number];

function EnablerCard({
  enabler,
  index,
}: {
  enabler: EnablerData;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const badge = BADGE_CONFIG[enabler.badgeLevel];

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "var(--color-card)",
        border: `1px solid ${hovered ? "var(--color-accent)" : "var(--color-border)"}`,
        boxShadow: hovered
          ? "0 8px 32px oklch(0.91 0.2 110 / 0.08)"
          : "0 2px 8px oklch(0 0 0 / 0.2)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="p-6 flex flex-col gap-5 flex-1">
        {/* Header: Avatar + Name + Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={enabler.avatarUrl}
                alt={enabler.fullName}
                width={120}
                height={120}
                className="rounded-full object-cover"
                style={{
                  width: "120px",
                  height: "120px",
                  border: "2px solid var(--color-border)",
                }}
              />
              {/* Online dot */}
              <span
                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                style={{
                  backgroundColor: "var(--color-green)",
                  borderColor: "var(--color-card)",
                }}
              />
            </div>

            {/* Name + University */}
            <div>
              <h3
                className="font-bold text-[17px] leading-tight"
                style={{
                  color: "var(--color-text)",
                  fontFamily: "var(--font-display)",
                }}
              >
                {enabler.fullName}
              </h3>
              <p
                className="text-[13px] mt-0.5 leading-snug"
                style={{ color: "var(--color-dim)" }}
              >
                {enabler.university} · {enabler.degreeType}
              </p>
              <p
                className="text-[13px] mt-0.5"
                style={{ color: "var(--color-dim)" }}
              >
                {enabler.location}
              </p>
            </div>
          </div>

          {/* Badge */}
          <span
            className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide"
            style={{
              color: badge.color,
              backgroundColor: badge.bg,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: badge.dot }}
            />
            {badge.label}
          </span>
        </div>

        {/* Bio */}
        <p
          className="text-[14px] leading-relaxed"
          style={{
            color: "var(--color-dim)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {enabler.bio}
        </p>

        {/* Specialty Tags */}
        <div className="flex flex-wrap gap-1.5">
          {enabler.specialties.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-[12px] font-medium"
              style={{
                backgroundColor: "oklch(0.22 0.006 280)",
                color: "var(--color-dim)",
                border: "1px solid var(--color-border)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div
          className="h-px"
          style={{ backgroundColor: "var(--color-border)" }}
        />

        {/* Footer: Rating + Rate + CTA */}
        <div className="flex items-center justify-between gap-3">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <StarRating rating={enabler.rating} />
            <span
              className="text-lg font-bold"
              style={{ color: "var(--color-text)", fontFamily: "var(--font-display)" }}
            >
              {enabler.rating.toFixed(1)}
            </span>
            <span className="text-[15px]" style={{ color: "var(--color-dim)" }}>
              ({enabler.sessionCount}회)
            </span>
          </div>

          {/* Credit rate */}
          <div className="flex items-center gap-1">
            <span
              className="text-xl font-bold"
              style={{
                color: "var(--color-accent)",
                fontFamily: "var(--font-display)",
              }}
            >
              {enabler.creditRate}
            </span>
            <span className="text-[15px]" style={{ color: "var(--color-dim)" }}>
              크레딧/세션
            </span>
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div
        className="px-6 pb-5"
      >
        <Link
          href={`/enablers/${enabler.userId}`}
          className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
          style={{
            backgroundColor: hovered
              ? "var(--color-accent)"
              : "oklch(0.22 0.006 280)",
            color: hovered ? "oklch(0.1 0 0)" : "var(--color-dim)",
            border: `1px solid ${hovered ? "var(--color-accent)" : "var(--color-border)"}`,
            fontFamily: "var(--font-display)",
          }}
        >
          프로필 보기
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="ml-1.5 transition-transform duration-200"
            style={{ transform: hovered ? "translateX(2px)" : "translateX(0)" }}
          >
            <path
              d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EnablersPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("전체");

  const filtered = useMemo(() => {
    return ENABLERS.filter((e) => {
      // Filter by category pill
      const matchesFilter =
        activeFilter === "전체" ||
        e.specialties.some((s) =>
          s.toLowerCase().includes(activeFilter.toLowerCase())
        ) ||
        (activeFilter === "B2B SaaS" && e.specialties.some(s => s.includes("SaaS")));

      // Filter by search query
      const q = query.toLowerCase().trim();
      const matchesQuery =
        !q ||
        e.fullName.toLowerCase().includes(q) ||
        e.university.toLowerCase().includes(q) ||
        e.specialties.some((s) => s.toLowerCase().includes(q)) ||
        e.location.toLowerCase().includes(q);

      return matchesFilter && matchesQuery;
    });
  }, [query, activeFilter]);

  return (
    <div
      style={{ minHeight: "100vh", backgroundColor: "var(--color-black)" }}
    >
      <Navbar />

      <main>
        {/* ── Hero Section ──────────────────────────────────────────── */}
        <section
          className="relative pt-28 pb-16 px-5 overflow-hidden"
          style={{}}
        >
          {/* Background radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 40% at 50% 0%, oklch(0.91 0.2 110 / 0.05) 0%, transparent 70%)",
            }}
          />

          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.015]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div
            className="relative"
            style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}
          >
            {/* Accent label */}
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
              style={{
                backgroundColor: "var(--color-accent-dim)",
                color: "var(--color-accent)",
                border: "1px solid oklch(0.91 0.2 110 / 0.2)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
              MARKET ENABLERS
            </div>

            {/* Heading */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                fontSize: "clamp(40px, 5vw, 56px)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "var(--color-text)",
                wordBreak: "keep-all",
                marginBottom: "20px",
                width: "100%",
              }}
            >
              미국 현지에서
              <br />
              직접 뛰는 전문가들
            </h1>

            {/* Subtitle */}
            <p
              style={{
                color: "var(--color-dim)",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: 1.7,
                maxWidth: "560px",
                margin: "0 auto 40px auto",
                wordBreak: "keep-all",
              }}
            >
              Stanford, Wharton, HBS 출신의 검증된 MBA Enabler가
              <br className="hidden sm:block" />
              여러분의 미국 시장 진출을 직접 돕습니다.
            </p>

            {/* Search Bar */}
            <div
              style={{
                position: "relative",
                maxWidth: "640px",
                margin: "0 auto 24px auto",
                width: "100%",
              }}
            >
              {/* Search icon */}
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--color-dim)" }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="5.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12.5 12.5L16 16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="전문 분야, 학교, 이름으로 검색..."
                className="w-full pl-11 pr-5 py-3.5 rounded-xl text-sm transition-all duration-200 outline-none"
                style={{
                  backgroundColor: "var(--color-dark)",
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border)",
                  fontFamily: "var(--font-body)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-accent)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px oklch(0.91 0.2 110 / 0.08)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              {/* Clear button */}
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full transition-colors duration-150"
                  style={{
                    backgroundColor: "var(--color-border)",
                    color: "var(--color-dim)",
                  }}
                  aria-label="검색어 지우기"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 2L8 8M8 2L2 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                maxWidth: "640px",
                margin: "0 auto",
              }}
            >
              {FILTER_CATEGORIES.map((cat) => {
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                    style={{
                      backgroundColor: isActive
                        ? "var(--color-accent)"
                        : "var(--color-dark)",
                      color: isActive ? "oklch(0.1 0 0)" : "var(--color-dim)",
                      border: `1px solid ${isActive ? "var(--color-accent)" : "var(--color-border)"}`,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Stats Bar ─────────────────────────────────────────────── */}
        <section
          className="px-5 mb-12"
          style={{}}
        >
          <div
            className="rounded-2xl"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "16px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px",
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
            }}
          >
            {[
              { value: "6명", label: "검증된 Enabler" },
              { value: "156+", label: "완료된 세션" },
              { value: "4.8", label: "평균 평점" },
              { value: "73%", label: "재요청률" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <span
                  className="text-3xl font-black"
                  style={{
                    color: "var(--color-accent)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "-0.02em",
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
        </section>

        {/* ── Enabler Grid ──────────────────────────────────────────── */}
        <section style={{ padding: "0 20px 80px 20px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 4px" }}>
            {/* Result count */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
              <p className="text-sm" style={{ color: "var(--color-dim)" }}>
                <span
                  className="font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {filtered.length}명
                </span>
                의 Enabler를 찾았습니다
              </p>
              {(query || activeFilter !== "전체") && (
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveFilter("전체");
                  }}
                  className="text-xs transition-colors duration-150"
                  style={{ color: "var(--color-dim)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--color-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--color-dim)";
                  }}
                >
                  필터 초기화
                </button>
              )}
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                  gap: "24px",
                }}
              >
                {filtered.map((enabler, i) => (
                  <EnablerCard key={enabler.userId} enabler={enabler} index={i} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div
                className="flex flex-col items-center justify-center py-24 rounded-2xl"
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--color-dark)" }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ color: "var(--color-dim)" }}
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M16.5 16.5L21 21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M8.5 11H13.5M11 8.5V13.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p
                  className="font-bold mb-1"
                  style={{
                    color: "var(--color-text)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  검색 결과가 없습니다
                </p>
                <p className="text-sm" style={{ color: "var(--color-dim)" }}>
                  다른 키워드나 필터를 시도해보세요
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setActiveFilter("전체");
                  }}
                  className="mt-5 px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                  style={{
                    backgroundColor: "var(--color-dark)",
                    color: "var(--color-dim)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  전체 보기
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────────── */}
        <section style={{ padding: "0 20px 80px 20px" }}>
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "56px 32px",
              textAlign: "center",
              backgroundColor: "var(--color-dark)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 100%, oklch(0.91 0.2 110 / 0.07) 0%, transparent 70%)",
              }}
            />

            <div className="relative w-full">
              <p
                className="w-full text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: "var(--color-accent)" }}
              >
                기업 파트너 전용
              </p>
              <h2
                style={{
                  width: "100%",
                  fontSize: "clamp(24px, 3vw, 32px)",
                  fontWeight: 700,
                  marginBottom: "16px",
                  letterSpacing: "-0.02em",
                  color: "var(--color-text)",
                  fontFamily: "var(--font-display)",
                }}
              >
                소속 스타트업 전체에
                <br />
                크레딧을 일괄 지급하세요
              </h2>
              <p
                style={{
                  width: "100%",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  marginBottom: "32px",
                  maxWidth: "480px",
                  margin: "0 auto 32px auto",
                  color: "var(--color-dim)",
                }}
              >
                액셀러레이터, VC, 기업벤처캐피털을 위한 전용 플랫폼.
                포트폴리오 전체에 Move 37 Enabler 네트워크를 제공하세요.
              </p>
              <Link
                href="/organizations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200"
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
                기업 서비스 알아보기
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
