type SkeletonVariant = "text" | "block" | "circle" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  lines?: number; // text 전용: 줄 수
}

const shimmerStyle: React.CSSProperties = {
  background: `linear-gradient(
    90deg,
    var(--color-border) 0%,
    oklch(0.32 0.008 280) 50%,
    var(--color-border) 100%
  )`,
  backgroundSize: "200% 100%",
  animation: "skeleton-shimmer 1.6s ease-in-out infinite",
};

const injectKeyframes = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById("skeleton-keyframes")) return;
  const style = document.createElement("style");
  style.id = "skeleton-keyframes";
  style.textContent = `
    @keyframes skeleton-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
};

function SkeletonLine({ width = "100%", height = 16 }: { width?: string | number; height?: string | number }) {
  injectKeyframes();
  return (
    <div
      style={{
        ...shimmerStyle,
        width,
        height,
        borderRadius: "var(--radius-sm)",
      }}
    />
  );
}

export function Skeleton({ variant = "block", width, height, lines = 3 }: SkeletonProps) {
  injectKeyframes();

  if (variant === "text") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: width ?? "100%" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <SkeletonLine
            key={i}
            width={i === lines - 1 && lines > 1 ? "65%" : "100%"}
            height={height ?? 14}
          />
        ))}
      </div>
    );
  }

  if (variant === "circle") {
    const dim = height ?? width ?? 48;
    return (
      <div
        style={{
          ...shimmerStyle,
          width: dim,
          height: dim,
          borderRadius: "var(--radius-full)",
          flexShrink: 0,
        }}
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: width ?? "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <SkeletonLine width={48} height={48} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
            <SkeletonLine width="60%" height={16} />
            <SkeletonLine width="40%" height={13} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <SkeletonLine width={72} height={28} />
          <SkeletonLine width={72} height={28} />
          <SkeletonLine width={72} height={28} />
        </div>
        <SkeletonLine width="100%" height={13} />
        <SkeletonLine width="80%" height={13} />
      </div>
    );
  }

  // block (default)
  return (
    <div
      style={{
        ...shimmerStyle,
        width: width ?? "100%",
        height: height ?? 120,
        borderRadius: "var(--radius-md)",
      }}
    />
  );
}

export type { SkeletonProps, SkeletonVariant };
