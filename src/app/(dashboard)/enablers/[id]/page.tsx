"use client";

import { useState, use } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { ENABLERS, REVIEWS, INSIGHTS } from "@/lib/constants/mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

type SessionType = "chemistry" | "standard" | "project";

// ── Constants ─────────────────────────────────────────────────────────────────

const SESSION_OPTIONS: {
  id: SessionType;
  icon: string;
  label: string;
  sublabel: string;
  credits: string;
  duration: string;
}[] = [
  {
    id: "chemistry",
    icon: "⚡",
    label: "Chemistry Call",
    sublabel: "첫 만남 / 무료",
    credits: "Free",
    duration: "15분",
  },
  {
    id: "standard",
    icon: "📋",
    label: "Standard Session",
    sublabel: "심화 상담",
    credits: "2 Credits",
    duration: "60분",
  },
  {
    id: "project",
    icon: "🎯",
    label: "Project Consultation",
    sublabel: "프로젝트 단위",
    credits: "Custom",
    duration: "협의",
  },
];

const TIME_SLOTS = [
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "01:00 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "03:00 PM", available: false },
  { time: "04:00 PM", available: true },
  { time: "05:00 PM", available: true },
  { time: "06:00 PM", available: false },
];

const SPECIALTY_DETAILS = [
  {
    icon: "◈",
    title: "B2B SaaS GTM",
    description: "미국 시장 ICP 정의 및 초기 파이프라인 구축",
  },
  {
    icon: "◉",
    title: "Partnerships",
    description: "채널 파트너 및 전략적 제휴 발굴·협상",
  },
  {
    icon: "◐",
    title: "Market Research",
    description: "경쟁사 분석과 TAM/SAM/SOM 산정",
  },
  {
    icon: "◑",
    title: "Fundraising Support",
    description: "VC 네트워크 연결 및 IR 자료 검토",
  },
];

// ── Helper components ─────────────────────────────────────────────────────────

