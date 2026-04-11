"use client";

import { Modal } from "./Modal";

// ─── Types ───────────────────────────────────────────────────────────────────

type ConfirmVariant = "danger" | "warning" | "info";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const CONFIRM_STYLES: Record<ConfirmVariant, { bg: string; hover: string; text: string }> = {
  danger: {
    bg: "oklch(0.55 0.22 25)",
    hover: "oklch(0.48 0.22 25)",
    text: "oklch(1 0 0)",
  },
  warning: {
    bg: "oklch(0.72 0.18 70)",
    hover: "oklch(0.64 0.18 70)",
    text: "oklch(0.12 0 0)",
  },
  info: {
    bg: "var(--color-accent)",
    hover: "var(--color-accent-hover, var(--color-accent))",
    text: "oklch(0.1 0 0)",
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  variant = "info",
}: ConfirmDialogProps) {
  const style = CONFIRM_STYLES[variant];

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Message */}
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: 1.6,
            color: "var(--color-dim)",
            fontFamily: "var(--font-body)",
          }}
        >
          {message}
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          {/* Cancel */}
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              fontSize: "13.5px",
              fontWeight: 500,
              fontFamily: "var(--font-body)",
              color: "var(--color-dim)",
              backgroundColor: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md, 8px)",
              cursor: "pointer",
              transition: "background-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = "var(--color-border)";
              el.style.color = "var(--color-text)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = "transparent";
              el.style.color = "var(--color-dim)";
            }}
          >
            {cancelText}
          </button>

          {/* Confirm */}
          <button
            onClick={handleConfirm}
            style={{
              padding: "8px 16px",
              fontSize: "13.5px",
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              color: style.text,
              backgroundColor: style.bg,
              border: "none",
              borderRadius: "var(--radius-md, 8px)",
              cursor: "pointer",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = style.hover;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = style.bg;
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export type { ConfirmDialogProps, ConfirmVariant };
