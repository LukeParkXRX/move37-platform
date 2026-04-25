"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import type { DbBooking, DbCreditTransaction, DbEnablerProfile } from "@/lib/db/types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "승인 대기 중", color: "var(--color-amber)", bg: "oklch(0.78 0.15 75 / 0.1)" },
  approved: { label: "활동 중", color: "var(--color-accent)", bg: "var(--color-accent-dim)" },
  suspended: { label: "활동 정지", color: "var(--color-red)", bg: "rgba(239,68,68,0.1)" },
};

const SESSION_TYPE_LABEL: Record<string, string> = {
  standard: "스탠다드",
  chemistry: "케미스트리",
  project: "프로젝트",
};

function KpiCard({ label, value, suffix, color }: {
  label: string;
  value: number | string;
  suffix?: string;
  color: string;
}) {
  return (
    <div style={{
      backgroundColor: "var(--color-card)",
      border: "1px solid var(--color-border)",
      borderRadius: "12px",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      <span style={{
        fontSize: "13px",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--color-dim)",
      }}>{label}</span>
      <span style={{
        fontSize: "32px",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        color,
        lineHeight: 1,
      }}>
        {value}
        {suffix && (
          <span style={{ fontSize: "16px", fontFamily: "var(--font-display)", fontWeight: 600, marginLeft: "4px", opacity: 0.7 }}>
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}

export default function EnablerDashboardPage() {
  const { user, profile, loading } = useAuth();

  const [enablerProfile, setEnablerProfile] = useState<DbEnablerProfile | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<DbBooking[]>([]);
  const [pendingRequests, setPendingRequests] = useState<DbBooking[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

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

        const { data: ep } = await db
          .from("enabler_profiles")
          .select("*")
          .eq("user_id", user!.id)
          .single();
        setEnablerProfile(ep ?? null);

        const nowIso = new Date().toISOString();

        const { data: upcoming } = await db
          .from("bookings")
          .select("*")
          .eq("enabler_id", user!.id)
          .eq("status", "confirmed")
          .gte("scheduled_at", nowIso)
          .order("scheduled_at", { ascending: true })
          .limit(5);
        setUpcomingSessions((upcoming ?? []) as DbBooking[]);

        const { data: pending } = await db
          .from("bookings")
          .select("*")
          .eq("enabler_id", user!.id)
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(5);
        setPendingRequests((pending ?? []) as DbBooking[]);

        const { count } = await db
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("enabler_id", user!.id)
          .eq("status", "completed");
        setCompletedCount(count ?? 0);

        const { data: earnings } = await db
          .from("credit_transactions")
          .select("amount")
          .eq("enabler_id", user!.id)
          .in("tx_type", ["confirm", "use"]);
        const total = (earnings ?? []).reduce(
          (sum: number, t: Pick<DbCreditTransaction, "amount">) => sum + (t.amount ?? 0),
          0,
        );
        setTotalEarnings(total);
      } catch (err) {
        console.error("[enabler-dashboard] fetchData failed:", err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchData();
  }, [user, loading]);

  if (loading || dataLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-black)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ color: "var(--color-dim)", fontSize: "14px", fontFamily: "var(--font-body)" }}>
          불러오는 중...
        </div>
      </div>
    );
  }

  if (!user || !profile) return null;

  const status = enablerProfile?.status ?? "pending";
  const statusCfg = STATUS_LABEL[status] ?? STATUS_LABEL.pending;
  const displayName = profile.full_name || user.email?.split("@")[0] || "Enabler";

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--color-black)",
      color: "var(--color-text)",
      fontFamily: "var(--font-body)",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <p style={{
            fontSize: "13px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent)",
            marginBottom: "8px",
          }}>
            Enabler
          </p>
          <h1 style={{
            fontSize: "28px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            color: "var(--color-text)",
            margin: 0,
            marginBottom: "12px",
          }}>
            안녕하세요, {displayName}님
          </h1>
          <p style={{ color: "var(--color-dim)", fontSize: "15px", lineHeight: 1.6 }}>
            오늘도 한국 스타트업의 미국 진출을 함께 만들어가요.
          </p>
        </div>

        {/* Status banner */}
        <div style={{
          backgroundColor: statusCfg.bg,
          border: `1px solid ${statusCfg.color}`,
          borderRadius: "12px",
          padding: "16px 20px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          <span style={{
            display: "inline-block",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: statusCfg.color,
          }} />
          <div style={{ flex: 1 }}>
            <p style={{
              fontSize: "13px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: statusCfg.color,
              marginBottom: "2px",
            }}>
              프로필 {statusCfg.label}
            </p>
            <p style={{ color: "var(--color-dim)", fontSize: "13px" }}>
              {status === "pending" && "운영팀에서 검토 중입니다. 승인 완료 시 알림을 드립니다."}
              {status === "approved" && `${enablerProfile?.university || "—"} · ${enablerProfile?.specialties?.join(" · ") || ""}`}
              {status === "suspended" && "현재 활동이 일시 중단된 상태입니다. 운영팀에 문의해주세요."}
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}>
          <KpiCard label="대기 중인 요청" value={pendingRequests.length} color="var(--color-amber)" />
          <KpiCard label="예정된 세션" value={upcomingSessions.length} color="var(--color-blue)" />
          <KpiCard label="완료한 세션" value={completedCount} suffix="회" color="var(--color-text)" />
          <KpiCard label="누적 수익" value={totalEarnings} suffix="C" color="var(--color-accent)" />
        </div>

        {/* Pending requests */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "16px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            marginBottom: "12px",
          }}>
            새 매칭 요청
          </h2>
          {pendingRequests.length === 0 ? (
            <div style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "32px 24px",
              textAlign: "center",
              color: "var(--color-dim)",
              fontSize: "14px",
            }}>
              아직 새 요청이 없어요. 프로필이 승인되면 매칭이 시작됩니다.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {pendingRequests.map((b) => (
                <Link
                  key={b.id}
                  href={`/session?id=${b.id}`}
                  style={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textDecoration: "none",
                    color: "var(--color-text)",
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>
                      {SESSION_TYPE_LABEL[b.type] ?? b.type} 요청
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--color-dim)" }}>
                      {b.scheduled_at ? formatDate(b.scheduled_at) : "일정 협의 중"}
                    </p>
                  </div>
                  <span style={{ color: "var(--color-accent)", fontSize: "14px" }}>→</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Upcoming sessions */}
        <section style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "16px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            marginBottom: "12px",
          }}>
            다가오는 세션
          </h2>
          {upcomingSessions.length === 0 ? (
            <div style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "12px",
              padding: "32px 24px",
              textAlign: "center",
              color: "var(--color-dim)",
              fontSize: "14px",
            }}>
              예정된 세션이 없어요.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {upcomingSessions.map((b) => (
                <div key={b.id} style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "10px",
                  padding: "14px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>
                      {SESSION_TYPE_LABEL[b.type] ?? b.type}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--color-dim)" }}>
                      {b.scheduled_at ? formatDate(b.scheduled_at) : "—"}
                    </p>
                  </div>
                  <Link href="/meeting" style={{
                    fontSize: "13px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    color: "var(--color-accent)",
                    textDecoration: "none",
                  }}>
                    화상채팅 입장 →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Quick links */}
        <section>
          <h2 style={{
            fontSize: "16px",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            marginBottom: "12px",
          }}>
            빠른 메뉴
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "12px",
          }}>
            <Link href="/settings" style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              padding: "16px",
              textDecoration: "none",
              color: "var(--color-text)",
            }}>
              <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>프로필 편집</p>
              <p style={{ fontSize: "12px", color: "var(--color-dim)" }}>전공·전문 분야·요율 업데이트</p>
            </Link>
            <Link href="/session" style={{
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "10px",
              padding: "16px",
              textDecoration: "none",
              color: "var(--color-text)",
            }}>
              <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>세션 관리</p>
              <p style={{ fontSize: "12px", color: "var(--color-dim)" }}>전체 세션 이력·정산 확인</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