function SectionHeading({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center justify-between mb-4"
      style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "10px" }}
    >
      <h2
        style={{
          fontSize: "14px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-dim)",
        }}
      >
        {children}
      </h2>
      {action}
    </div>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          style={{
            width: "14px",
            height: "14px",
            fill: i < Math.floor(rating) ? "var(--color-gold)" : "var(--color-border)",
          }}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function EnablerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const enabler = ENABLERS.find(e => e.userId === id) || ENABLERS[0];
  const reviews = REVIEWS.filter((r) => r.targetId === enabler.userId);
  const insights = INSIGHTS.filter((i) => i.authorId === enabler.userId);

  const [sessionType, setSessionType] = useState<SessionType>("chemistry");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [brief, setBrief] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!selectedSlot) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setSelectedSlot(null);
    setBrief("");
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : enabler.rating.toFixed(1);

  // 별점 분포 계산
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: reviews.length > 0
      ? Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100)
      : 0,
  }));

  function formatDate(dateStr: string) {
    const [y, m, d] = dateStr.split("-");
    return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일`;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-black)",
        fontFamily: "var(--font-body)",
      }}
    >
      <Navbar />

      {/* Back breadcrumb */}
      <div
        style={{
          paddingTop: "56px",
          backgroundColor: "var(--color-black)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px 28px 0",
          }}
        >
          <Link
            href="/matching"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              fontFamily: "var(--font-body)",
              color: "var(--color-dim)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-text)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color =
                "var(--color-dim)")
            }
          >
            <svg
              style={{ width: "12px", height: "12px" }}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M8 2L4 6l4 4" />
            </svg>
            Enabler 찾기
          </Link>
        </div>
      </div>

      {/* Main layout */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 28px 80px",
          display: "flex",
          gap: "40px",
          alignItems: "flex-start",
        }}
      >
        {/* ── LEFT: Scrollable content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── HERO ── */}
          <div
            style={{
              backgroundColor: "var(--color-dark)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "32px",
              marginBottom: "24px",
            }}
          >
            {/* Avatar + Identity */}
            <div className="flex items-start gap-5 mb-6">
              <img
                src={enabler.avatarUrl}
                alt={enabler.fullName}
                style={{
                  width: "180px",
                  height: "180px",
                  minWidth: "180px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <div className="flex-1 min-w-0">
                <h1
                  style={{
                    fontSize: "26px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    color: "var(--color-text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    marginBottom: "4px",
                  }}
                >
                  {enabler.fullName}
                </h1>
                <p
                  style={{
                    fontSize: "16px",
                    color: "var(--color-dim)",
                    fontFamily: "var(--font-body)",
                    marginBottom: "12px",
                  }}
                >
                  {enabler.degreeType} · {enabler.university}
                </p>

                {/* Badge row */}
                <div className="flex items-center flex-wrap gap-2">
                  {/* Verified */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--color-green)",
                      backgroundColor: "oklch(0.72 0.19 155 / 0.12)",
                      border: "1px solid oklch(0.72 0.19 155 / 0.25)",
                      padding: "2px 9px",
                      borderRadius: "9999px",
                    }}
                  >
                    Verified
                    <svg
                      style={{ width: "10px", height: "10px" }}
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </span>

                  {/* Top Rated */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--color-gold)",
                      backgroundColor: "oklch(0.82 0.15 85 / 0.12)",
                      border: "1px solid oklch(0.82 0.15 85 / 0.25)",
                      padding: "2px 9px",
                      borderRadius: "9999px",
                    }}
                  >
                    Top Rated ★
                  </span>

                  {/* School badge */}
                  <span
                    style={{
                      fontSize: "12px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--color-blue)",
                      backgroundColor: "var(--color-blue-dim)",
                      border: "1px solid oklch(0.65 0.15 250 / 0.25)",
                      padding: "2px 9px",
                      borderRadius: "9999px",
                    }}
                  >
                    {enabler.university}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div
              className="flex items-center gap-1.5"
              style={{ color: "var(--color-dim)" }}
            >
              <svg
                style={{ width: "13px", height: "13px", flexShrink: 0 }}
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 2C7.239 2 5 4.239 5 7c0 4.418 5 11 5 11s5-6.582 5-11c0-2.761-2.239-5-5-5z" />
                <circle cx="10" cy="7" r="1.5" />
              </svg>
              <span style={{ fontSize: "15px", fontFamily: "var(--font-body)" }}>
                {enabler.location}
              </span>
            </div>
          </div>

          {/* ── STATS GRID ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            {[
              { value: enabler.sessionCount, label: "Sessions" },
              { value: enabler.rating.toFixed(1), label: "Rating" },
              { value: `${enabler.reRequestRate}%`, label: "Re-request" },
              { value: "12", label: "Avg Meetings" },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{
                  backgroundColor: "var(--color-dark)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  padding: "18px 16px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "28px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.1,
                    marginBottom: "5px",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "var(--color-dim)",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* ── ABOUT ── */}
          <div
            style={{
              backgroundColor: "var(--color-dark)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "20px",
            }}
          >
            <SectionHeading>소개</SectionHeading>
            <p
              style={{
                fontSize: "16px",
                fontFamily: "var(--font-body)",
                color: "var(--color-text)",
                lineHeight: 1.75,
              }}
            >
              {enabler.bio}
            </p>
          </div>

          {/* ── SPECIALTIES ── */}
          <div
            style={{
              backgroundColor: "var(--color-dark)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "20px",
            }}
          >
            <SectionHeading>전문 분야</SectionHeading>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {SPECIALTY_DETAILS.map(({ icon, title, description }) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    padding: "14px",
                    backgroundColor: "var(--color-black)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "18px",
                      lineHeight: 1,
                      color: "var(--color-accent)",
                      flexShrink: 0,
                      marginTop: "1px",
                    }}
                  >
                    {icon}
                  </span>
                  <div>
                    <p
                      style={{
                        fontSize: "15px",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "var(--color-text)",
                        marginBottom: "3px",
                        lineHeight: 1.3,
                      }}
                    >
                      {title}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontFamily: "var(--font-body)",
                        color: "var(--color-dim)",
                        lineHeight: 1.5,
                      }}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── INSIGHTS ── */}
          <div
            style={{
              backgroundColor: "var(--color-dark)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "20px",
            }}
          >
            <SectionHeading
              action={
                <Link
                  href="/insights"
                  style={{
                    fontSize: "12px",
                    fontFamily: "var(--font-body)",
                    color: "var(--color-dim)",
                    textDecoration: "none",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-accent)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-dim)")
                  }
                >
                  전체 보기 →
                </Link>
              }
            >
              인사이트
            </SectionHeading>

            {insights.length === 0 ? (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-dim)",
                  fontFamily: "var(--font-body)",
                  padding: "8px 0",
                }}
              >
                아직 게시된 인사이트가 없습니다.
              </p>
            ) : (
              <div>
                {insights.map((insight, i) => (
                  <div
                    key={insight.id}
                    style={{
                      padding: "14px 0",
                      borderBottom:
                        i < insights.length - 1
                          ? "1px solid var(--color-border)"
                          : "none",
                    }}
                  >
                    <p
                      className="transition-colors duration-150"
                      style={{
                        fontSize: "15px",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        color: "var(--color-text)",
                        lineHeight: 1.4,
                        marginBottom: "5px",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLParagraphElement).style.color =
                          "var(--color-accent)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLParagraphElement).style.color =
                          "var(--color-text)")
                      }
                    >
                      {insight.title}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        fontFamily: "var(--font-body)",
                        color: "var(--color-dim)",
                        lineHeight: 1.55,
                        marginBottom: "8px",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {insight.content}
                    </p>
                    <div className="flex items-center gap-3">
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--color-dim)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {insight.publishedAt}
                      </span>
                      <span
                        style={{
                          width: "2px",
                          height: "2px",
                          borderRadius: "50%",
                          backgroundColor: "var(--color-border)",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--color-dim)",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {(parseInt(insight.id.replace(/\D/g, "") || "1", 10) * 37 + 80)}회 읽음
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── REVIEWS ── */}
          <div
            style={{
              backgroundColor: "var(--color-dark)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "28px",
            }}
          >
            <SectionHeading>리뷰</SectionHeading>

            {reviews.length === 0 ? (
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-dim)",
                  fontFamily: "var(--font-body)",
                  padding: "8px 0",
                }}
              >
                아직 리뷰가 없습니다.
              </p>
            ) : (
              <>
                {/* ── Rating Summary ── */}
                <div
                  style={{
                    display: "flex",
                    gap: "28px",
                    alignItems: "center",
                    padding: "20px 24px",
                    backgroundColor: "var(--color-black)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "12px",
                    marginBottom: "24px",
                  }}
                >
                  {/* Left: big average number */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "6px",
                      minWidth: "80px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "52px",
                        fontFamily: "var(--font-display)",
                        fontWeight: 800,
                        color: "var(--color-gold)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                      }}
                    >
                      {avgRating}
                    </span>
                    <StarRow rating={parseFloat(avgRating)} />
                    <span
                      style={{
                        fontSize: "12px",
                        fontFamily: "var(--font-body)",
                        color: "var(--color-dim)",
                        marginTop: "2px",
                      }}
                    >
                      {reviews.length}개 리뷰
                    </span>
                  </div>

                  {/* Divider */}
                  <div
                    style={{
                      width: "1px",
                      alignSelf: "stretch",
                      backgroundColor: "var(--color-border)",
                      flexShrink: 0,
                    }}
                  />

                  {/* Right: distribution bars */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    {ratingDistribution.map(({ star, count, pct }) => (
                      <div
                        key={star}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {/* Star label */}
                        <span
                          style={{
                            fontSize: "11px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--color-dim)",
                            minWidth: "18px",
                            textAlign: "right",
                            flexShrink: 0,
                          }}
                        >
                          {star}
                        </span>
                        <svg
                          style={{
                            width: "11px",
                            height: "11px",
                            flexShrink: 0,
                            fill: pct > 0 ? "var(--color-gold)" : "var(--color-border)",
                          }}
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {/* Bar track */}
                        <div
                          style={{
                            flex: 1,
                            height: "6px",
                            backgroundColor: "var(--color-border)",
                            borderRadius: "9999px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              backgroundColor: "var(--color-gold)",
                              borderRadius: "9999px",
                              transition: "width 0.4s ease",
                            }}
                          />
                        </div>
                        {/* Count */}
                        <span
                          style={{
                            fontSize: "11px",
                            fontFamily: "var(--font-mono)",
                            color: count > 0 ? "var(--color-dim)" : "var(--color-border)",
                            minWidth: "16px",
                            textAlign: "right",
                            flexShrink: 0,
                          }}
                        >
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Individual reviews ── */}
                <div>
                  {reviews.map((review, i) => (
                    <div
                      key={review.id}
                      style={{
                        padding: "20px 0",
                        borderBottom:
                          i < reviews.length - 1
                            ? "1px solid var(--color-border)"
                            : "none",
                      }}
                    >
                      {/* Reviewer header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        {/* Avatar */}
                        {review.authorAvatar ? (
                          <img
                            src={review.authorAvatar}
                            alt={review.authorName}
                            style={{
                              width: "40px",
                              height: "40px",
                              minWidth: "40px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "1px solid var(--color-border)",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              minWidth: "40px",
                              borderRadius: "50%",
                              backgroundColor: "var(--color-card)",
                              border: "1px solid var(--color-border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "14px",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              color: "var(--color-dim)",
                            }}
                          >
                            {review.authorName.charAt(0)}
                          </div>
                        )}

                        {/* Name + stars + date */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: "8px",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "15px",
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                color: "var(--color-text)",
                              }}
                            >
                              {review.authorName}
                            </span>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "var(--color-dim)",
                                fontFamily: "var(--font-body)",
                                flexShrink: 0,
                              }}
                            >
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <StarRow rating={review.rating} />
                        </div>
                      </div>

                      {/* Comment */}
                      <p
                        style={{
                          fontSize: "15px",
                          fontFamily: "var(--font-body)",
                          color: "var(--color-text)",
                          lineHeight: 1.7,
                          paddingLeft: "52px",
                        }}
                      >
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT: Sticky booking sidebar ── */}
        <aside
          style={{
            width: "320px",
            minWidth: "320px",
            position: "sticky",
            top: "76px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--color-dark)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            {/* Credit display */}
            <div
              style={{
                padding: "20px 22px 18px",
                background:
                  "linear-gradient(135deg, oklch(0.91 0.2 110 / 0.07) 0%, var(--color-dark) 100%)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-dim)",
                  marginBottom: "4px",
                }}
              >
                크레딧
              </p>
              <div className="flex items-baseline gap-1.5">
                <span
                  style={{
                    fontSize: "36px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--color-accent)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                  }}
                >
                  {enabler.creditRate}
                </span>
                <span
                  style={{
                    fontSize: "15px",
                    fontFamily: "var(--font-body)",
                    color: "var(--color-dim)",
                  }}
                >
                  / session
                </span>
              </div>
            </div>

            <div style={{ padding: "18px 20px 22px" }}>
              {/* Session type selection */}
              <p
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-dim)",
                  marginBottom: "10px",
                }}
              >
                세션 유형
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginBottom: "20px",
                }}
              >
                {SESSION_OPTIONS.map((opt) => {
                  const isSelected = sessionType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSessionType(opt.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "11px 14px",
                        borderRadius: "10px",
                        border: `1px solid ${isSelected ? "var(--color-accent)" : "var(--color-border)"}`,
                        backgroundColor: isSelected
                          ? "var(--color-accent-dim)"
                          : "var(--color-black)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "left",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "oklch(0.91 0.2 110 / 0.35)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "var(--color-border)";
                        }
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span style={{ fontSize: "14px", lineHeight: 1 }}>
                          {opt.icon}
                        </span>
                        <div>
                          <p
                            style={{
                              fontSize: "14px",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              color: isSelected
                                ? "var(--color-accent)"
                                : "var(--color-text)",
                              lineHeight: 1.3,
                              marginBottom: "1px",
                            }}
                          >
                            {opt.label}
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              fontFamily: "var(--font-body)",
                              color: "var(--color-dim)",
                              lineHeight: 1.3,
                            }}
                          >
                            {opt.sublabel}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p
                          style={{
                            fontSize: "12px",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                            color: isSelected
                              ? "var(--color-accent)"
                              : "var(--color-text)",
                            lineHeight: 1.3,
                          }}
                        >
                          {opt.credits}
                        </p>
                        <p
                          style={{
                            fontSize: "10px",
                            fontFamily: "var(--font-body)",
                            color: "var(--color-dim)",
                            lineHeight: 1.3,
                          }}
                        >
                          {opt.duration}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Time slots */}
              <p
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-dim)",
                  marginBottom: "10px",
                }}
              >
                시간 선택
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "6px",
                  marginBottom: "20px",
                }}
              >
                {TIME_SLOTS.map(({ time, available }) => {
                  const isSelected = selectedSlot === time;
                  return (
                    <button
                      key={time}
                      onClick={() => {
                        if (available) {
                          setSelectedSlot(isSelected ? null : time);
                        }
                      }}
                      disabled={!available}
                      style={{
                        padding: "7px 4px",
                        borderRadius: "8px",
                        border: `1px solid ${
                          isSelected
                            ? "var(--color-accent)"
                            : "var(--color-border)"
                        }`,
                        backgroundColor: isSelected
                          ? "var(--color-accent-dim)"
                          : "var(--color-black)",
                        color: isSelected
                          ? "var(--color-accent)"
                          : available
                          ? "var(--color-text)"
                          : "var(--color-dim)",
                        fontSize: "10px",
                        fontFamily: "var(--font-display)",
                        fontWeight: isSelected ? 700 : 500,
                        cursor: available ? "pointer" : "not-allowed",
                        opacity: available ? 1 : 0.3,
                        transition: "all 0.15s",
                        lineHeight: 1.3,
                      }}
                      onMouseEnter={(e) => {
                        if (available && !isSelected) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "oklch(0.91 0.2 110 / 0.35)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (available && !isSelected) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "var(--color-border)";
                        }
                      }}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>

              {/* Brief textarea */}
              <p
                style={{
                  fontSize: "12px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-dim)",
                  marginBottom: "8px",
                }}
              >
                사전 브리프
              </p>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="상담 목적과 궁금한 점을 간략히 적어주세요..."
                style={{
                  width: "100%",
                  height: "70px",
                  backgroundColor: "var(--color-black)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  fontFamily: "var(--font-body)",
                  color: "var(--color-text)",
                  resize: "none",
                  outline: "none",
                  transition: "border-color 0.15s",
                  marginBottom: "14px",
                  boxSizing: "border-box",
                  lineHeight: 1.55,
                }}
                onFocus={(e) =>
                  ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                    "var(--color-accent)")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLTextAreaElement).style.borderColor =
                    "var(--color-border)")
                }
              />

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!selectedSlot || submitted}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor:
                    submitted
                      ? "oklch(0.72 0.19 155)"
                      : !selectedSlot
                      ? "oklch(0.91 0.2 110 / 0.35)"
                      : "var(--color-accent)",
                  color: submitted ? "white" : "oklch(0.1 0 0)",
                  fontSize: "13px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  cursor: !selectedSlot || submitted ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  marginBottom: "12px",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={(e) => {
                  if (selectedSlot && !submitted) {
                    (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                {submitted ? "예약 요청 완료" : "예약 요청하기"}
              </button>

              {/* Footer note */}
              <p
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-body)",
                  color: "var(--color-dim)",
                  lineHeight: 1.55,
                  textAlign: "center",
                }}
              >
                Chemistry Call은 무료입니다. 첫 만남 후 정규 세션을 예약하세요.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
