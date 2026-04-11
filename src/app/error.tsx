"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-black)", color: "var(--color-text)", fontFamily: "var(--font-body)", padding: "24px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "oklch(0.35 0.15 25)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 28 }}>!</div>
      <h1 style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: 8 }}>문제가 발생했습니다</h1>
      <p style={{ color: "var(--color-dim)", fontSize: 15, marginBottom: 24, maxWidth: 400 }}>예상치 못한 오류가 발생했습니다. 다시 시도해 주세요.</p>
      <button onClick={reset} style={{ padding: "12px 28px", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-accent)", color: "oklch(0.1 0 0)", fontSize: 14, fontWeight: 700, fontFamily: "var(--font-display)", border: "none", cursor: "pointer" }}>다시 시도</button>
    </div>
  );
}
