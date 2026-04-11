"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ─── Types ───────────────────────────────────────────────────────────────────

type ToastType = "success" | "error" | "info" | "warning";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  exiting: boolean;
}

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  toast: (message: string, options?: ToastOptions) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "i",
  warning: "!",
};

const ICON_COLORS: Record<ToastType, string> = {
  success: "oklch(0.72 0.18 150)",
  error: "oklch(0.65 0.22 25)",
  info: "var(--color-accent)",
  warning: "oklch(0.78 0.18 70)",
};

// ─── Single Toast item ────────────────────────────────────────────────────────

function ToastEl({
  item,
  onRemove,
}: {
  item: ToastItem;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "12px 14px",
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg, 12px)",
        boxShadow: "0 8px 24px oklch(0 0 0 / 0.35)",
        minWidth: "280px",
        maxWidth: "380px",
        pointerEvents: "all",
        animation: item.exiting
          ? "toast-out 0.25s ease forwards"
          : "toast-in 0.3s var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1)) forwards",
      }}
    >
      {/* Icon badge */}
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: ICON_COLORS[item.type] + "22",
          color: ICON_COLORS[item.type],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 700,
          marginTop: "1px",
        }}
      >
        {ICONS[item.type]}
      </span>

      {/* Message */}
      <span
        style={{
          flex: 1,
          fontSize: "13.5px",
          lineHeight: 1.5,
          color: "var(--color-text)",
          fontFamily: "var(--font-body)",
        }}
      >
        {item.message}
      </span>

      {/* Close button */}
      <button
        onClick={() => onRemove(item.id)}
        aria-label="닫기"
        style={{
          flexShrink: 0,
          width: "20px",
          height: "20px",
          border: "none",
          backgroundColor: "transparent",
          color: "var(--color-dim)",
          cursor: "pointer",
          fontSize: "16px",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-sm, 4px)",
          transition: "color 0.15s",
          padding: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--color-dim)";
        }}
      >
        ×
      </button>
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Start exit animation
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timers.current.delete(id);
    }, 280);
  }, []);

  const addToast = useCallback(
    (message: string, options: ToastOptions = {}) => {
      const id = Math.random().toString(36).slice(2);
      const duration = options.duration ?? 4000;
      const type = options.type ?? "info";

      const item: ToastItem = { id, message, type, duration, exiting: false };
      setToasts((prev) => [...prev, item]);

      const timer = setTimeout(() => removeToast(id), duration);
      timers.current.set(id, timer);
    },
    [removeToast]
  );

  // Cleanup on unmount
  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((timer) => clearTimeout(timer));
  }, []);

  const ctx: ToastContextValue = {
    toast: addToast,
    success: (msg, dur) => addToast(msg, { type: "success", duration: dur }),
    error: (msg, dur) => addToast(msg, { type: "error", duration: dur }),
    info: (msg, dur) => addToast(msg, { type: "info", duration: dur }),
    warning: (msg, dur) => addToast(msg, { type: "warning", duration: dur }),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {typeof window !== "undefined" &&
        createPortal(
          <>
            <style>{`
              @keyframes toast-in {
                from { opacity: 0; transform: translateX(24px) scale(0.95); }
                to   { opacity: 1; transform: translateX(0)    scale(1);    }
              }
              @keyframes toast-out {
                from { opacity: 1; transform: translateX(0) scale(1);    }
                to   { opacity: 0; transform: translateX(24px) scale(0.95); }
              }
            `}</style>
            <div
              aria-label="알림"
              style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                pointerEvents: "none",
                alignItems: "flex-end",
              }}
            >
              {toasts.map((t) => (
                <ToastEl key={t.id} item={t} onRemove={removeToast} />
              ))}
            </div>
          </>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
