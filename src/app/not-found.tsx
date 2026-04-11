import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-black)", color: "var(--color-text)", fontFamily: "var(--font-body)", padding: "24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 72, fontWeight: 900, fontFamily: "var(--font-display)", color: "var(--color-accent)", marginBottom: 8, letterSpacing: "-0.04em" }}>404</h1>
      <p style={{ fontSize: 20, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 8 }}>페이지를 찾을 수 없습니다</p>
      <p style={{ color: "var(--color-dim)", fontSize: 15, marginBottom: 32, maxWidth: 400 }}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
      <Link href="/" style={{ padding: "12px 28px", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-accent)", color: "oklch(0.1 0 0)", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", textDecoration: "none" }}>홈으로 돌아가기</Link>
    </div>
  );
}
