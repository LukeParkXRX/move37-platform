"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  B2B_STATS,
  STARTUP_CREDITS,
  RECENT_SESSIONS,
  ORGANIZATIONS,
} from "@/lib/constants/mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

type NavItem = {
  icon: string;
  label: string;
  id: string;
  href: string;
};

type ActivityType = "session" | "credit" | "matching" | "alert" | "report";

type Activity = {
  type: ActivityType;
  text: string;
  time: string;
};

// ── Constants ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { icon: "📊", label: "대시보드", id: "dashboard", href: "/org/dashboard" },
  { icon: "🚀", label: "스타트업 관리", id: "startups", href: "/org/startups" },
  { icon: "💳", label: "크레딧 관리", id: "credits", href: "/org/credits" },
  { icon: "👥", label: "Enabler Pool", id: "enablers", href: "/org/enablers" },
  { icon: "📅", label: "세션 이력", id: "sessions", href: "/org/sessions" },
  { icon: "📄", label: "리포트", id: "reports", href: "/org/reports" },
  { icon: "⚙️", label: "설정", id: "settings", href: "/org/settings" },
];

const ACTIVITIES: Activity[] = [
  {
    type: "session",
    text: "넥스트페이가 Sarah Chen과 세션을 완료했습니다",
    time: "1시간 전",
  },
  {
    type: "credit",
    text: "AIFlow에 크레딧 10개가 추가 배분되었습니다",
    time: "3시간 전",
  },
  {
    type: "matching",
    text: "그린테크가 새로운 Enabler 매칭을 요청했습니다",
    time: "5시간 전",
  },
  {
    type: "alert",
    text: "메디링크의 크레딧이 소진되었습니다",
    time: "1일 전",
  },
  {
    type: "report",
    text: "월간 리포트가 자동 생성되었습니다",
    time: "2일 전",
  },
];

const ACTIVITY_DOT_COLOR: Record<ActivityType, string> = {
  session: "var(--color-green)",
  credit: "var(--color-blue)",
  matching: "var(--color-accent)",
  alert: "var(--color-red)",
  report: "var(--color-dim)",
};

