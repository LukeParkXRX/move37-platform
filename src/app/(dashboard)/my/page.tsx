"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MOCK_CURRENT_USER,
  BOOKINGS,
  CREDIT_TRANSACTIONS,
  ENABLERS,
} from "@/lib/constants/mock-data";

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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MyDashboardPage() {
  const user = MOCK_CURRENT_USER;
  const company = user.startup?.companyName ?? "";
  const creditBalance = user.startup?.creditBalance ?? 0;

  const myBookings = BOOKINGS.filter((b) => b.startupId === user.id);
  const confirmedBookings = myBookings.filter((b) => b.status === "confirmed");
  const completedBookings = myBookings.filter((b) => b.status === "completed");

  const myTransactions = CREDIT_TRANSACTIONS.filter(
    (t) => t.startupId === user.id
  )
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const enablerMap = Object.fromEntries(
    ENABLERS.map((e) => [e.userId, e])
  );

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
            {company}
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
            안녕하세요, {user.fullName}님. 오늘도 미국 진출을 향해 나아가세요.
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
                <div
                  style={{
                    padding: "32px 24px",
                    textAlign: "center",
                    color: "var(--color-dim)",
                    fontSize: "15px",
                  }}
                >
                  예정된 세션이 없습니다
                  <br />
                  <Link
                    href="/matching"
                    style={{
                      color: "var(--color-accent)",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Enabler를 찾아보세요 →
                  </Link>
                </div>
              ) : (
                confirmedBookings.map((booking) => {
                  const enabler = enablerMap[booking.enablerId];
                  return (
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
                          {enabler?.avatarUrl ? (
                            <img
                              src={enabler.avatarUrl}
                              alt={enabler.fullName}
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
                                flexShrink: 0,
                              }}
                            />
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
                              {enabler?.fullName ?? booking.enablerId}
                            </p>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "var(--color-dim)",
                                margin: 0,
                              }}
                            >
                              {formatDate(booking.scheduledAt)}
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

                      {booking.meetingUrl && (
                        <Link
                          href={booking.meetingUrl}
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
                  );
                })
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
              {myTransactions.length === 0 ? (
                <div
                  style={{
                    padding: "32px 24px",
                    textAlign: "center",
                    color: "var(--color-dim)",
                    fontSize: "15px",
                  }}
                >
                  거래 내역이 없습니다
                </div>
              ) : (
                myTransactions.map((tx) => {
                  const isPositive =
                    tx.txType === "release" || tx.txType === "allocate";
                  const isNegative =
                    tx.txType === "hold" || tx.txType === "confirm";
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
                        <TxIcon txType={tx.txType} />
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
                            {TX_TYPE_LABELS[tx.txType] ?? tx.txType}
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
                          {formatShortDate(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
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
