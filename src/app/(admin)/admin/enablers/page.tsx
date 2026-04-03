"use client";

import { useState } from "react";
import { ENABLERS } from "@/lib/constants/mock-data";

// ─── 로컬 pending 목업 데이터 ────────────────────────────────────────────────

const PENDING_ENABLERS = [
  {
    userId: "e-p1",
    fullName: "Tom Wilson",
    avatarInitial: "TW",
    avatarUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face",
    university: "NYU Stern",
    degreeType: "MBA '25",
    status: "pending" as const,
    specialties: ["Marketing", "D2C"],
    location: "New York, NY",
    enablerScore: 0,
    sessionCount: 0,
    rating: 0,
    reRequestRate: 0,
    bio: "NYU Stern 재학 중. 한국 D2C 브랜드의 미국 마케팅 전략 컨설팅 희망.",
    creditRate: 2,
    badgeLevel: "verified" as const,
    availability: {},
  },
  {
    userId: "e-p2",
    fullName: "Lisa Zhang",
    avatarInitial: "LZ",
    avatarUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face",
    university: "Kellogg",
    degreeType: "MBA '25",
    status: "pending" as const,
    specialties: ["Supply Chain", "Operations"],
    location: "Chicago, IL",
    enablerScore: 0,
    sessionCount: 0,
    rating: 0,
    reRequestRate: 0,
    bio: "Kellogg 재학 중. 공급망 최적화와 한국 제조업의 미국 진출 지원.",
    creditRate: 2,
    badgeLevel: "verified" as const,
    availability: {},
  },
];

const ALL_ENABLERS_BASE = [...PENDING_ENABLERS, ...ENABLERS] as Array<{
  userId: string;
  fullName: string;
  avatarInitial: string;
  avatarUrl: string;
  university: string;
  degreeType: string;
  status: string;
  specialties: string[];
  location: string;
  enablerScore: number;
  sessionCount: number;
  rating: number;
  reRequestRate: number;
  bio: string;
  creditRate: number;
  badgeLevel: string;
  availability: Record<string, unknown>;
}>;

// ─── 타입 ────────────────────────────────────────────────────────────────────

type StatusFilter = "all" | "pending" | "approved" | "suspended";

type EnablerRow = (typeof ALL_ENABLERS_BASE)[number];

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function statusLabel(status: string) {
  if (status === "pending") return "심사 대기";
  if (status === "approved") return "승인";
  if (status === "suspended") return "정지";
  return status;
}

function statusColor(status: string): React.CSSProperties {
  if (status === "pending")
    return {
      background: "rgba(245,158,11,0.15)",
      color: "var(--color-amber)",
      border: "1px solid rgba(245,158,11,0.3)",
    };
  if (status === "approved")
    return {
      background: "rgba(34,197,94,0.12)",
      color: "var(--color-green)",
      border: "1px solid rgba(34,197,94,0.25)",
    };
  return {
    background: "rgba(239,68,68,0.12)",
    color: "var(--color-red)",
    border: "1px solid rgba(239,68,68,0.25)",
  };
}

