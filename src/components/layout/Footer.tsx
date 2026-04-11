import Link from "next/link";

const FOOTER_LINKS = {
  플랫폼: [
    { label: "Enabler 찾기", href: "/enablers" },
    { label: "프로그램 소개", href: "/program" },
    { label: "크레딧 안내", href: "/credits" },
    { label: "기업 서비스", href: "/organizations" },
  ],
  리소스: [
    { label: "Insights", href: "/insights" },
    { label: "성공 사례", href: "/cases" },
    { label: "FAQ", href: "/faq" },
  ],
  회사: [
    { label: "About", href: "/about" },
    { label: "채용", href: "/careers" },
    { label: "문의하기", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative" style={{ borderTop: "1px solid var(--color-border)" }}>
      {/* accent gradient top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(0.91 0.2 110 / 0.35), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "oklch(0.1 0 0)",
                  fontFamily: "var(--font-display)",
                }}
              >
                M
              </span>
              <span
                className="text-[16px] font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display)", color: "var(--color-text)" }}
              >
                Move 37
              </span>
            </Link>
            <p className="text-[15px] leading-relaxed max-w-[280px]" style={{ color: "var(--color-dim)" }}>
              한국 스타트업의 미국 시장 진출을 위한 실행 중심 플랫폼.
              <br />
              검증된 MBA Enabler와 직접 연결됩니다.
            </p>
            <div className="flex items-center gap-2.5 mt-6">
              {[
                { label: "LinkedIn", icon: "in", href: "https://linkedin.com/company/move37" },
                { label: "X", icon: "𝕏", href: "https://x.com/move37_io" },
                { label: "이메일", icon: "@", href: "mailto:hello@move37.io" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-xs font-bold transition-all duration-200 hover:border-accent hover:text-accent"
                  style={{
                    border: "1px solid var(--color-border)",
                    color: "var(--color-dim)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([cat, links]) => (
            <div key={cat}>
              <h3
                className="text-[13px] font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--color-accent)" }}
              >
                {cat}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] transition-colors duration-150 hover:text-text"
                      style={{ color: "var(--color-dim)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="h-px mb-6" style={{ backgroundColor: "var(--color-border)" }} />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs" style={{ color: "var(--color-dim)" }}>
              © {new Date().getFullYear()} Move 37. All rights reserved.
            </p>
            <p className="text-xs" style={{ color: "var(--color-dim)", marginTop: 4 }}>
              (주)엑스알엑스 | 대표: 박규현 | 사업자등록번호: 000-00-00000 | 서울특별시 강남구
            </p>
          </div>
          <div className="flex items-center gap-5">
            {[
              { label: "개인정보처리방침", href: "/privacy" },
              { label: "이용약관", href: "/terms" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs transition-colors duration-150 hover:text-text"
                style={{ color: "var(--color-dim)" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
