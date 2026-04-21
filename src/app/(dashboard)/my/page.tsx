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

  const [creditBalance, setCreditBalance] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState<DbBooking[]>([]);
  const [completedBookings, setCompletedBookings] = useState<DbBooking[]>([]);
  const [transactions, setTransactions] = useState<DbCreditTransaction[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // 리디렉트 처리
  useEffect(() => {
    if (!loading && !user && !redirected.current) {
      redirected.current = true;
      router.replace("/login");
    }
  }, [loading, user, router]);

  // 실데이터 조회
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setDataLoading(true);
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;

      // 크레딧 잔액 — startup_profiles.credit_balance
      const { data: sp } = await db
        .from("startup_profiles")
        .select("credit_balance")
        .eq("user_id", user!.id)
        .single();
      setCreditBalance(sp?.credit_balance ?? 0);

      // 예약 목록
      const { data: bookings } = await db
        .from("bookings")
        .select("*")
        .eq("startup_id", user!.id)
        .order("scheduled_at", { ascending: true });

      const allBookings: DbBooking[] = bookings ?? [];
      setConfirmedBookings(allBookings.filter((b: DbBooking) => b.status === "confirmed"));
      setCompletedBookings(allBookings.filter((b: DbBooking) => b.status === "completed"));

      // 최근 크레딧 거래 5건
      const { data: txs } = await db
        .from("credit_transactions")
        .select("*")
        .eq("startup_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setTransactions(txs ?? []);

      setDataLoading(false);
    }

    fetchData();
  }, [user]);

  // 로딩 상태
  if (loading || dataLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-black)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "var(--color-dim)",
            fontSize: "14px",
            fontFamily: "var(--font-body)",
          }}
        >
          로딩 중...
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

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
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "var(--color-border)",
                            flexShrink: 0,
                          }}
                        />
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
                            Enabler
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

                    {booking.meeting_url && (
                      <Link
                        href={booking.meeting_url}
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
                    )}
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

        {/* Reviews — 나중 기능, 빈 상태 */}
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
              내 리뷰
            </h2>
          </div>
          <EmptyState message="아직 작성한 리뷰가 없어요" />
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
