"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOKINGS, ENABLERS } from "@/lib/constants/mock-data";

type FilterStatus = "all" | "pending" | "confirmed" | "completed" | "cancelled";
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";
type BookingType = "chemistry" | "standard" | "project";

function getEnabler(enablerId: string) {
  return ENABLERS.find((e) => e.userId === enablerId) ?? null;
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "대기중",
  confirmed: "확정",
  completed: "완료",
  cancelled: "취소",
};

const TYPE_LABELS: Record<BookingType, string> = {
  chemistry: "케미스트리",
  standard: "스탠다드",
  project: "프로젝트",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const colorMap: Record<BookingStatus, string> = {
    pending: "var(--color-amber)",
    confirmed: "var(--color-blue)",
    completed: "var(--color-green)",
    cancelled: "var(--color-red)",
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 15,
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: colorMap[status],
        border: `1px solid ${colorMap[status]}`,
        backgroundColor: `color-mix(in oklch, ${colorMap[status]} 12%, transparent)`,
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function TypeBadge({ type }: { type: BookingType }) {
  const colorMap: Record<BookingType, string> = {
    chemistry: "oklch(0.72 0.18 300)",
    standard: "var(--color-blue)",
    project: "var(--color-accent)",
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 6,
        fontSize: 14,
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        letterSpacing: "0.03em",
        color: colorMap[type],
        border: `1px solid ${colorMap[type]}`,
        backgroundColor: `color-mix(in oklch, ${colorMap[type]} 10%, transparent)`,
      }}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

function BookingCard({ booking }: { booking: (typeof BOOKINGS)[number] }) {
  const [hovered, setHovered] = useState(false);
  const enabler = getEnabler(booking.enablerId);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "var(--color-card)",
        border: `1px solid ${hovered ? "var(--color-accent)" : "var(--color-border)"}`,
        borderRadius: 12,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "border-color 0.18s ease",
        cursor: "default",
      }}
    >
      {/* Top row: enabler info + status badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {enabler?.avatarUrl ? (
            <img
              src={enabler.avatarUrl}
              alt={enabler.fullName}
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "var(--color-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: 16,
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                color: "var(--color-accent)",
              }}
            >
              {enabler?.avatarInitial ?? "?"}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--color-text)",
                lineHeight: 1.2,
              }}
            >
              {enabler?.fullName ?? "알 수 없음"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 16,
                color: "var(--color-dim)",
                lineHeight: 1.2,
              }}
            >
              {enabler?.university ?? ""}
            </span>
          </div>
        </div>
        <StatusBadge status={booking.status as BookingStatus} />
      </div>

      {/* Type badge + date */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <TypeBadge type={booking.type as BookingType} />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 16,
            color: "var(--color-dim)",
          }}
        >
          {formatDate(booking.scheduledAt)}
        </span>
      </div>

      {/* Brief */}
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 17,
          color: "var(--color-text)",
          lineHeight: 1.6,
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {booking.brief}
      </p>

      {/* Footer: credits + action */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 17,
            color: "var(--color-dim)",
          }}
        >
          {booking.creditsAmount} 크레딧
        </span>

        <ActionArea booking={booking} />
      </div>
    </div>
  );
}

function ActionArea({ booking }: { booking: (typeof BOOKINGS)[number] }) {
  const [btnHovered, setBtnHovered] = useState(false);

  if (booking.status === "confirmed" && booking.meetingUrl) {
    return (
      <Link
        href={booking.meetingUrl}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          display: "inline-block",
          padding: "6px 16px",
          borderRadius: 8,
          fontSize: 16,
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          textDecoration: "none",
          backgroundColor: btnHovered ? "oklch(0.82 0.22 130)" : "var(--color-accent)",
          color: "var(--color-black)",
          transition: "background-color 0.15s ease",
          flexShrink: 0,
        }}
      >
        미팅 참여
      </Link>
    );
  }

  if (booking.status === "pending") {
    return (
      <button
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          display: "inline-block",
          padding: "6px 16px",
          borderRadius: 8,
          fontSize: 16,
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          border: `1px solid ${btnHovered ? "var(--color-red)" : "var(--color-border)"}`,
          backgroundColor: btnHovered
            ? "color-mix(in oklch, var(--color-red) 10%, transparent)"
            : "transparent",
          color: btnHovered ? "var(--color-red)" : "var(--color-dim)",
          cursor: "pointer",
          transition: "all 0.15s ease",
          flexShrink: 0,
        }}
      >
        취소
      </button>
    );
  }

  if (booking.status === "completed") {
    return (
      <button
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          display: "inline-block",
          padding: "6px 16px",
          borderRadius: 8,
          fontSize: 16,
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          border: `1px solid ${btnHovered ? "var(--color-accent)" : "var(--color-border)"}`,
          backgroundColor: "transparent",
          color: btnHovered ? "var(--color-accent)" : "var(--color-dim)",
          cursor: "pointer",
          transition: "all 0.15s ease",
          flexShrink: 0,
        }}
      >
        리뷰 작성
      </button>
    );
  }

  if (booking.status === "cancelled" && booking.cancelReason) {
    return (
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: 16,
          color: "var(--color-dim)",
          fontStyle: "italic",
        }}
      >
        {booking.cancelReason}
      </span>
    );
  }

  return null;
}

const FILTER_TABS: { key: FilterStatus; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "pending", label: "대기중" },
  { key: "confirmed", label: "확정" },
  { key: "completed", label: "완료" },
  { key: "cancelled", label: "취소" },
];

export default function BookingsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const countByStatus = BOOKINGS.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});

  const filtered =
    activeFilter === "all"
      ? BOOKINGS
      : BOOKINGS.filter((b) => b.status === activeFilter);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-black)",
        padding: "40px 32px",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: 28,
            color: "var(--color-text)",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          예약 관리
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 16,
            color: "var(--color-dim)",
            marginTop: 6,
            marginBottom: 0,
          }}
        >
          총 {BOOKINGS.length}건의 예약 내역
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 24,
          backgroundColor: "var(--color-dark)",
          borderRadius: 10,
          padding: 4,
          width: "fit-content",
        }}
      >
        {FILTER_TABS.map(({ key, label }) => {
          const isActive = activeFilter === key;
          const count = key === "all" ? BOOKINGS.length : (countByStatus[key] ?? 0);
          return (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontWeight: isActive ? 700 : 500,
                fontSize: 17,
                backgroundColor: isActive ? "var(--color-accent)" : "transparent",
                color: isActive ? "var(--color-black)" : "var(--color-dim)",
                transition: "all 0.15s ease",
              }}
            >
              {label}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  fontSize: 14,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  backgroundColor: isActive
                    ? "color-mix(in oklch, var(--color-black) 20%, transparent)"
                    : "var(--color-card)",
                  color: isActive ? "var(--color-black)" : "var(--color-dim)",
                  padding: "0 4px",
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Booking List */}
      {filtered.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 0",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 40 }}>📭</span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 17,
              color: "var(--color-dim)",
              margin: 0,
            }}
          >
            예약 내역이 없습니다
          </p>
          <Link
            href="/matching"
            style={{
              marginTop: 8,
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 17,
              color: "var(--color-accent)",
              textDecoration: "none",
            }}
          >
            이네이블러 찾아보기 →
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}
