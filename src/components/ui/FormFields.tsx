"use client";

import { useState } from "react";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "11px",
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: "var(--color-dim)",
        marginBottom: "6px",
      }}
    >
      {children}
    </label>
  );
}

export function FieldInput({
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      required={required}
      style={{
        width: "100%",
        backgroundColor: "oklch(0.14 0.005 280 / 0.6)",
        border: `1px solid ${focused ? "var(--color-accent)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "10px 14px",
        fontSize: "14px",
        fontFamily: "var(--font-body)",
        color: "var(--color-text)",
        outline: "none",
        transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        boxShadow: focused ? "0 0 0 3px oklch(0.91 0.2 110 / 0.08)" : "none",
        boxSizing: "border-box",
      }}
    />
  );
}

export function FieldSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          appearance: "none",
          WebkitAppearance: "none",
          backgroundColor: "oklch(0.14 0.005 280 / 0.6)",
          border: `1px solid ${focused ? "var(--color-accent)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "10px 36px 10px 14px",
          fontSize: "14px",
          fontFamily: "var(--font-body)",
          color: value ? "var(--color-text)" : "var(--color-dim)",
          outline: "none",
          cursor: "pointer",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          boxShadow: focused ? "0 0 0 3px oklch(0.91 0.2 110 / 0.08)" : "none",
          boxSizing: "border-box",
        }}
      >
        {placeholder && (
          <option value="" disabled style={{ color: "var(--color-dim)", backgroundColor: "var(--color-dark)" }}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: "var(--color-dark)", color: "var(--color-text)" }}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "12px", height: "12px", color: "var(--color-dim)", pointerEvents: "none" }}
        viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M2 4l4 4 4-4" />
      </svg>
    </div>
  );
}