const STATUS_CONFIG = {
  active: { label: "정상", color: "var(--color-green)" },
  low: { label: "부족", color: "var(--color-amber)" },
  depleted: { label: "소진", color: "var(--color-red)" },
} as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function ColLabel({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        fontSize: "12px",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "var(--color-dim)",
        padding: "10px 12px",
        textAlign: "left" as const,
        whiteSpace: "nowrap" as const,
        backgroundColor: "var(--color-dark)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      {children}
    </th>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <span style={{ color: "var(--color-gold)", fontSize: "12px", letterSpacing: "-1px" }}>
      {"★".repeat(value)}{"☆".repeat(5 - value)}
    </span>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OrgDashboardPage() {
  const pathname = usePathname();
  const org = ORGANIZATIONS[0];

  const remainingCredits = B2B_STATS.distributedCredits - B2B_STATS.usedCredits;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--color-black)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: "220px",
          minWidth: "220px",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "var(--color-dark)",
          borderRight: "1px solid var(--color-border)",
          padding: "24px 12px 24px",
          overflowY: "auto",
        }}
      >
        {/* Org identity */}
        <div style={{ padding: "0 4px 20px" }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              style={{
                width: "38px",
                height: "38px",
                minWidth: "38px",
                borderRadius: "50%",
                backgroundColor: "var(--color-accent)",
                color: "oklch(0.1 0 0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: "17px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              S
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: "15px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {org.name}
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-dim)",
                  lineHeight: 1.4,
                  marginTop: "1px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {org.programName}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "var(--color-border)",
            marginBottom: "16px",
            marginLeft: "4px",
            marginRight: "4px",
          }}
        />

        {/* Nav items */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/org/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "15px",
                  fontFamily: "var(--font-body)",
                  fontWeight: isActive ? 600 : 400,
                  backgroundColor: isActive
                    ? "var(--color-accent-dim)"
                    : "transparent",
                  color: isActive ? "var(--color-accent)" : "var(--color-dim)",
                  transition: "background-color 0.15s, color 0.15s",
                  textAlign: "left",
                  width: "100%",
                  lineHeight: 1.4,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      "var(--color-card)";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "var(--color-dim)";
                  }
                }}
              >
                <span style={{ fontSize: "14px", lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────────────── */}
      <main
        style={{
          flex: 1,
          height: "100vh",
          overflowY: "auto",
          padding: "28px 32px 48px",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-start justify-between mb-7"
          style={{}}
        >
          <div>
            <h1
              style={{
                fontSize: "22px",
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                color: "var(--color-text)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                marginBottom: "4px",
              }}
            >
              대시보드
            </h1>
            <p
              style={{
                fontSize: "15px",
                color: "var(--color-dim)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.4,
              }}
            >
              프로그램 현황을 한눈에 확인하세요
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Ghost button */}
            <button
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "15px",
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                backgroundColor: "transparent",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                cursor: "pointer",
                transition: "border-color 0.15s, background-color 0.15s",
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "oklch(0.91 0.2 110 / 0.5)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-card)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor =
                  "var(--color-border)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
            >
              리포트 생성
            </button>

            {/* Accent button */}
            <button
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "15px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                backgroundColor: "var(--color-accent)",
                border: "none",
                color: "oklch(0.1 0 0)",
                cursor: "pointer",
                transition: "opacity 0.15s",
                lineHeight: 1.4,
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
              }
            >
              크레딧 구매
            </button>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {/* Card 1 — 등록 스타트업 */}
          <div
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-dim)",
                marginBottom: "10px",
              }}
            >
              등록 스타트업
            </p>
            <p
              style={{
                fontSize: "28px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              {B2B_STATS.registeredStartups}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "var(--color-dim)",
                  marginLeft: "3px",
                }}
              >
                개
              </span>
            </p>
            <p
              style={{
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                color: "var(--color-green)",
                fontWeight: 500,
              }}
            >
              +3 이번 달
            </p>
          </div>

          {/* Card 2 — 배분 크레딧 */}
          <div
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-dim)",
                marginBottom: "10px",
              }}
            >
              배분 크레딧
            </p>
            <p
              style={{
                fontSize: "28px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              {B2B_STATS.distributedCredits}
            </p>
            <p
              style={{
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                color: "var(--color-blue)",
                fontWeight: 500,
              }}
            >
              잔여 {remainingCredits}
            </p>
          </div>

          {/* Card 3 — 완료 세션 */}
          <div
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-dim)",
                marginBottom: "10px",
              }}
            >
              완료 세션
            </p>
            <p
              style={{
                fontSize: "28px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              {B2B_STATS.completedSessions}
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "var(--color-dim)",
                  marginLeft: "3px",
                }}
              >
                회
              </span>
            </p>
            <p
              style={{
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                color: "var(--color-green)",
                fontWeight: 500,
              }}
            >
              +22 이번 달
            </p>
          </div>

          {/* Card 4 — 평균 만족도 */}
          <div
            style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "20px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-dim)",
                marginBottom: "10px",
              }}
            >
              평균 만족도
            </p>
            <p
              style={{
                fontSize: "28px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-accent)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              {B2B_STATS.satisfaction}
            </p>
            <p
              style={{
                fontSize: "14px",
                fontFamily: "var(--font-body)",
                color: "var(--color-accent)",
                fontWeight: 500,
              }}
            >
              전월 대비 +0.2
            </p>
          </div>
        </div>

        {/* ── Two Tables ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Left: 스타트업별 크레딧 현황 */}
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
                padding: "16px 20px 14px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  lineHeight: 1.3,
                }}
              >
                스타트업별 크레딧 현황
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    fontFamily: "var(--font-body)",
                    color: "var(--color-dim)",
                  }}
                >
                  {STARTUP_CREDITS.length}개 스타트업
                </span>
                <Link
                  href="/org/credits"
                  style={{
                    fontSize: "13px",
                    fontFamily: "var(--font-body)",
                    color: "var(--color-accent)",
                    textDecoration: "none",
                  }}
                >
                  전체 보기 →
                </Link>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <ColLabel>스타트업</ColLabel>
                    <ColLabel>배분</ColLabel>
                    <ColLabel>사용</ColLabel>
                    <ColLabel>잔여</ColLabel>
                    <ColLabel>상태</ColLabel>
                  </tr>
                </thead>
                <tbody>
                  {STARTUP_CREDITS.map((startup, i) => {
                    const status = STATUS_CONFIG[startup.status];
                    return (
                      <tr
                        key={startup.name}
                        style={{
                          borderBottom:
                            i < STARTUP_CREDITS.length - 1
                              ? "1px solid var(--color-border)"
                              : "none",
                          transition: "background-color 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                            "oklch(0.24 0.008 280 / 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                            "transparent";
                        }}
                      >
                        <td
                          style={{
                            padding: "12px 12px",
                            fontSize: "15px",
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            color: "var(--color-text)",
                          }}
                        >
                          {startup.name}
                        </td>
                        <td
                          style={{
                            padding: "12px 12px",
                            fontSize: "15px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--color-dim)",
                          }}
                        >
                          {startup.allocated}
                        </td>
                        <td
                          style={{
                            padding: "12px 12px",
                            fontSize: "15px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--color-dim)",
                          }}
                        >
                          {startup.used}
                        </td>
                        <td
                          style={{
                            padding: "12px 12px",
                            fontSize: "15px",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            color:
                              startup.remaining === 0
                                ? "var(--color-red)"
                                : startup.remaining <= 3
                                  ? "var(--color-amber)"
                                  : "var(--color-text)",
                          }}
                        >
                          {startup.remaining}
                        </td>
                        <td style={{ padding: "12px 12px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              fontSize: "14px",
                              fontFamily: "var(--font-body)",
                              fontWeight: 500,
                              color: status.color,
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                backgroundColor: status.color,
                                flexShrink: 0,
                              }}
                            />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: 최근 세션 */}
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
                padding: "16px 20px 14px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "15px",
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  lineHeight: 1.3,
                }}
              >
                최근 세션
              </p>
              <span
                style={{
                  fontSize: "13px",
                  fontFamily: "var(--font-body)",
                  color: "var(--color-dim)",
                }}
              >
                최근 5건
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  tableLayout: "fixed",
                }}
              >
                <thead>
                  <tr>
                    <ColLabel>스타트업</ColLabel>
                    <ColLabel>Enabler</ColLabel>
                    <ColLabel>날짜</ColLabel>
                    <ColLabel>크레딧</ColLabel>
                    <ColLabel>평점</ColLabel>
                  </tr>
                </thead>
                <tbody>
                  {RECENT_SESSIONS.map((session, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom:
                          i < RECENT_SESSIONS.length - 1
                            ? "1px solid var(--color-border)"
                            : "none",
                        transition: "background-color 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "oklch(0.24 0.008 280 / 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 12px",
                          fontSize: "15px",
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          color: "var(--color-text)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {session.startup}
                      </td>
                      <td
                        style={{
                          padding: "12px 12px",
                          fontSize: "14px",
                          fontFamily: "var(--font-body)",
                          color: "var(--color-dim)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {session.enabler}
                      </td>
                      <td
                        style={{
                          padding: "12px 12px",
                          fontSize: "14px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-dim)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {session.date.slice(5)}
                      </td>
                      <td
                        style={{
                          padding: "12px 12px",
                          fontSize: "15px",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color: "var(--color-text)",
                        }}
                      >
                        {session.credits}C
                      </td>
                      <td style={{ padding: "12px 12px" }}>
                        <StarRating value={session.rating} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Activity Log ── */}
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
              padding: "16px 20px 14px",
              borderBottom: "1px solid var(--color-border)",
            }}
          >
            <p
              style={{
                fontSize: "15px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-text)",
                lineHeight: 1.3,
              }}
            >
              최근 활동
            </p>
          </div>

          <div style={{ padding: "4px 0" }}>
            {ACTIVITIES.map((activity, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "13px 20px",
                  borderBottom:
                    i < ACTIVITIES.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                  transition: "background-color 0.1s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "oklch(0.24 0.008 280 / 0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    "transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: "7px",
                      height: "7px",
                      minWidth: "7px",
                      borderRadius: "50%",
                      backgroundColor: ACTIVITY_DOT_COLOR[activity.type],
                    }}
                  />
                  <p
                    style={{
                      fontSize: "15px",
                      fontFamily: "var(--font-body)",
                      color: "var(--color-text)",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {activity.text}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    fontFamily: "var(--font-body)",
                    color: "var(--color-dim)",
                    whiteSpace: "nowrap",
                    marginLeft: "24px",
                    flexShrink: 0,
                  }}
                >
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
