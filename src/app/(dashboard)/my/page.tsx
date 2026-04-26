"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { DbBooking, DbCreditTransaction } from "@/lib/db/types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

const TX_TYPE_LABELS: Record<string, string> = {
  purchase: "구매",
  allocate: "지급",
  hold: "홀드",
  confirm: "차감",
  release: "반환",
  use: "사용",
  refund: "환불",
  expire: "만료",
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  standard: "스탠다드",
  chemistry: "케미스트리",
  project: "프로젝트",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  suffix,
  color,
}: {
  label: string;
  value: number | string;
  suffix?: string;
  color: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontSize: "13px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-dim)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "32px",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          color,
          lineHeight: 1,
        }}
      >
        {value}
        {suffix && (
          <span
            style={{
              fontSize: "16px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              marginLeft: "4px",
              opacity: 0.7,
            }}
          >
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    standard: { bg: "rgba(59,130,246,0.12)", text: "var(--color-blue)" },
    chemistry: { bg: "rgba(168,85,247,0.12)", text: "#a855f7" },
    project: { bg: "rgba(245,158,11,0.12)", text: "var(--color-amber)" },
  };
  const c = colors[type] ?? colors.standard;
  return (
    <span
      style={{
        fontSize: "12px",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        backgroundColor: c.bg,
        color: c.text,
        borderRadius: "4px",
        padding: "2px 7px",
      }}
    >
      {SESSION_TYPE_LABELS[type] ?? type}
    </span>
  );
}

function TxIcon({ txType }: { txType: string }) {
  const icons: Record<string, string> = {
    purchase: "💳",
    allocate: "🎁",
    hold: "🔒",
    confirm: "✅",
    release: "↩️",
    use: "📤",
    refund: "💰",
    expire: "⏰",
  };
  return <span style={{ fontSize: "16px" }}>{icons[txType] ?? "•"}</span>;
}

function QuickActionButton({
  href,
  label,
  description,
  icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          backgroundColor: hovered
            ? "rgba(188,255,0,0.06)"
            : "var(--color-card)",
          border: hovered
            ? "1px solid var(--color-accent)"
            : "1px solid var(--color-border)",
          borderRadius: "12px",
          padding: "20px",
          cursor: "pointer",
          transition: "all 0.15s ease",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "22px" }}>{icon}</span>
        <span
          style={{
            fontSize: "16px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: hovered ? "var(--color-accent)" : "var(--color-text)",
            transition: "color 0.15s ease",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: "14px",
            fontFamily: "var(--font-body)",
            color: "var(--color-dim)",
            lineHeight: 1.4,
          }}
        >
          {description}
        </span>
      </div>
    </Link>
  );
}

