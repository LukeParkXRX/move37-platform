"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="inline-flex items-center gap-2 mb-4 uppercase tracking-widest font-bold"
      style={{ fontSize: 11, color: "var(--color-accent)" }}
    >
      <span
        style={{
          width: 24,
          height: 2,
          background: "var(--color-accent)",
          display: "inline-block",
        }}
      />
      {children}
    </div>
  );
}

const flowNodes = [
  { label: "기관 구매", sub: "Toss 결제", color: "#22c55e" },
  { label: "기관 풀", sub: "잔액 보유", color: "var(--color-blue)" },
  { label: "스타트업 배분", sub: "OrgAdmin", color: "#a78bfa" },
  { label: "세션 예약", sub: "홀드", color: "var(--color-amber)" },
  { label: "세션 완료", sub: "확정 차감", color: "var(--color-accent)" },
  { label: "Enabler 정산", sub: "Stripe", color: "#22c55e" },
];

const sessionTypes = [
  {
    name: "Chemistry",
    color: "var(--color-green)",
    price: "무료",
    priceDetail: "Free · 20분",
    badge: null,
    features: [
      "첫 만남 케미 확인",
      "방향성 논의",
      "크레딧 차감 없음",
    ],
  },
  {
    name: "Standard",
    color: "var(--color-blue)",
    price: "2 크레딧",
    priceDetail: "$200 · 60분",
    badge: "인기",
    features: [
      "심층 전략 논의",
      "실행 액션 아이템 도출",
      "AI 세션 요약 제공",
      "재예약 우선 배정",
    ],
  },
  {
    name: "Project",
    color: "var(--color-amber)",
    price: "협의",
    priceDetail: "장기 프로젝트",
    badge: null,
    features: [
      "주간 정기 세션",
      "장기 실행 파트너십",
      "전담 Enabler 배정",
      "맞춤 크레딧 패키지",
    ],
  },
];

const b2bPackages = [
  {
    name: "Starter",
    credits: "20 크레딧",
    priceUSD: "$2,000",
    priceKRW: "₩2,800,000",
    target: "스타트업 5개사 이하",
    recommended: false,
  },
  {
    name: "Growth",
    credits: "60 크레딧",
    priceUSD: "$5,700",
    priceKRW: "₩8,000,000",
    target: "중형 액셀러레이터",
    recommended: true,
  },
  {
    name: "Enterprise",
    credits: "200+ 크레딧",
    priceUSD: "별도 협의",
    priceKRW: "",
    target: "대형 액셀러레이터",
    recommended: false,
  },
];