function renderStars(rating: number) {
  if (!rating) return <span style={{ color: "var(--color-dim)" }}>—</span>;
  return (
    <span style={{ color: "var(--color-gold)", fontSize: 14, whiteSpace: "nowrap" as const }}>
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
      <span
        style={{
          color: "var(--color-dim)",
          fontSize: 13,
          marginLeft: 4,
          fontFamily: "var(--font-mono)",
        }}
      >
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

function notifyBackend() {
  alert("백엔드 연동 후 처리됩니다.");
}

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────

export default function AdminEnablersPage() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>(
    {}
  );

  // 로컬 상태 오버라이드 적용
  const allEnablers = ALL_ENABLERS_BASE.map((e) =>
    localStatuses[e.userId] ? { ...e, status: localStatuses[e.userId] } : e
  );

  // 필터 + 검색
  const filtered = allEnablers.filter((e) => {
    const matchStatus = filter === "all" || e.status === filter;
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      e.fullName.toLowerCase().includes(q) ||
      e.specialties.some((s) => s.toLowerCase().includes(q));
    return matchStatus && matchQuery;
  });

  // 카운트
  const counts = {
    all: allEnablers.length,
    pending: allEnablers.filter((e) => e.status === "pending").length,
    approved: allEnablers.filter((e) => e.status === "approved").length,
    suspended: allEnablers.filter((e) => e.status === "suspended").length,
  };

  function handleAction(userId: string, action: "approve" | "reject" | "suspend" | "restore") {
    notifyBackend();
    // 미리보기용 로컬 상태 전환
    if (action === "approve") setLocalStatuses((p) => ({ ...p, [userId]: "approved" }));
    if (action === "reject") setLocalStatuses((p) => ({ ...p, [userId]: "suspended" }));
    if (action === "suspend") setLocalStatuses((p) => ({ ...p, [userId]: "suspended" }));
    if (action === "restore") setLocalStatuses((p) => ({ ...p, [userId]: "approved" }));
  }

  const TABS: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "전체" },
    { key: "pending", label: "심사 대기" },
    { key: "approved", label: "승인" },
    { key: "suspended", label: "정지" },
  ];

  return (
    <div
      style={{
        padding: "32px 36px",
        minHeight: "100vh",
        background: "var(--color-black)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* ── 헤더 ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 700,
              color: "var(--color-text)",
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            Enabler 관리
          </h1>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 15,
              color: "var(--color-dim)",
              fontFamily: "var(--font-mono)",
            }}
          >
            총 {allEnablers.length}명
          </p>
        </div>

        {/* 검색 */}
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-dim)",
              fontSize: 16,
              pointerEvents: "none",
            }}
          >
            ⌕
          </span>
          <input
            type="text"
            placeholder="이름 또는 전문 분야 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              background: "var(--color-dark)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              padding: "9px 14px 9px 34px",
              color: "var(--color-text)",
              fontFamily: "var(--font-body)",
              fontSize: 15,
              width: 260,
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              (e.target as HTMLInputElement).style.borderColor =
                "var(--color-accent)";
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor =
                "var(--color-border)";
            }}
          />
        </div>
      </div>

      {/* ── 상태 필터 탭 ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        {TABS.map((tab) => {
          const active = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 20,
                border: active
                  ? "1px solid rgba(163,230,53,0.4)"
                  : "1px solid var(--color-border)",
                background: active
                  ? "rgba(163,230,53,0.1)"
                  : "var(--color-dark)",
                color: active ? "var(--color-accent)" : "var(--color-dim)",
                fontSize: 15,
                fontFamily: "var(--font-body)",
                fontWeight: active ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
              <span
                style={{
                  background: active
                    ? "rgba(163,230,53,0.2)"
                    : "rgba(255,255,255,0.06)",
                  color: active ? "var(--color-accent)" : "var(--color-dim)",
                  borderRadius: 10,
                  padding: "1px 7px",
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                }}
              >
                {counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 테이블 ── */}
      <div
        style={{
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* 테이블 헤더 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.4fr 90px 90px 130px 120px 190px",
            padding: "10px 20px",
            borderBottom: "1px solid var(--color-border)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {["이름 / 소속", "전문 분야", "스코어", "세션", "평점", "상태", "액션"].map(
            (h) => (
              <span
                key={h}
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {h}
              </span>
            )
          )}
        </div>

        {/* 테이블 바디 */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              color: "var(--color-dim)",
              fontSize: 16,
            }}
          >
            검색 결과가 없습니다.
          </div>
        ) : (
          filtered.map((enabler, idx) => (
            <EnablerRow
              key={enabler.userId}
              enabler={enabler}
              isLast={idx === filtered.length - 1}
              expanded={expandedId === enabler.userId}
              onToggleExpand={() =>
                setExpandedId(
                  expandedId === enabler.userId ? null : enabler.userId
                )
              }
              onAction={handleAction}
            />
          ))
        )}
      </div>

      {/* 결과 수 */}
      {filtered.length > 0 && (
        <p
          style={{
            marginTop: 14,
            fontSize: 14,
            color: "var(--color-dim)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {filtered.length}명 표시 중
        </p>
      )}
    </div>
  );
}

// ─── 행 컴포넌트 ──────────────────────────────────────────────────────────────

