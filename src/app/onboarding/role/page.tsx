"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";
import type { UserRole, DbUser, DbStartupProfile, DbEnablerProfile } from "@/lib/db/types";

type Role = Extract<UserRole, "startup" | "enabler" | "org_admin">;

interface RoleCard {
  key: Role;
  icon: string;
  title: string;
  desc: string;
  sub: string;
}

const ROLE_CARDS: RoleCard[] = [
  {
    key: "startup",
    icon: "🚀",
    title: "Startup",
    desc: "한국 스타트업의 미국 진출",
    sub: "Market Enabler와 매칭되어 실전 실행",
  },
  {
    key: "enabler",
    icon: "⚡",
    title: "Enabler",
    desc: "미국 현지에서 실전으로 돕는 MBA",
    sub: "프로필 만들기 → 승인 후 세션 시작",
  },
  {
    key: "org_admin",
    icon: "🏢",
    title: "Organization",
    desc: "액셀러레이터 · VC · 기관",
    sub: "크레딧 대량 구매 → 스타트업 배분",
  },
];

const ROLE_DEFAULTS: Record<Role, string> = {
  startup: "/my",
  enabler: "/my",
  org_admin: "/org/dashboard",
};

export default function OnboardingRolePage() {
  const router = useRouter();
  const toast = useToast();

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [fullName, setFullName] = useState("");
  const [extraField, setExtraField] = useState("");
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        router.replace("/login");
        return;
      }

      // 이미 users 레코드가 있으면 바로 대시보드로
      const { data: profile } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", auth.user.id)
        .single<{ id: string; role: string }>();

      if (profile) {
        router.replace(ROLE_DEFAULTS[profile.role as Role] ?? "/my");
        return;
      }

      // Google metadata에서 이름 파싱
      const meta = auth.user.user_metadata;
      const name =
        meta?.full_name ||
        meta?.name ||
        auth.user.email?.split("@")[0] ||
        "";
      setFullName(name);
      setInitializing(false);
    }
    init();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRole) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Not authenticated");

      // Supabase Database 타입이 insert 오버로드를 never로 추론하는 문제 — 프로젝트 전체 관행
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;

      const { error: userError } = await db.from("users").insert({
        id: auth.user.id,
        email: auth.user.email!,
        full_name: fullName,
        role: selectedRole as UserRole,
        is_verified: auth.user.email_confirmed_at !== null,
      } satisfies Partial<DbUser> & { id: string; email: string; full_name: string });

      if (userError) throw userError;

      // role별 profile 테이블 insert
      if (selectedRole === "startup") {
        await db.from("startup_profiles").insert({
          user_id: auth.user.id,
          company_name: extraField,
        } satisfies Partial<DbStartupProfile> & { user_id: string });
      } else if (selectedRole === "enabler") {
        await db.from("enabler_profiles").insert({
          user_id: auth.user.id,
          university: extraField,
        } satisfies Partial<DbEnablerProfile> & { user_id: string });
      }
      // org_admin은 별도 초대 플로우에서 처리

      toast.success("환영합니다! Get It Done at Work를 시작해보세요.");
      router.push(ROLE_DEFAULTS[selectedRole]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "오류가 발생했습니다.";
      toast.error(message);
      setLoading(false);
    }
  }

  const extraLabel: Record<Role, string | null> = {
    startup: "회사명",
    enabler: "학교명",
    org_admin: "기관명",
  };
  const extraPlaceholder: Record<Role, string> = {
    startup: "Acme Corp",
    enabler: "Wharton School",
    org_admin: "500 Global",
  };

  if (initializing) {
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
        <div style={{ color: "var(--color-dim)", fontSize: "14px", fontFamily: "var(--font-body)" }}>
          로딩 중...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-black)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "48px 24px",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* 워드마크 */}
      <div style={{ marginBottom: "48px", animation: "var(--animate-fade-in)" }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "15px",
            color: "var(--color-text)",
            letterSpacing: "-0.02em",
          }}
        >
          Get It Done at Work
        </span>
      </div>

      <div style={{ width: "100%", maxWidth: "640px" }}>
        {/* 헤딩 */}
        <div style={{ textAlign: "center", marginBottom: "40px", animation: "var(--animate-slide-up)" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "28px",
              color: "var(--color-text)",
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: "10px",
            }}
          >
            역할을 선택하세요
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-dim)", lineHeight: 1.6 }}>
            당신이 어떤 목적으로 Get It Done at Work를 사용할지 알려주세요
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 역할 카드 그리드 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
              marginBottom: "32px",
            }}
          >
            {ROLE_CARDS.map((card) => {
              const active = selectedRole === card.key;
              return (
                <button
                  key={card.key}
                  type="button"
                  onClick={() => {
                    setSelectedRole(card.key);
                    setExtraField("");
                  }}
                  style={{
                    padding: "22px 18px",
                    borderRadius: "var(--radius-xl)",
                    border: `1.5px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                    backgroundColor: active
                      ? "oklch(0.91 0.2 110 / 0.07)"
                      : "var(--color-card)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.18s ease",
                    boxShadow: active ? "0 0 0 1px oklch(0.91 0.2 110 / 0.2)" : "none",
                  }}
                >
                  <div style={{ fontSize: "28px", marginBottom: "12px" }}>{card.icon}</div>
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "15px",
                      color: active ? "var(--color-accent)" : "var(--color-text)",
                      marginBottom: "6px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {card.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--color-dim)", lineHeight: 1.5, marginBottom: "8px" }}>
                    {card.desc}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: active ? "oklch(0.75 0.12 110)" : "oklch(0.4 0.005 280)",
                      lineHeight: 1.5,
                    }}
                  >
                    {card.sub}
                  </p>
                </button>
              );
            })}
          </div>

          {/* 이름 + 추가 필드 (역할 선택 후 표시) */}
          {selectedRole && (
            <div
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-xl)",
                padding: "24px",
                marginBottom: "24px",
                animation: "var(--animate-slide-up)",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    color: "var(--color-dim)",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  이름
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="홍길동"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "oklch(0.14 0.005 280 / 0.5)",
                    color: "var(--color-text)",
                    fontSize: "14px",
                    fontFamily: "var(--font-body)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {extraLabel[selectedRole] && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      color: "var(--color-dim)",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {extraLabel[selectedRole]}
                    {selectedRole !== "org_admin" && (
                      <span style={{ color: "var(--color-accent)", marginLeft: "2px" }}>*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={extraField}
                    onChange={(e) => setExtraField(e.target.value)}
                    required={selectedRole !== "org_admin"}
                    placeholder={extraPlaceholder[selectedRole]}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "var(--radius-lg)",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "oklch(0.14 0.005 280 / 0.5)",
                      color: "var(--color-text)",
                      fontSize: "14px",
                      fontFamily: "var(--font-body)",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={!selectedRole || loading}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: "var(--radius-lg)",
              backgroundColor: selectedRole ? "var(--color-accent)" : "oklch(0.22 0.006 280)",
              color: selectedRole ? "oklch(0.1 0 0)" : "var(--color-dim)",
              fontSize: "14px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              border: "none",
              cursor: selectedRole && !loading ? "pointer" : "not-allowed",
              letterSpacing: "-0.01em",
              transition: "all 0.15s ease",
              boxShadow: selectedRole ? "var(--shadow-accent)" : "none",
              opacity: loading ? 0.65 : 1,
            }}
          >
            {loading ? "처리 중..." : "시작하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
