"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { MOCK_CURRENT_USER } from "@/lib/constants/mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormState {
  fullName: string;
  email: string;
  companyName: string;
  industry: string;
  stage: string;
  usGoal: string;
  notifySession: boolean;
  notifyCredit: boolean;
  notifyMarketing: boolean;
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: checked ? "var(--color-accent)" : "var(--color-border)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background-color 0.2s",
        outline: "none",
      }}
      aria-checked={checked}
      role="switch"
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#fff",
          transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: 12,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 17,
          color: "var(--color-text)",
          margin: 0,
          paddingBottom: 16,
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Field row ─────────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 15,
          color: "var(--color-text)",
        }}
      >
        {label}
      </label>
      {children}
      {hint && (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            color: "var(--color-dim)",
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
}

// ── Input styles ──────────────────────────────────────────────────────────────

const inputBaseStyle: React.CSSProperties = {
  backgroundColor: "var(--color-dark)",
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  color: "var(--color-text)",
  padding: "10px 14px",
  fontSize: 16,
  fontFamily: "var(--font-body)",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

const inputDisabledStyle: React.CSSProperties = {
  ...inputBaseStyle,
  color: "var(--color-dim)",
  cursor: "not-allowed",
  opacity: 0.7,
};

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const user = MOCK_CURRENT_USER;

  const [form, setForm] = useState<FormState>({
    fullName: user.fullName,
    email: user.email,
    companyName: user.startup?.companyName ?? "",
    industry: user.startup?.industry.join(", ") ?? "",
    stage: user.startup?.stage ?? "",
    usGoal: user.startup?.usGoal ?? "",
    notifySession: true,
    notifyCredit: true,
    notifyMarketing: false,
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("백엔드 연동 후 저장됩니다");
  }

  function handleCancel() {
    setForm({
      fullName: user.fullName,
      email: user.email,
      companyName: user.startup?.companyName ?? "",
      industry: user.startup?.industry.join(", ") ?? "",
      stage: user.startup?.stage ?? "",
      usGoal: user.startup?.usGoal ?? "",
      notifySession: true,
      notifyCredit: true,
      notifyMarketing: false,
    });
  }

  function inputStyle(fieldName: string): React.CSSProperties {
    return {
      ...inputBaseStyle,
      borderColor:
        focusedField === fieldName
          ? "var(--color-accent)"
          : "var(--color-border)",
      transition: "border-color 0.15s",
    };
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-black)",
      }}
    >
      <Navbar />

      <main
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "40px 24px 120px",
        }}
      >
        {/* Header */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 28,
            color: "var(--color-text)",
            margin: "0 0 32px",
          }}
        >
          프로필 설정
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Left-right layout */}
          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-start",
            }}
          >
            {/* ── Left: Profile card ──────────────────────────────────────── */}
            <div
              style={{
                width: 340,
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {/* Avatar card */}
              <div
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  padding: "28px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "center",
                }}
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--color-border)",
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: 18,
                      color: "var(--color-text)",
                    }}
                  >
                    {user.fullName}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      color: "var(--color-dim)",
                    }}
                  >
                    {user.email}
                  </span>
                  <span
                    style={{
                      display: "inline-block",
                      marginTop: 4,
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 13,
                      color: "var(--color-accent)",
                      backgroundColor: "oklch(0.87 0.2 130 / 0.12)",
                      padding: "2px 10px",
                      borderRadius: 9999,
                    }}
                  >
                    스타트업
                  </span>
                </div>

                <button
                  type="button"
                  disabled
                  style={{
                    marginTop: 4,
                    width: "100%",
                    padding: "9px 0",
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    backgroundColor: "transparent",
                    color: "var(--color-dim)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    fontSize: 15,
                    cursor: "not-allowed",
                    opacity: 0.5,
                  }}
                >
                  프로필 이미지 변경
                </button>
              </div>

              {/* Account info card */}
              <div
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--color-text)",
                    margin: 0,
                  }}
                >
                  계정 정보
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--color-dim)",
                      }}
                    >
                      가입일
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 14,
                        color: "var(--color-text)",
                      }}
                    >
                      {joinedDate}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--color-dim)",
                      }}
                    >
                      인증 상태
                    </span>
                    {user.isVerified ? (
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          fontSize: 13,
                          color: "var(--color-green)",
                          backgroundColor: "oklch(0.72 0.2 145 / 0.12)",
                          padding: "2px 8px",
                          borderRadius: 9999,
                        }}
                      >
                        인증됨
                      </span>
                    ) : (
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          fontSize: 13,
                          color: "var(--color-dim)",
                          backgroundColor: "var(--color-dark)",
                          padding: "2px 8px",
                          borderRadius: 9999,
                        }}
                      >
                        미인증
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: Edit forms ───────────────────────────────────────── */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Section 1: 기본 정보 */}
              <Section title="기본 정보">
                <Field label="이름">
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField(null)}
                    style={inputStyle("fullName")}
                    placeholder="이름을 입력하세요"
                  />
                </Field>
                <Field
                  label="이메일"
                  hint="이메일 변경은 고객센터에 문의하세요"
                >
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    style={inputDisabledStyle}
                  />
                </Field>
              </Section>

              {/* Section 2: 스타트업 정보 (startup role only) */}
              {user.role === "startup" && (
                <Section title="스타트업 정보">
                  <Field label="회사명">
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setField("companyName", e.target.value)}
                      onFocus={() => setFocusedField("companyName")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("companyName")}
                      placeholder="회사명을 입력하세요"
                    />
                  </Field>

                  <Field
                    label="산업 분야"
                    hint="쉼표로 구분하여 여러 분야를 입력할 수 있습니다 (예: Fintech, Payments)"
                  >
                    <input
                      type="text"
                      value={form.industry}
                      onChange={(e) => setField("industry", e.target.value)}
                      onFocus={() => setFocusedField("industry")}
                      onBlur={() => setFocusedField(null)}
                      style={inputStyle("industry")}
                      placeholder="Fintech, Payments"
                    />
                    {/* Tag preview */}
                    {form.industry.trim() && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                        {form.industry
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily: "var(--font-body)",
                                fontWeight: 500,
                                fontSize: 13,
                                color: "var(--color-dim)",
                                backgroundColor: "var(--color-dark)",
                                border: "1px solid var(--color-border)",
                                padding: "2px 9px",
                                borderRadius: 9999,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </Field>

                  <Field label="단계">
                    <select
                      value={form.stage}
                      onChange={(e) => setField("stage", e.target.value)}
                      onFocus={() => setFocusedField("stage")}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        ...inputStyle("stage"),
                        appearance: "none",
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 14px center",
                        paddingRight: 36,
                        cursor: "pointer",
                      }}
                    >
                      <option value="">단계 선택</option>
                      <option value="Seed">Seed</option>
                      <option value="Pre-A">Pre-A</option>
                      <option value="Series A">Series A</option>
                      <option value="Series B">Series B</option>
                    </select>
                  </Field>

                  <Field label="미국 진출 목표">
                    <textarea
                      value={form.usGoal}
                      onChange={(e) => setField("usGoal", e.target.value)}
                      onFocus={() => setFocusedField("usGoal")}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      style={{
                        ...inputStyle("usGoal"),
                        resize: "vertical",
                        lineHeight: 1.6,
                      }}
                      placeholder="미국 시장에서 달성하고자 하는 목표를 구체적으로 작성해 주세요"
                    />
                  </Field>
                </Section>
              )}

              {/* Section 3: 알림 설정 */}
              <Section title="알림 설정">
                {[
                  {
                    key: "notifySession" as const,
                    label: "세션 알림",
                    desc: "예약 확정, 세션 시작 30분 전, 완료 알림을 받습니다",
                  },
                  {
                    key: "notifyCredit" as const,
                    label: "크레딧 알림",
                    desc: "크레딧 잔액 부족, 충전, 차감 시 알림을 받습니다",
                  },
                  {
                    key: "notifyMarketing" as const,
                    label: "마케팅 수신 동의",
                    desc: "새로운 인에이블러 소개, 프로그램 혜택 등의 소식을 받습니다",
                  },
                ].map(({ key, label, desc }) => (
                  <div
                    key={key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontWeight: 600,
                          fontSize: 16,
                          color: "var(--color-text)",
                        }}
                      >
                        {label}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 14,
                          color: "var(--color-dim)",
                        }}
                      >
                        {desc}
                      </span>
                    </div>
                    <Toggle
                      checked={form[key]}
                      onChange={(v) => setField(key, v)}
                    />
                  </div>
                ))}
              </Section>

              {/* Section 4: 계정 */}
              <Section title="계정">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button
                    type="button"
                    style={{
                      alignSelf: "flex-start",
                      padding: "9px 18px",
                      borderRadius: 8,
                      border: "1px solid var(--color-border)",
                      backgroundColor: "transparent",
                      color: "var(--color-text)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      fontSize: 16,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-accent)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-border)";
                    }}
                    onClick={() => alert("백엔드 연동 후 이용 가능합니다")}
                  >
                    비밀번호 변경
                  </button>

                  <div
                    style={{
                      height: 1,
                      backgroundColor: "var(--color-border)",
                      margin: "4px 0",
                    }}
                  />

                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <button
                      type="button"
                      style={{
                        alignSelf: "flex-start",
                        padding: "9px 18px",
                        borderRadius: 8,
                        border: "1px solid oklch(0.55 0.2 25 / 0.4)",
                        backgroundColor: "transparent",
                        color: "var(--color-red)",
                        fontFamily: "var(--font-body)",
                        fontWeight: 500,
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "oklch(0.55 0.2 25 / 0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          "transparent";
                      }}
                      onClick={() =>
                        alert("계정 삭제는 고객센터에 문의해 주세요. 삭제 시 모든 데이터가 영구 삭제됩니다.")
                      }
                    >
                      계정 삭제
                    </button>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--color-dim)",
                      }}
                    >
                      계정 삭제 시 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다
                    </span>
                  </div>
                </div>
              </Section>
            </div>
          </div>

          {/* ── Bottom action bar ─────────────────────────────────────────── */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
              backgroundColor: "var(--color-dark)",
              borderTop: "1px solid var(--color-border)",
              padding: "16px 24px",
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={handleCancel}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                border: "1px solid var(--color-border)",
                backgroundColor: "transparent",
                color: "var(--color-text)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              type="submit"
              style={{
                padding: "10px 28px",
                borderRadius: 8,
                border: "none",
                backgroundColor: "var(--color-accent)",
                color: "var(--color-black)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              변경사항 저장
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