function EnablerRow({
  enabler,
  isLast,
  expanded,
  onToggleExpand,
  onAction,
}: {
  enabler: EnablerRow;
  isLast: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onAction: (userId: string, action: "approve" | "reject" | "suspend" | "restore") => void;
}) {
  return (
    <>
      {/* 메인 행 */}
      <div
        style={{
          borderBottom: isLast && !expanded ? "none" : "1px solid var(--color-border)",
          transition: "background 0.1s",
        }}
      >
        <div
          onClick={onToggleExpand}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.4fr 90px 90px 130px 120px 190px",
            padding: "14px 20px",
            alignItems: "center",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background =
              "rgba(255,255,255,0.025)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = "transparent";
          }}
        >
          {/* 이름 / 소속 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar
              url={enabler.avatarUrl}
              initial={enabler.avatarInitial}
              size={36}
            />
            <div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "var(--color-text)",
                  lineHeight: 1.3,
                }}
              >
                {enabler.fullName}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--color-dim)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {enabler.university} · {enabler.degreeType}
              </div>
            </div>
          </div>

          {/* 전문 분야 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {enabler.specialties.slice(0, 2).map((s) => (
              <span
                key={s}
                style={{
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  padding: "2px 8px",
                  fontSize: 13,
                  color: "var(--color-dim)",
                  whiteSpace: "nowrap",
                }}
              >
                {s}
              </span>
            ))}
            {enabler.specialties.length > 2 && (
              <span
                style={{
                  fontSize: 13,
                  color: "var(--color-dim)",
                  alignSelf: "center",
                }}
              >
                +{enabler.specialties.length - 2}
              </span>
            )}
          </div>

          {/* 스코어 */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 16,
              fontWeight: 600,
              color:
                enabler.enablerScore >= 90
                  ? "var(--color-accent)"
                  : enabler.enablerScore > 0
                  ? "var(--color-text)"
                  : "var(--color-dim)",
            }}
          >
            {enabler.enablerScore > 0 ? enabler.enablerScore : "—"}
          </div>

          {/* 세션 */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 16,
              color:
                enabler.sessionCount > 0
                  ? "var(--color-text)"
                  : "var(--color-dim)",
            }}
          >
            {enabler.sessionCount > 0 ? enabler.sessionCount : "—"}
          </div>

          {/* 평점 */}
          <div>{renderStars(enabler.rating)}</div>

          {/* 상태 배지 */}
          <div>
            <span
              style={{
                ...statusColor(enabler.status),
                padding: "3px 10px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-mono)",
                whiteSpace: "nowrap",
              }}
            >
              {statusLabel(enabler.status)}
            </span>
          </div>

          {/* 액션 버튼 */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", gap: 6 }}
          >
            <ActionButtons
              status={enabler.status}
              userId={enabler.userId}
              onAction={onAction}
            />
          </div>
        </div>

        {/* 확장 상세 */}
        {expanded && (
          <div
            style={{
              padding: "0 20px 18px 66px",
              borderTop: "1px solid rgba(255,255,255,0.04)",
              background: "rgba(255,255,255,0.015)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 24,
                paddingTop: 14,
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 15,
                    color: "var(--color-text)",
                    lineHeight: 1.7,
                  }}
                >
                  {enabler.bio}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    fontSize: 14,
                    color: "var(--color-dim)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <span>📍 {enabler.location}</span>
                  <span>크레딧 {enabler.creditRate}개/회</span>
                  {enabler.reRequestRate > 0 && (
                    <span>재요청률 {enabler.reRequestRate}%</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── 아바타 ───────────────────────────────────────────────────────────────────

function Avatar({
  url,
  initial,
  size,
}: {
  url: string;
  initial: string;
  size: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--color-dark)",
        border: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        color: "var(--color-dim)",
        fontFamily: "var(--font-display)",
      }}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={initial}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        initial
      )}
    </div>
  );
}

// ─── 액션 버튼 ────────────────────────────────────────────────────────────────

function ActionButtons({
  status,
  userId,
  onAction,
}: {
  status: string;
  userId: string;
  onAction: (userId: string, action: "approve" | "reject" | "suspend" | "restore") => void;
}) {
  const btnBase: React.CSSProperties = {
    padding: "5px 11px",
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "var(--font-body)",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
    border: "1px solid transparent",
    whiteSpace: "nowrap",
  };

  if (status === "pending") {
    return (
      <>
        <button
          onClick={() => onAction(userId, "approve")}
          style={{
            ...btnBase,
            background: "rgba(163,230,53,0.15)",
            color: "var(--color-accent)",
            borderColor: "rgba(163,230,53,0.35)",
          }}
        >
          승인
        </button>
        <button
          onClick={() => onAction(userId, "reject")}
          style={{
            ...btnBase,
            background: "transparent",
            color: "var(--color-red)",
            borderColor: "rgba(239,68,68,0.3)",
          }}
        >
          거절
        </button>
      </>
    );
  }

  if (status === "approved") {
    return (
      <>
        <button
          onClick={() => alert("백엔드 연동 후 프로필 페이지로 이동합니다.")}
          style={{
            ...btnBase,
            background: "transparent",
            color: "var(--color-dim)",
            borderColor: "var(--color-border)",
          }}
        >
          프로필 보기
        </button>
        <button
          onClick={() => onAction(userId, "suspend")}
          style={{
            ...btnBase,
            background: "transparent",
            color: "var(--color-red)",
            borderColor: "rgba(239,68,68,0.3)",
          }}
        >
          정지
        </button>
      </>
    );
  }

  if (status === "suspended") {
    return (
      <button
        onClick={() => onAction(userId, "restore")}
        style={{
          ...btnBase,
          background: "transparent",
          color: "var(--color-green)",
          borderColor: "rgba(34,197,94,0.3)",
        }}
      >
        복원
      </button>
    );
  }

  return null;
}
