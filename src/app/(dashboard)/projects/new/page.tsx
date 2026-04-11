"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

const CATEGORIES = [
  "GTM 전략",
  "IR / 투자유치",
  "시장조사",
  "파트너십 구축",
  "제품 현지화",
  "엔터프라이즈 세일즈",
  "기타",
];

const DURATIONS = ["1주", "2주", "1개월", "3개월", "6개월"];

const BUDGETS = [
  "1-3 크레딧",
  "3-5 크레딧",
  "5-10 크레딧",
  "10+ 크레딧 (별도 협의)",
];

const REQUIREMENTS = [
  "MBA 졸업",
  "미국 현지 경험 3년+",
  "한국어 가능",
  "특정 산업 전문가",
  "투자 네트워크 보유",
  "기업 미팅 주선 가능",
];

export default function NewProjectPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleReq = (req: string) => {
    setRequirements((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req]
    );
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    fontSize: "16px",
    color: "var(--color-text)",
    backgroundColor: "oklch(0.12 0.005 280)",
    border: "1px solid var(--color-border)",
    borderRadius: "10px",
    outline: "none",
    fontFamily: "var(--font-body)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "var(--color-dim)",
    marginBottom: "8px",
    fontFamily: "var(--font-display)",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-black)" }}>
      <Navbar />

      <div
        style={{
          maxWidth: "1120px",
          margin: "0 auto",
          padding: "100px 24px 80px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <Link
            href="/matching"
            style={{
              fontSize: "14px",
              color: "var(--color-dim)",
              textDecoration: "none",
              display: "inline-block",
              marginBottom: "16px",
            }}
          >
            ← Enabler 찾기로 돌아가기
          </Link>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(28px, 3.5vw, 40px)",
              color: "var(--color-text)",
              wordBreak: "keep-all",
              marginBottom: "8px",
            }}
          >
            프로젝트 등록
          </h1>
          <p
            style={{
              fontSize: "17px",
              color: "var(--color-dim)",
              wordBreak: "keep-all",
            }}
          >
            프로젝트를 등록하면 적합한 Enabler가 직접 지원합니다. 평균 24시간
            내 첫 지원을 받습니다.
          </p>
        </div>

        {/* Layout: Form + Preview */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* LEFT: Form */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "28px",
            }}
          >
            {/* Title */}
            <div>
              <label style={labelStyle}>프로젝트 제목</label>
              <input
                type="text"
                placeholder="예: 미국 B2B SaaS 시장 GTM 전략 수립"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-border)")
                }
              />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  ...inputStyle,
                  appearance: "none" as const,
                  cursor: "pointer",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-border)")
                }
              >
                <option value="">카테고리를 선택하세요</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>상세 설명</label>
              <textarea
                placeholder="어떤 도움이 필요한지 구체적으로 설명해주세요. 현재 상황, 목표, 기대 결과물 등을 포함하면 더 정확한 매칭이 가능합니다."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: "150px",
                  resize: "vertical" as const,
                  lineHeight: 1.7,
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--color-accent)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--color-border)")
                }
              />
            </div>

            {/* Duration + Budget row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
                gap: "20px",
              }}
            >
              <div>
                <label style={labelStyle}>예상 기간</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: "none" as const,
                    cursor: "pointer",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border)")
                  }
                >
                  <option value="">기간 선택</option>
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>예산 범위</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{
                    ...inputStyle,
                    appearance: "none" as const,
                    cursor: "pointer",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border)")
                  }
                >
                  <option value="">예산 선택</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label style={labelStyle}>희망 Enabler 조건</label>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                {REQUIREMENTS.map((req) => {
                  const active = requirements.includes(req);
                  return (
                    <button
                      key={req}
                      type="button"
                      onClick={() => toggleReq(req)}
                      style={{
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: active ? 600 : 400,
                        borderRadius: "9999px",
                        border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                        backgroundColor: active
                          ? "oklch(0.91 0.2 110 / 0.1)"
                          : "transparent",
                        color: active
                          ? "var(--color-accent)"
                          : "var(--color-dim)",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {req}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* File Upload Zone */}
            <div>
              <label style={labelStyle}>참고 자료 첨부 (선택)</label>
              <div
                style={{
                  border: "2px dashed var(--color-border)",
                  borderRadius: "12px",
                  padding: "32px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-accent)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-border)")
                }
              >
                <p
                  style={{
                    fontSize: "15px",
                    color: "var(--color-dim)",
                    marginBottom: "4px",
                  }}
                >
                  파일을 드래그하거나 클릭해서 업로드
                </p>
                <p style={{ fontSize: "13px", color: "var(--color-border)" }}>
                  PDF, DOC, PPT, 이미지 (최대 10MB)
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "16px",
                fontWeight: 700,
                fontFamily: "var(--font-display)",
                backgroundColor: "var(--color-accent)",
                color: "oklch(0.1 0 0)",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {submitted ? "등록 완료!" : "프로젝트 등록하기"}
            </button>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-dim)",
                textAlign: "center",
              }}
            >
              등록 후 평균 24시간 내 Enabler 지원을 받습니다
            </p>
          </div>

          {/* RIGHT: Preview */}
          <div
            style={{
              position: "sticky",
              top: "80px",
              backgroundColor: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--color-accent)",
                marginBottom: "16px",
                fontFamily: "var(--font-display)",
              }}
            >
              미리보기
            </p>

            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: title ? "var(--color-text)" : "oklch(0.45 0.01 280)",
                fontFamily: "var(--font-display)",
                marginBottom: "12px",
                wordBreak: "keep-all",
              }}
            >
              {title || "프로젝트 제목을 입력하세요"}
            </h3>

            {category && (
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  backgroundColor: "oklch(0.91 0.2 110 / 0.1)",
                  color: "var(--color-accent)",
                  border: "1px solid oklch(0.91 0.2 110 / 0.2)",
                  marginBottom: "12px",
                }}
              >
                {category}
              </span>
            )}

            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: description ? "var(--color-dim)" : "oklch(0.45 0.01 280)",
                marginBottom: "16px",
                wordBreak: "keep-all",
                display: "-webkit-box",
                WebkitLineClamp: 4,
                WebkitBoxOrient: "vertical" as const,
                overflow: "hidden",
              }}
            >
              {description || "상세 설명이 여기에 표시됩니다..."}
            </p>

            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
              }}
            >
              <span style={{ color: "oklch(0.6 0.01 280)" }}>
                {duration || "기간 미정"}
              </span>
              <span
                style={{
                  color: "var(--color-accent)",
                  fontWeight: 600,
                }}
              >
                {budget || "예산 미정"}
              </span>
            </div>

            {requirements.length > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "4px",
                }}
              >
                {requirements.map((r) => (
                  <span
                    key={r}
                    style={{
                      fontSize: "10px",
                      padding: "3px 8px",
                      borderRadius: "9999px",
                      backgroundColor: "var(--color-dark)",
                      color: "var(--color-dim)",
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