export default function CreditsPage() {
  return (
    <div
      style={{
        background: "var(--color-dark)",
        minHeight: "100vh",
        color: "var(--color-text)",
      }}
    >
      <Navbar />

      <main style={{ paddingTop: 56 }}>
        {/* Hero Section */}
        <section className="text-center px-6 py-24">
          <Eyebrow>크레딧 시스템</Eyebrow>
          <h1
            className="font-bold mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--color-text)",
              lineHeight: 1.15,
            }}
          >
            1 크레딧 = $100 세션 1회
          </h1>
          <p
            className="mx-auto"
            style={{
              maxWidth: 560,
              color: "var(--color-dim)",
              fontSize: 17,
              lineHeight: 1.7,
            }}
          >
            Get It Done at Work의 크레딧은 기관이 구매하고 스타트업이 사용하는 세션 단위
            화폐입니다. 투명한 구조로 세션 비용을 관리하고, 필요한 만큼만
            사용하세요.
          </p>
        </section>

        {/* Credit Flow Diagram */}
        <section className="px-6 pb-24">
          <div
            className="mx-auto"
            style={{
              maxWidth: 900,
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 20,
              padding: "40px 32px",
            }}
          >
            <div className="text-center mb-10">
              <Eyebrow>크레딧 흐름</Eyebrow>
              <h2
                className="font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 24,
                  color: "var(--color-text)",
                }}
              >
                구매부터 정산까지
              </h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {flowNodes.map((node, i) => (
                <div key={node.label} className="flex items-center gap-2">
                  <div
                    style={{
                      background: `${node.color}18`,
                      border: `1.5px solid ${node.color}55`,
                      borderRadius: 10,
                      padding: "10px 16px",
                      minWidth: 100,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: node.color,
                        lineHeight: 1.3,
                      }}
                    >
                      {node.label}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--color-dim)",
                        marginTop: 2,
                      }}
                    >
                      {node.sub}
                    </div>
                  </div>
                  {i < flowNodes.length - 1 && (
                    <span
                      style={{
                        color: "var(--color-dim)",
                        fontSize: 18,
                        fontWeight: 300,
                        flexShrink: 0,
                      }}
                    >
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Session Types */}
        <section className="px-6 pb-24">
          <div className="mx-auto" style={{ maxWidth: 900 }}>
            <div className="text-center mb-12">
              <Eyebrow>세션 종류</Eyebrow>
              <h2
                className="font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  color: "var(--color-text)",
                }}
              >
                목적에 맞는 세션 선택
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {sessionTypes.map((session) => (
                <div
                  key={session.name}
                  style={{
                    background: "var(--color-card)",
                    border: `1px solid var(--color-border)`,
                    borderRadius: 20,
                    padding: 28,
                    position: "relative",
                  }}
                >
                  {session.badge && (
                    <div
                      className="absolute top-5 right-5"
                      style={{
                        background: "var(--color-blue)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 6,
                        padding: "2px 8px",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {session.badge}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: session.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 12,
                    }}
                  >
                    {session.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 40,
                      fontWeight: 700,
                      color: "var(--color-text)",
                      lineHeight: 1.1,
                      marginBottom: 4,
                    }}
                  >
                    {session.price}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--color-dim)",
                      marginBottom: 24,
                    }}
                  >
                    {session.priceDetail}
                  </div>
                  <ul className="flex flex-col gap-2">
                    {session.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2"
                        style={{ fontSize: 14, color: "var(--color-dim)" }}
                      >
                        <span
                          style={{
                            color: session.color,
                            marginTop: 1,
                            flexShrink: 0,
                            fontSize: 13,
                          }}
                        >
                          ✓
                        </span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* B2B Packages */}
        <section className="px-6 pb-24">
          <div
            className="mx-auto"
            style={{
              maxWidth: 900,
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 20,
              padding: "48px 32px",
            }}
          >
            <div className="text-center mb-12">
              <Eyebrow>기관 패키지</Eyebrow>
              <h2
                className="font-bold"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  color: "var(--color-text)",
                  marginBottom: 8,
                }}
              >
                B2B 크레딧 패키지
              </h2>
              <p style={{ fontSize: 15, color: "var(--color-dim)" }}>
                대량 구매 시 할인 혜택을 제공합니다.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {b2bPackages.map((pkg) => (
                <div
                  key={pkg.name}
                  style={{
                    background: "var(--color-dark)",
                    border: `1.5px solid ${pkg.recommended ? "var(--color-accent)" : "var(--color-border)"}`,
                    borderRadius: 16,
                    padding: 28,
                    position: "relative",
                  }}
                >
                  {pkg.recommended && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      style={{
                        background: "var(--color-accent)",
                        color: "var(--color-dark)",
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 20,
                        padding: "3px 12px",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.06em",
                      }}
                    >
                      추천
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--color-text)",
                      marginBottom: 8,
                    }}
                  >
                    {pkg.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "var(--color-accent)",
                      marginBottom: 4,
                    }}
                  >
                    {pkg.credits}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "var(--color-text)",
                      lineHeight: 1.3,
                    }}
                  >
                    {pkg.priceUSD}
                  </div>
                  {pkg.priceKRW && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "var(--color-dim)",
                        marginBottom: 16,
                      }}
                    >
                      {pkg.priceKRW}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--color-dim)",
                      marginTop: pkg.priceKRW ? 0 : 16,
                      paddingTop: 16,
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    {pkg.target}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a href="/contact" className="landing-btn-primary">
                기관 문의하기 →
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
