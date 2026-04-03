"use client";

import { useState } from "react";
import {
  ORGANIZATIONS,
  STARTUP_CREDITS,
  CREDIT_TRANSACTIONS,
} from "@/lib/constants/mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

type CreditStatus = "active" | "low" | "depleted";

type TxType =
  | "purchase"
  | "allocate"
  | "hold"
  | "confirm"
  | "release"
  | "refund";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  CreditStatus,
  { label: string; color: string }
> = {
  active: { label: "정상", color: "var(--color-green)" },
  low: { label: "부족", color: "var(--color-amber)" },
  depleted: { label: "소진", color: "var(--color-red)" },
};

const TX_TYPE_LABEL: Record<TxType, string> = {
  purchase: "구매",
  allocate: "배분",
  hold: "홀드",
  confirm: "확정",
  release: "반환",
  refund: "환불",
};

const TX_TYPE_COLOR: Record<TxType, string> = {
  purchase: "var(--color-blue)",
  allocate: "var(--color-green)",
  hold: "var(--color-amber)",
  confirm: "var(--color-red)",
  release: "var(--color-green)",
  refund: "var(--color-amber)",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function ColLabel({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        fontSize: "14px",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        color: "var(--color-dim)",
        padding: "10px 16px",
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

function KpiCard({
  label,
  value,
  unit,
  sub,
  subColor,
  valueColor,
}: {
  label: string;
  value: number | string;
  unit?: string;
  sub?: string;
  subColor?: string;
  valueColor?: string;
}) {
  return (
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
          fontSize: "15px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-dim)",
          marginBottom: "10px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "28px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          color: valueColor ?? "var(--color-text)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "6px",
        }}
      >
        {value}
        {unit && (
          <span
            style={{
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--color-dim)",
              marginLeft: "3px",
            }}
          >
            {unit}
          </span>
        )}
      </p>
      {sub && (
        <p
          style={{
            fontSize: "14px",
            fontFamily: "var(--font-body)",
            color: subColor ?? "var(--color-dim)",
            fontWeight: 500,
          }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function OrgCreditsPage() {
  const [selectedStartupIndex, setSelectedStartupIndex] = useState<
    number | null
  >(null);
  const [allocateAmount, setAllocateAmount] = useState("");

  const org = ORGANIZATIONS[0];

  const totalAllocated = STARTUP_CREDITS.reduce(
    (sum, s) => sum + s.allocated,
    0
  );
  const totalUsed = STARTUP_CREDITS.reduce((sum, s) => sum + s.used, 0);
  const totalRemaining = org.totalCredits - totalAllocated;
  const remainingPct = (totalRemaining / org.totalCredits) * 100;

  const remainingColor =
    remainingPct > 20
      ? "var(--color-green)"
      : remainingPct > 5
        ? "var(--color-amber)"
        : "var(--color-red)";

  function handleAllocateOpen(index: number) {
    setSelectedStartupIndex(index === selectedStartupIndex ? null : index);
    setAllocateAmount("");
  }

  function handleAllocateConfirm() {
    alert("백엔드 연동 후 배분됩니다");
    setSelectedStartupIndex(null);
    setAllocateAmount("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-black)",
        fontFamily: "var(--font-body)",
        padding: "28px 32px 56px",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "28px",
        }}
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
            크레딧 관리
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--color-dim)",
              fontFamily: "var(--font-body)",
              lineHeight: 1.4,
            }}
          >
            {org.name} · {org.programName}
          </p>
        </div>

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
          onClick={() => alert("백엔드 연동 후 구매 기능이 제공됩니다")}
        >
          크레딧 구매
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        <KpiCard
          label="총 크레딧"
          value={org.totalCredits}
          unit="C"
          sub="프로그램 전체 구매량"
          subColor="var(--color-dim)"
        />
        <KpiCard
          label="배분 완료"
          value={totalAllocated}
          unit="C"
          sub={`${STARTUP_CREDITS.length}개 스타트업에 배분`}
          subColor="var(--color-blue)"
        />
        <KpiCard
          label="사용됨"
          value={totalUsed}
          unit="C"
          sub={`사용률 ${Math.round((totalUsed / totalAllocated) * 100)}%`}
          subColor="var(--color-dim)"
        />
        <KpiCard
          label="잔여 (미배분)"
          value={totalRemaining}
          unit="C"
          sub={`전체의 ${Math.round(remainingPct)}%`}
          subColor={remainingColor}
          valueColor={remainingColor}
        />
      </div>

      {/* ── Credit Allocation Table ── */}
      <div
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        {/* Table header */}
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
            스타트업별 크레딧 배분 현황
          </p>
          <span
            style={{
              fontSize: "15px",
              fontFamily: "var(--font-body)",
              color: "var(--color-dim)",
            }}
          >
            {STARTUP_CREDITS.length}개 스타트업
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <ColLabel>스타트업</ColLabel>
                <ColLabel>배분</ColLabel>
                <ColLabel>사용</ColLabel>
                <ColLabel>잔여</ColLabel>
                <ColLabel>상태</ColLabel>
                <ColLabel>액션</ColLabel>
              </tr>
            </thead>
            <tbody>
              {STARTUP_CREDITS.map((startup, i) => {
                const status = STATUS_CONFIG[startup.status as CreditStatus];
                const usagePct = Math.round(
                  (startup.used / startup.allocated) * 100
                );
                const isExpanded = selectedStartupIndex === i;

                return (
                  <>
                    <tr
                      key={startup.name}
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        transition: "background-color 0.1s",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.backgroundColor =
                          "oklch(0.24 0.008 280 / 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLTableRowElement
                        ).style.backgroundColor = "transparent";
                      }}
                    >
                      {/* 스타트업 이름 + 진행바 */}
                      <td
                        style={{
                          padding: "14px 16px 10px",
                          minWidth: "160px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "15px",
                            fontFamily: "var(--font-body)",
                            fontWeight: 600,
                            color: "var(--color-text)",
                            marginBottom: "6px",
                            lineHeight: 1.3,
                          }}
                        >
                          {startup.name}
                        </p>
                        {/* Progress bar */}
                        <div
                          style={{
                            height: "4px",
                            borderRadius: "2px",
                            backgroundColor: "var(--color-border)",
                            overflow: "hidden",
                            width: "120px",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${usagePct}%`,
                              backgroundColor:
                                usagePct >= 100
                                  ? "var(--color-red)"
                                  : usagePct >= 80
                                    ? "var(--color-amber)"
                                    : "var(--color-accent)",
                              borderRadius: "2px",
                              transition: "width 0.3s ease",
                            }}
                          />
                        </div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontFamily: "var(--font-mono)",
                            color: "var(--color-dim)",
                            marginTop: "3px",
                            lineHeight: 1.3,
                          }}
                        >
                          {usagePct}% 사용
                        </p>
                      </td>

                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "15px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-dim)",
                          verticalAlign: "top",
                        }}
                      >
                        {startup.allocated}C
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "15px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-dim)",
                          verticalAlign: "top",
                        }}
                      >
                        {startup.used}C
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: "15px",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color:
                            startup.remaining === 0
                              ? "var(--color-red)"
                              : startup.remaining <= 3
                                ? "var(--color-amber)"
                                : "var(--color-text)",
                          verticalAlign: "top",
                        }}
                      >
                        {startup.remaining}C
                      </td>
                      <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
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
                      <td style={{ padding: "14px 16px", verticalAlign: "top" }}>
                        <button
                          onClick={() => handleAllocateOpen(i)}
                          style={{
                            padding: "5px 11px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontFamily: "var(--font-display)",
                            fontWeight: 600,
                            backgroundColor: "transparent",
                            border: "1px solid var(--color-border)",
                            color: isExpanded
                              ? "var(--color-accent)"
                              : "var(--color-text)",
                            borderColor: isExpanded
                              ? "var(--color-accent)"
                              : "var(--color-border)",
                            cursor: "pointer",
                            transition: "all 0.15s",
                            lineHeight: 1.4,
                          }}
                          onMouseEnter={(e) => {
                            if (!isExpanded) {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.borderColor =
                                "oklch(0.91 0.2 110 / 0.5)";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "var(--color-accent)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isExpanded) {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.borderColor = "var(--color-border)";
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.color = "var(--color-text)";
                            }
                          }}
                        >
                          {isExpanded ? "닫기" : "추가 배분"}
                        </button>
                      </td>
                    </tr>

                    {/* Inline allocation form */}
                    {isExpanded && (
                      <tr
                        key={`${startup.name}-form`}
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <td
                          colSpan={6}
                          style={{
                            padding: "0",
                            backgroundColor: "oklch(0.18 0.01 280 / 0.6)",
                          }}
                        >
                          <div
                            style={{
                              padding: "16px 20px",
                              borderLeft: "3px solid var(--color-accent)",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "14px",
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                color: "var(--color-accent)",
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                                marginBottom: "12px",
                              }}
                            >
                              {startup.name} — 추가 크레딧 배분
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                              }}
                            >
                              <label
                                style={{
                                  fontSize: "14px",
                                  fontFamily: "var(--font-body)",
                                  color: "var(--color-dim)",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                배분할 크레딧 수
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={totalRemaining}
                                placeholder="0"
                                value={allocateAmount}
                                onChange={(e) =>
                                  setAllocateAmount(e.target.value)
                                }
                                style={{
                                  width: "96px",
                                  padding: "7px 10px",
                                  borderRadius: "6px",
                                  border: "1px solid var(--color-border)",
                                  backgroundColor: "var(--color-dark)",
                                  color: "var(--color-text)",
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "15px",
                                  fontWeight: 700,
                                  outline: "none",
                                }}
                              />
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontFamily: "var(--font-body)",
                                  color: "var(--color-dim)",
                                }}
                              >
                                (미배분 잔여: {totalRemaining}C)
                              </span>
                              <button
                                onClick={handleAllocateConfirm}
                                disabled={
                                  !allocateAmount ||
                                  Number(allocateAmount) <= 0 ||
                                  Number(allocateAmount) > totalRemaining
                                }
                                style={{
                                  padding: "7px 14px",
                                  borderRadius: "6px",
                                  fontSize: "14px",
                                  fontFamily: "var(--font-display)",
                                  fontWeight: 700,
                                  backgroundColor:
                                    !allocateAmount ||
                                    Number(allocateAmount) <= 0 ||
                                    Number(allocateAmount) > totalRemaining
                                      ? "oklch(0.91 0.2 110 / 0.3)"
                                      : "var(--color-accent)",
                                  border: "none",
                                  color: "oklch(0.1 0 0)",
                                  cursor:
                                    !allocateAmount ||
                                    Number(allocateAmount) <= 0 ||
                                    Number(allocateAmount) > totalRemaining
                                      ? "not-allowed"
                                      : "pointer",
                                  transition: "opacity 0.15s",
                                  lineHeight: 1.4,
                                }}
                              >
                                확인
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStartupIndex(null);
                                  setAllocateAmount("");
                                }}
                                style={{
                                  padding: "7px 14px",
                                  borderRadius: "6px",
                                  fontSize: "14px",
                                  fontFamily: "var(--font-display)",
                                  fontWeight: 600,
                                  backgroundColor: "transparent",
                                  border: "1px solid var(--color-border)",
                                  color: "var(--color-dim)",
                                  cursor: "pointer",
                                  transition: "border-color 0.15s, color 0.15s",
                                  lineHeight: 1.4,
                                }}
                                onMouseEnter={(e) => {
                                  (
                                    e.currentTarget as HTMLButtonElement
                                  ).style.borderColor = "var(--color-text)";
                                  (
                                    e.currentTarget as HTMLButtonElement
                                  ).style.color = "var(--color-text)";
                                }}
                                onMouseLeave={(e) => {
                                  (
                                    e.currentTarget as HTMLButtonElement
                                  ).style.borderColor = "var(--color-border)";
                                  (
                                    e.currentTarget as HTMLButtonElement
                                  ).style.color = "var(--color-dim)";
                                }}
                              >
                                취소
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        {/* Section header */}
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
            거래 내역
          </p>
          <span
            style={{
              fontSize: "15px",
              fontFamily: "var(--font-body)",
              color: "var(--color-dim)",
            }}
          >
            최근 {CREDIT_TRANSACTIONS.length}건
          </span>
        </div>

        {/* Transaction list */}
        <div style={{ padding: "4px 0" }}>
          {[...CREDIT_TRANSACTIONS].reverse().map((tx, i) => {
            const txType = tx.txType as TxType;
            const typeLabel = TX_TYPE_LABEL[txType] ?? tx.txType;
            const typeColor = TX_TYPE_COLOR[txType] ?? "var(--color-dim)";
            const isPositive = tx.amount > 0;

            return (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderBottom:
                    i < CREDIT_TRANSACTIONS.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                  transition: "background-color 0.1s",
                  gap: "12px",
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
                {/* Left: date + type badge + description */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  {/* Date */}
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--color-dim)",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {tx.createdAt}
                  </span>

                  {/* Type badge */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: typeColor,
                      backgroundColor: `color-mix(in oklch, ${typeColor} 12%, transparent)`,
                      border: `1px solid color-mix(in oklch, ${typeColor} 25%, transparent)`,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {typeLabel}
                  </span>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "15px",
                      fontFamily: "var(--font-body)",
                      color: "var(--color-text)",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      minWidth: 0,
                    }}
                  >
                    {tx.description}
                  </p>
                </div>

                {/* Right: amount */}
                <span
                  style={{
                    fontSize: "16px",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: isPositive
                      ? "var(--color-green)"
                      : "var(--color-red)",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {isPositive ? "+" : ""}
                  {tx.amount}C
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
