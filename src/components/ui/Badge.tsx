type BadgeVariant = "success" | "warning" | "error" | "info" | "accent" | "neutral";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

const variantTokens: Record<BadgeVariant, { color: string; bg: string; border: string; dotColor: string }> = {
  success: {
    color: "var(--color-green)",
    bg: "oklch(0.72 0.19 155 / 0.1)",
    border: "oklch(0.72 0.19 155 / 0.25)",
    dotColor: "var(--color-green)",
  },
  warning: {
    color: "var(--color-amber)",
    bg: "oklch(0.78 0.15 75 / 0.1)",
    border: "oklch(0.78 0.15 75 / 0.25)",
    dotColor: "var(--color-amber)",
  },
  error: {
    color: "var(--color-red)",
    bg: "oklch(0.63 0.2 25 / 0.1)",
    border: "oklch(0.63 0.2 25 / 0.25)",
    dotColor: "var(--color-red)",
  },
  info: {
    color: "var(--color-blue)",
    bg: "oklch(0.65 0.15 250 / 0.1)",
    border: "oklch(0.65 0.15 250 / 0.25)",
    dotColor: "var(--color-blue)",
  },
  accent: {
    color: "var(--color-accent)",
    bg: "var(--color-accent-dim)",
    border: "oklch(0.91 0.2 110 / 0.25)",
    dotColor: "var(--color-accent)",
  },
  neutral: {
    color: "var(--color-dim)",
    bg: "oklch(0.52 0.01 280 / 0.1)",
    border: "var(--color-border)",
    dotColor: "var(--color-dim)",
  },
};

const sizeStyles: Record<BadgeSize, React.CSSProperties> = {
  sm: { fontSize: "11px", padding: "3px 8px", gap: "4px" },
  md: { fontSize: "12px", padding: "4px 10px", gap: "5px" },
};

const dotSizes: Record<BadgeSize, number> = { sm: 5, md: 6 };

export function Badge({ variant = "neutral", size = "md", dot = false, children }: BadgeProps) {
  const tokens = variantTokens[variant];
  const sz = sizeStyles[size];
  const dotDim = dotSizes[size];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sz.gap,
        fontSize: sz.fontSize,
        padding: sz.padding,
        fontWeight: 600,
        fontFamily: "var(--font-body)",
        borderRadius: "var(--radius-full)",
        color: tokens.color,
        backgroundColor: tokens.bg,
        border: `1px solid ${tokens.border}`,
        letterSpacing: "0.01em",
        lineHeight: 1.4,
      }}
    >
      {dot && (
        <span
          style={{
            width: dotDim,
            height: dotDim,
            borderRadius: "50%",
            backgroundColor: tokens.dotColor,
            flexShrink: 0,
            animation: "pulse-dot 1.8s ease-in-out infinite",
          }}
        />
      )}
      {children}
    </span>
  );
}

export type { BadgeProps, BadgeVariant, BadgeSize };
