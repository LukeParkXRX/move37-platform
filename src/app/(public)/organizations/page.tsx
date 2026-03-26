"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PARTNERS = [
  "Seoul Startup Hub",
  "Incheon TPP",
  "KOTRA",
  "K-Startup Center",
  "G-Wave Program",
];

const STEPS = [
  {
    num: "01",
    title: "크레딧 구매",
    desc: "기관 단위로 크레딧을 일괄 구매합니다. 볼륨 디스카운트가 적용됩니다.",
  },
  {
    num: "02",
    title: "스타트업 배분",
    desc: "포트폴리오 스타트업에 크레딧을 자유롭게 배분하고 사용 현황을 추적합니다.",
  },
  {
    num: "03",
    title: "성과 리포트",
    desc: "세션 이력, 만족도, 성과 지표가 자동 생성됩니다. 정부 보고에 바로 활용 가능합니다.",
  },
];

const PLANS = [
  {
    name: "Starter",
    credits: "50 크레딧",
    price: "$4,750",
    discount: "5% 할인",
    desc: "소규모 프로그램에 적합",
    features: [
      "스타트업 10개 등록",
      "기본 대시보드",
      "월간 리포트",
      "이메일 지원",
    ],
    popular: false,
  },
  {
    name: "Growth",
    credits: "100 크레딧",
    price: "$9,000",
    discount: "10% 할인",
    desc: "중규모 프로그램에 최적",
    features: [
      "스타트업 30개 등록",
      "고급 대시보드 + 분석",
      "주간 리포트",
      "전담 매니저 배정",
      "맞춤 Enabler 풀 구성",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    credits: "200+ 크레딧",
    price: "별도 협의",
    discount: "15%+ 할인",
    desc: "대규모 기관 맞춤형",
    features: [
      "스타트업 무제한 등록",
      "실시간 대시보드 + API",
      "일일 리포트",
      "전담 팀 배정",
      "맞춤 Enabler 풀 + 우선 매칭",
      "오프라인 네트워킹 이벤트",
    ],
    popular: false,
  },
];

export default function OrganizationsPage() {
  const [formData, setFormData] = useState({
    name: "",
    org: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    color: "var(--color-text)",
    backgroundColor: "oklch(0.12 0.005 280)",
    border: "1px solid var(--color-border)",
    borderRadius: "10px",
    outline: "none",
    fontFamily: "var(--font-body)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "var(--color-dim)",
    marginBottom: "8px",
    fontFamily: "var(--font-display)",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-black)" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section style={{ padding: "120px 24px 80px", textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--color-accent)",
              marginBottom: "20px",
              fontFamily: "var(--font-display)",
            }}
          >
            For Organizations
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 900,
              fontSize: "clamp(32px, 4.5vw, 52px)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              wordBreak: "keep-all",
              marginBottom: "20px",
            }}
          >
            소속 스타트업 전체에
            <br />
            <span style={{ color: "var(--color-accent)" }}>
              Move 37 네트워크
            </span>
            를 제공하세요
          </h1>
          <p
            style={{
              fontSize: "18px",
              lineHeight: 1.7,
              color: "var(--color-dim)",
              maxWidth: "560px",
              margin: "0 auto 36px",
              wordBreak: "keep-all",
            }}
          >
            크레딧 일괄 구매, 스타트업 배분, 성과 리포트 자동화.
            <br />
            액셀러레이터를 위한 올인원 글로벌 매칭 인프라.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <a
              href="#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                backgroundColor: "var(--color-accent)",
                color: "oklch(0.1 0 0)",
                fontFamily: "var(--font-display)",
                textDecoration: "none",
                transition: "opacity 0.15s",
              }}
            >
              도입 상담 신청
            </a>
            <a
              href="#pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "14px 28px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "15px",
                border: "1px solid var(--color-border)",
                color: "var(--color-text)",
                textDecoration: "none",
              }}
            >
              요금제 보기
            </a>
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section
        style={{
          padding: "20px 24px",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          <span
            style={{ fontSize: "12px", color: "var(--color-dim)", fontWeight: 500 }}
          >
            신뢰하는 파트너
          </span>
          {PARTNERS.map((p) => (
            <span
              key={p}
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--color-dim)",
                fontFamily: "var(--font-display)",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--color-accent)",
                fontFamily: "var(--font-display)",
              }}
            >
              How It Works
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "32px",
                color: "var(--color-text)",
                marginTop: "12px",
                wordBreak: "keep-all",
              }}
            >
              3단계로 시작하세요
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "24px",
            }}
          >
            {STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "16px",
                  padding: "32px",
                }}
              >
                <span
                  style={{
                    fontSize: "40px",
                    fontWeight: 900,
                    fontFamily: "var(--font-display)",
                    color: "oklch(0.91 0.2 110 / 0.15)",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  {step.num}
                </span>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    fontFamily: "var(--font-display)",
                    marginBottom: "8px",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: 1.6,
                    color: "var(--color-dim)",
                    wordBreak: "keep-all",
                  }}
                >
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section
        id="pricing"
        style={{
          padding: "80px 24px",
          backgroundColor: "var(--color-dark)",
          borderTop: "1px solid var(--color-border)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--color-accent)",
                fontFamily: "var(--font-display)",
              }}
            >
              Pricing
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "32px",
                color: "var(--color-text)",
                marginTop: "12px",
                wordBreak: "keep-all",
              }}
            >
              기관 규모에 맞는 플랜을 선택하세요
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                style={{
                  backgroundColor: "var(--color-card)",
                  border: plan.popular
                    ? "2px solid var(--color-accent)"
                    : "1px solid var(--color-border)",
                  borderRadius: "20px",
                  padding: "36px 28px",
                  position: "relative",
                }}
              >
                {plan.popular && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "4px 14px",
                      borderRadius: "9999px",
                      backgroundColor: "var(--color-accent)",
                      color: "oklch(0.1 0 0)",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    인기
                  </span>
                )}

                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--color-dim)",
                    marginTop: "4px",
                    marginBottom: "20px",
                  }}
                >
                  {plan.desc}
                </p>

                <div style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      fontSize: "36px",
                      fontWeight: 900,
                      fontFamily: "var(--font-display)",
                      color: "var(--color-text)",
                    }}
                  >
                    {plan.price}
                  </span>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "var(--color-accent)",
                      fontWeight: 600,
                    }}
                  >
                    {plan.credits} · {plan.discount}
                  </span>
                </div>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 28px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        fontSize: "14px",
                        color: "var(--color-dim)",
                        paddingLeft: "20px",
                        position: "relative",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "var(--color-accent)",
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  style={{
                    display: "block",
                    textAlign: "center",
                    padding: "14px",
                    borderRadius: "12px",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "var(--font-display)",
                    textDecoration: "none",
                    transition: "opacity 0.15s",
                    backgroundColor: plan.popular
                      ? "var(--color-accent)"
                      : "transparent",
                    color: plan.popular ? "oklch(0.1 0 0)" : "var(--color-text)",
                    border: plan.popular
                      ? "none"
                      : "1px solid var(--color-border)",
                  }}
                >
                  {plan.popular ? "시작하기" : "문의하기"}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <p
            style={{
              fontSize: "22px",
              fontWeight: 500,
              lineHeight: 1.7,
              color: "var(--color-text)",
              fontStyle: "italic",
              marginBottom: "24px",
              wordBreak: "keep-all",
            }}
          >
            &ldquo;Move 37 도입 후 스타트업들의 미국 시장 이해도가 눈에 띄게
            향상되었습니다. 무엇보다 정부 보고용 성과 리포트가 자동으로
            생성되어 운영 부담이 크게 줄었습니다.&rdquo;
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face"
              alt="testimonial"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "9999px",
                objectFit: "cover",
              }}
            />
            <div>
              <p
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                김정훈
              </p>
              <p style={{ fontSize: "13px", color: "var(--color-dim)" }}>
                Seoul Startup Hub · 프로그램 매니저
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <section
        id="contact"
        style={{
          padding: "80px 24px",
          backgroundColor: "var(--color-dark)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div style={{ maxWidth: "560px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "var(--color-accent)",
                fontFamily: "var(--font-display)",
              }}
            >
              Contact Us
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "28px",
                color: "var(--color-text)",
                marginTop: "12px",
                wordBreak: "keep-all",
              }}
            >
              도입 상담을 신청하세요
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--color-dim)",
                marginTop: "8px",
                wordBreak: "keep-all",
              }}
            >
              영업일 기준 24시간 내 담당자가 연락드립니다
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>이름</label>
                <input
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>기관명</label>
                <input
                  type="text"
                  placeholder="Seoul Startup Hub"
                  value={formData.org}
                  onChange={(e) => updateField("org", e.target.value)}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border)")
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <div>
                <label style={labelStyle}>이메일</label>
                <input
                  type="email"
                  placeholder="you@organization.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border)")
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>연락처</label>
                <input
                  type="tel"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  style={inputStyle}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--color-accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--color-border)")
                  }
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>문의 내용</label>
              <textarea
                placeholder="프로그램 규모, 스타트업 수, 희망 시작 시기 등을 알려주세요."
                value={formData.message}
                onChange={(e) => updateField("message", e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: "120px",
                  resize: "vertical",
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
            >
              {submitted ? "접수 완료! 곧 연락드리겠습니다" : "상담 신청하기"}
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
