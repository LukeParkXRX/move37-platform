"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 24 }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)",
          backgroundColor: "transparent", color: currentPage === 1 ? "var(--color-border)" : "var(--color-dim)",
          cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: 13, fontFamily: "var(--font-body)",
        }}
      >
        ←
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} style={{ padding: "8px 4px", color: "var(--color-dim)", fontSize: 13 }}>...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={{
              padding: "8px 12px", borderRadius: "var(--radius-md)", fontSize: 13, fontFamily: "var(--font-body)",
              border: p === currentPage ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
              backgroundColor: p === currentPage ? "oklch(0.91 0.2 110 / 0.1)" : "transparent",
              color: p === currentPage ? "var(--color-accent)" : "var(--color-dim)",
              cursor: "pointer", fontWeight: p === currentPage ? 700 : 400, minWidth: 36,
            }}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "8px 12px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)",
          backgroundColor: "transparent", color: currentPage === totalPages ? "var(--color-border)" : "var(--color-dim)",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: 13, fontFamily: "var(--font-body)",
        }}
      >
        →
      </button>
    </div>
  );
}