function EmptyState({ message, cta }: { message: string; cta?: { label: string; href: string } }) {
  return (
    <div
      style={{
        padding: "32px 24px",
        textAlign: "center",
        color: "var(--color-dim)",
        fontSize: "15px",
      }}
    >
      {message}
      {cta && (
        <>
          <br />
          <Link
            href={cta.href}
            style={{
              color: "var(--color-accent)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            {cta.label} →
          </Link>
        </>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MyDashboardPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const redirected = useRef(false);

  type BookingWithEnabler = DbBooking & {
    enabler?: { full_name: string | null; avatar_url: string | null } | null;
  };

  type MyReview = {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    target_id: string;
    enabler_name: string | null;
  };

  const [creditBalance, setCreditBalance] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState<BookingWithEnabler[]>([]);
  const [completedBookings, setCompletedBookings] = useState<BookingWithEnabler[]>([]);
  const [transactions, setTransactions] = useState<DbCreditTransaction[]>([]);
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // 토큰 만료 등으로 세션이 끊기면 /login 으로 이동.
  // role 미선택/미인증 초기 차단은 서버 레이아웃 가드가 이미 처리.
  useEffect(() => {
    if (!loading && !user && !redirected.current) {
      redirected.current = true;
      router.replace("/login");
    }
  }, [loading, user, router]);

  // 실데이터 조회
  useEffect(() => {
    if (!user) {
      if (!loading) setDataLoading(false);
      return;
    }

    async function fetchData() {
      setDataLoading(true);
      try {
        const supabase = createClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const db = supabase as any;

        const { data: sp } = await db
          .from("startup_profiles")
          .select("credit_balance")
          .eq("user_id", user!.id)
          .single();
        setCreditBalance(sp?.credit_balance ?? 0);

        const { data: bookings } = await db
          .from("bookings")
          .select("*")
          .eq("startup_id", user!.id)
          .order("scheduled_at", { ascending: true });

        const allBookings: DbBooking[] = bookings ?? [];

        // enabler 정보 별도 조회 후 클라이언트 결합 (외래키 이름 의존 회피)
        const enablerIds = Array.from(new Set(allBookings.map((b) => b.enabler_id)));
        let enablerMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();
        if (enablerIds.length > 0) {
          const { data: enablers } = await db
            .from("users")
            .select("id, full_name, avatar_url")
            .in("id", enablerIds);
          enablerMap = new Map(
            (enablers ?? []).map((u: { id: string; full_name: string | null; avatar_url: string | null }) => [
              u.id,
              { full_name: u.full_name, avatar_url: u.avatar_url },
            ]),
          );
        }
        const withEnabler: BookingWithEnabler[] = allBookings.map((b) => ({
          ...b,
          enabler: enablerMap.get(b.enabler_id) ?? null,
        }));

        setConfirmedBookings(withEnabler.filter((b) => b.status === "confirmed"));
        setCompletedBookings(withEnabler.filter((b) => b.status === "completed"));

        const { data: txs } = await db
          .from("credit_transactions")
          .select("*")
          .eq("startup_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setTransactions(txs ?? []);

        // 내가 작성한 리뷰
        const { data: rawReviews } = await db
          .from("reviews")
          .select("id, rating, comment, created_at, target_id")
          .eq("author_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(5);

        const reviewList: Array<{ id: string; rating: number; comment: string | null; created_at: string; target_id: string }> = rawReviews ?? [];

        // target(enabler) 이름 조회
        const targetIds = Array.from(new Set(reviewList.map((r) => r.target_id)));
        let targetNameMap = new Map<string, string>();
        if (targetIds.length > 0) {
          const { data: targetUsers } = await db
            .from("users")
            .select("id, full_name")
            .in("id", targetIds);
          targetNameMap = new Map(
            ((targetUsers ?? []) as { id: string; full_name: string | null }[]).map((u) => [u.id, u.full_name ?? "알 수 없음"])
          );
        }

        setMyReviews(
          reviewList.map((r) => ({
            ...r,
            enabler_name: targetNameMap.get(r.target_id) ?? null,
          }))
        );
      } catch (err) {
        void err;
      } finally {
        setDataLoading(false);
      }
    }

    fetchData();
  }, [user]);

  // 로딩 상태 — 초기 authentication 확인 중일 때만
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--color-dim)", fontSize: "14px", fontFamily: "var(--font-body)" }}>
          인증 확인 중...
        </div>
      </div>
    );
  }

  // 세션 없음 — 리디렉트 중 빈 화면 표시
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--color-dim)", fontSize: "14px", fontFamily: "var(--font-body)" }}>
          로그인 페이지로 이동 중...
        </div>
      </div>
    );
  }

  // 프로필이 아직 로드 안 됨 — 데이터 로딩 중
  if (dataLoading && !profile) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-black)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "var(--color-dim)", fontSize: "14px", fontFamily: "var(--font-body)" }}>
          프로필 불러오는 중...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "var(--color-black)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ maxWidth: "400px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "24px", fontWeight: 700, color: "var(--color-text)", marginBottom: "12px" }}>
            프로필이 없습니다
          </h1>
          <p style={{ color: "var(--color-dim)", fontSize: "14px", marginBottom: "24px" }}>
            역할을 선택하고 프로필을 완성해주세요.
          </p>
          <Link href="/onboarding/role" style={{ display: "inline-block", padding: "12px 28px", borderRadius: "10px", backgroundColor: "var(--color-accent)", color: "oklch(0.1 0 0)", fontFamily: "var(--font-display)", fontWeight: 700, textDecoration: "none" }}>
            역할 선택으로 이동
          </Link>
        </div>
      </div>
    );
  }

  // role 없으면 위 useEffect가 /onboarding/role로 리다이렉트 중 — 렌더 스킵
  if (!profile.role) return null;

  const displayName = profile.full_name || user.email?.split("@")[0] || "사용자";
  const roleLabels: Record<string, string> = {
    startup: "스타트업",
    enabler: "Enabler",
    org_admin: "기관 관리자",
    super_admin: "슈퍼 어드민",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-black)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "48px 24px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <p
            style={{
              fontSize: "13px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              marginBottom: "8px",
            }}
          >
            {roleLabels[profile.role] ?? profile.role}
          </p>
          <h1
            style={{
              fontSize: "28px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--color-text)",
              margin: 0,
            }}
          >
            내 대시보드
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: "var(--color-dim)",
              marginTop: "6px",
            }}
          >
            안녕하세요, {displayName}님. 오늘도 미국 진출을 향해 나아가세요.
          </p>
        </div>

        {/* KPI Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <KpiCard
            label="크레딧 잔액"
            value={creditBalance}
            suffix="C"
            color="var(--color-accent)"
          />
          <KpiCard
            label="예약된 세션"
            value={confirmedBookings.length}
            color="var(--color-blue)"
          />
          <KpiCard
            label="완료 세션"
            value={completedBookings.length}
            color="var(--color-green)"
          />
        </div>

        {/* Content Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          {/* Upcoming Sessions */}
          <div
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-text)",
                  margin: 0,
                }}
              >
                예정 세션
              </h2>
              <span
                style={{
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-dim)",
                }}
              >
                {confirmedBookings.length}건
              </span>
            </div>

            <div style={{ padding: "8px 0" }}>
              {confirmedBookings.length === 0 ? (
                <EmptyState
                  message="아직 예정된 세션이 없어요"
                  cta={{ label: "Enabler 찾아보기", href: "/matching" }}
                />
              ) : (
                confirmedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    style={{
                      padding: "16px 24px",
                      borderBottom: "1px solid var(--color-border)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {booking.enabler?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={booking.enabler.avatar_url}
                            alt={booking.enabler.full_name ?? "Enabler"}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "var(--color-border)",
                              color: "var(--color-dim)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {(booking.enabler?.full_name ?? "?").slice(0, 1)}
                          </div>
                        )}
                        <div>
                          <p
                            style={{
                              fontSize: "15px",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              color: "var(--color-text)",
                              margin: 0,
                            }}
                          >
                            {booking.enabler?.full_name ?? "Enabler"}
                          </p>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "var(--color-dim)",
                              margin: 0,
                            }}
                          >
                            {formatDate(booking.scheduled_at)}
                          </p>
                        </div>
                      </div>
                      <TypeBadge type={booking.type} />
                    </div>

                    {booking.brief && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--color-dim)",
                          lineHeight: 1.5,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {booking.brief}
                      </p>
                    )}

                    <Link
                      href={`/meeting/session-${booking.id}?name=${encodeURIComponent(displayName)}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "13px",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        letterSpacing: "0.04em",
                        color: "var(--color-accent)",
                        backgroundColor: "rgba(188,255,0,0.08)",
                        border: "1px solid rgba(188,255,0,0.2)",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        textDecoration: "none",
                        width: "fit-content",
                      }}
                    >
                      <span>▶</span> 미팅 참여
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontSize: "15px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-text)",
                  margin: 0,
                }}
              >
                최근 거래 내역
              </h2>
              <span
                style={{
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-dim)",
                }}
              >
                최근 5건
              </span>
            </div>

            <div style={{ padding: "8px 0" }}>
              {transactions.length === 0 ? (
                <EmptyState message="아직 거래 내역이 없어요" />
              ) : (
                transactions.map((tx) => {
                  const isPositive = tx.tx_type === "release" || tx.tx_type === "allocate";
                  const isNegative = tx.tx_type === "hold" || tx.tx_type === "confirm" || tx.tx_type === "use";
                  const amountColor = isPositive
                    ? "var(--color-green)"
                    : isNegative
                    ? "var(--color-red)"
                    : "var(--color-dim)";

                  return (
                    <div
                      key={tx.id}
                      style={{
                        padding: "14px 24px",
                        borderBottom: "1px solid var(--color-border)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(255,255,255,0.04)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <TxIcon txType={tx.tx_type} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "14px",
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              color: "var(--color-dim)",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            {TX_TYPE_LABELS[tx.tx_type] ?? tx.tx_type}
                          </span>
                          <span
                            style={{
                              fontSize: "16px",
                              fontFamily: "var(--font-mono)",
                              fontWeight: 700,
                              color: amountColor,
                              flexShrink: 0,
                            }}
                          >
                            {tx.amount > 0 ? "+" : ""}
                            {tx.amount}C
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--color-dim)",
                            margin: "2px 0 0 0",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {tx.description}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            fontFamily: "var(--font-mono)",
                            color: "rgba(255,255,255,0.2)",
                            margin: "2px 0 0 0",
                          }}
                        >
                          {formatShortDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* 내 리뷰 */}
        <div
          style={{
            backgroundColor: "var(--color-card)",
            border: "1px solid var(--color-border)",
            borderRadius: "12px",
            overflow: "hidden",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <h2
              style={{
                fontSize: "15px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--color-text)",
                margin: 0,
              }}
            >
              내 리뷰 {myReviews.length > 0 && <span style={{ color: "var(--color-dim)", fontWeight: 400 }}>({myReviews.length})</span>}
            </h2>
          </div>
          {myReviews.length === 0 ? (
            <EmptyState
              message="완료된 세션 후 리뷰를 남겨주세요"
              cta={{ label: "예약 관리로 이동", href: "/bookings" }}
            />
          ) : (
            <div style={{ padding: "8px 0" }}>
              {myReviews.map((review, idx) => (
                <div
                  key={review.id}
                  style={{
                    padding: "16px 24px",
                    borderBottom: idx < myReviews.length - 1 ? "1px solid var(--color-border)" : "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {/* 상단: Enabler 이름 + 날짜 */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "15px",
                        color: "var(--color-text)",
                      }}
                    >
                      {review.enabler_name ?? "이네이블러"}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "12px",
                        color: "var(--color-dim)",
                        flexShrink: 0,
                      }}
                    >
                      {formatShortDate(review.created_at)}
                    </span>
                  </div>
                  {/* 별점 */}
                  <div style={{ display: "flex", gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 15,
                          color: i < review.rating ? "var(--color-accent)" : "var(--color-border)",
                        }}
                      >
                        {i < review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  {/* 코멘트 */}
                  {review.comment && (
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "14px",
                        color: "var(--color-dim)",
                        margin: 0,
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div>
          <h2
            style={{
              fontSize: "15px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-dim)",
              marginBottom: "16px",
            }}
          >
            빠른 메뉴
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
              gap: "16px",
            }}
          >
            <QuickActionButton
              href="/matching"
              icon="🔍"
              label="Enabler 찾기"
              description="전문 Enabler를 검색하고 세션을 예약하세요"
            />
            <QuickActionButton
              href="/bookings"
              icon="📅"
              label="예약 관리"
              description="진행 중인 예약 현황을 확인하고 관리하세요"
            />
            <QuickActionButton
              href="/settings"
              icon="⚙️"
              label="프로필 설정"
              description="회사 정보와 미국 진출 목표를 업데이트하세요"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
