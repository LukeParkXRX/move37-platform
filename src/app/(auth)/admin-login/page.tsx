"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  function handleLogin() {
    if (id === "admin" && password === "admin") {
      router.push("/admin/dashboard");
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-black)",
        fontFamily: "var(--font-body)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "40px",
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          animation: "var(--animate-slide-up)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              backgroundColor: "var(--color-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              style={{ color: "oklch(0.1 0 0)" }}
            >
              <path
                d="M3 11L11 3M11 3H5M11 3V9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "15px",
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
            }}
          >
            Get It Done
          </span>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              color: "var(--color-accent)",
              backgroundColor: "var(--color-accent-dim)",
              padding: "2px 8px",
              borderRadius: "9999px",
              border: "1px solid oklch(0.91 0.2 110 / 0.3)",
            }}
          >
            Admin
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "22px",
            color: "var(--color-text)",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            marginBottom: "6px",
          }}
        >
          관리자 로그인
        </h1>
        <p
          style={{
            fontSize: "14px",
            fontFamily: "var(--font-body)",
            color: "var(--color-dim)",
            lineHeight: 1.5,
            marginBottom: "28px",
          }}
        >
          관리자 계정으로 로그인하세요.
        </p>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--color-dim)",
                marginBottom: "6px",
              }}
            >
              아이디
            </label>
            <input
              type="text"
              placeholder="admin"
              value={id}
              onChange={(e) => { setId(e.target.value); setError(""); }}
              onFocus={() => setFocusedField("id")}
              onBlur={() => setFocusedField(null)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                backgroundColor: "var(--color-dark)",
                border: `1px solid ${focusedField === "id" ? "var(--color-accent)" : "var(--color-border)"}`,
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "15px",
                fontFamily: "var(--font-body)",
                color: "var(--color-text)",
                outline: "none",
                transition: "border-color 0.18s ease",
                boxSizing: "border-box" as const,
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase" as const,
                color: "var(--color-dim)",
                marginBottom: "6px",
              }}
            >
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호 입력"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              onFocus={() => setFocusedField("pw")}
              onBlur={() => setFocusedField(null)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{
                width: "100%",
                backgroundColor: "var(--color-dark)",
                border: `1px solid ${focusedField === "pw" ? "var(--color-accent)" : "var(--color-border)"}`,
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "15px",
                fontFamily: "var(--font-body)",
                color: "var(--color-text)",
                outline: "none",
                transition: "border-color 0.18s ease",
                boxSizing: "border-box" as const,
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              style={{
                fontSize: "13px",
                fontFamily: "var(--font-body)",
                color: "var(--color-red)",
                lineHeight: 1.4,
              }}
            >
              {error}
            </p>
          )}

          {/* Login button */}
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "12px 20px",
              borderRadius: "8px",
              backgroundColor: "var(--color-accent)",
              color: "oklch(0.1 0 0)",
              fontSize: "15px",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "opacity 0.15s ease",
              marginTop: "4px",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "0.88")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
            }
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
