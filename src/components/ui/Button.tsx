"use client";

import { forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "var(--color-accent)",
    color: "var(--color-black)",
    border: "1px solid transparent",
  },
  secondary: {
    backgroundColor: "transparent",
    color: "var(--color-dim)",
    border: "1px solid var(--color-border)",
  },
  ghost: {
    backgroundColor: "transparent",
    color: "var(--color-dim)",
    border: "1px solid transparent",
  },
  danger: {
    backgroundColor: "transparent",
    color: "var(--color-red)",
    border: "1px solid var(--color-red)",
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: "13px", padding: "6px 12px", borderRadius: "var(--radius-sm)" },
  md: { fontSize: "14px", padding: "9px 18px", borderRadius: "var(--radius-md)" },
  lg: { fontSize: "15px", padding: "12px 24px", borderRadius: "var(--radius-lg)" },
};

const Spinner = ({ size }: { size: ButtonSize }) => {
  const dim = size === "sm" ? 12 : size === "lg" ? 18 : 15;
  return (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: "spin 0.7s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      fullWidth = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.5 : 1,
          transition: "opacity 0.15s, box-shadow 0.15s, background-color 0.15s",
          outline: "none",
          width: fullWidth ? "100%" : undefined,
          ...variantStyles[variant],
          ...sizeStyles[size],
          ...style,
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.85";
          }
          props.onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          if (!isDisabled) {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }
          props.onMouseLeave?.(e);
        }}
        onFocus={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            `0 0 0 2px var(--color-black), 0 0 0 4px var(--color-accent)`;
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          props.onBlur?.(e);
        }}
        {...props}
      >
        {loading ? (
          <Spinner size={size} />
        ) : (
          icon && <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
