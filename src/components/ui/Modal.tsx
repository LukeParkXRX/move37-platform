"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type ModalSize = "sm" | "md" | "lg";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: React.ReactNode;
}

const sizeWidths: Record<ModalSize, string> = {
  sm: "400px",
  md: "560px",
  lg: "720px",
};

export function Modal({ isOpen, onClose, title, size = "md", children }: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fade-in 0.2s ease forwards",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "oklch(0 0 0 / 0.6)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: sizeWidths[size],
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow-lg)",
          animation: "slide-up 0.25s var(--ease-out-expo) forwards",
          maxHeight: "calc(100vh - 48px)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "20px 24px",
              borderBottom: "1px solid var(--color-border)",
              flexShrink: 0,
            }}
          >
            <h2
              id="modal-title"
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="닫기"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                backgroundColor: "transparent",
                color: "var(--color-dim)",
                cursor: "pointer",
                fontSize: "20px",
                lineHeight: 1,
                transition: "background-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--color-dim)";
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

export type { ModalProps, ModalSize };
