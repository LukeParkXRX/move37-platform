"use client";

import { forwardRef } from "react";

interface InputBaseProps {
  label?: string;
  error?: string;
  helperText?: string;
}

interface InputAsInput extends InputBaseProps, React.InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface InputAsTextarea extends InputBaseProps, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
  rows?: number;
}

type InputProps = InputAsInput | InputAsTextarea;

const fieldStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  color: "var(--color-text)",
  fontSize: "14px",
  padding: "10px 14px",
  fontFamily: "var(--font-body)",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  resize: "vertical",
};

const errorFieldStyle: React.CSSProperties = {
  ...fieldStyle,
  borderColor: "var(--color-red)",
};

const InputField = forwardRef<HTMLInputElement, InputAsInput>(
  ({ label, error, helperText, as: _as, style, onFocus, onBlur, ...props }, ref) => {
    const hasError = Boolean(error);
    return (
      <input
        ref={ref}
        style={{ ...(hasError ? errorFieldStyle : fieldStyle), ...style }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = hasError ? "var(--color-red)" : "var(--color-accent)";
          e.currentTarget.style.boxShadow = hasError
            ? "0 0 0 3px oklch(0.63 0.2 25 / 0.15)"
            : "0 0 0 3px oklch(0.91 0.2 110 / 0.12)";
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? "var(--color-red)" : "var(--color-border)";
          e.currentTarget.style.boxShadow = "none";
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

InputField.displayName = "InputField";

const TextareaField = forwardRef<HTMLTextAreaElement, InputAsTextarea>(
  ({ label, error, helperText, as: _as, style, onFocus, onBlur, rows = 4, ...props }, ref) => {
    const hasError = Boolean(error);
    return (
      <textarea
        ref={ref}
        rows={rows}
        style={{ ...(hasError ? errorFieldStyle : fieldStyle), ...style }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = hasError ? "var(--color-red)" : "var(--color-accent)";
          e.currentTarget.style.boxShadow = hasError
            ? "0 0 0 3px oklch(0.63 0.2 25 / 0.15)"
            : "0 0 0 3px oklch(0.91 0.2 110 / 0.12)";
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? "var(--color-red)" : "var(--color-border)";
          e.currentTarget.style.boxShadow = "none";
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

TextareaField.displayName = "TextareaField";

function Input(props: InputAsInput & { ref?: React.Ref<HTMLInputElement> }): React.ReactElement;
function Input(props: InputAsTextarea & { ref?: React.Ref<HTMLTextAreaElement> }): React.ReactElement;
function Input({ label, error, helperText, ...rest }: InputProps): React.ReactElement {
  const id = (rest as { id?: string }).id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: error ? "var(--color-red)" : "var(--color-dim)",
            fontFamily: "var(--font-body)",
          }}
        >
          {label}
        </label>
      )}

      {rest.as === "textarea" ? (
        <TextareaField
          id={id}
          label={label}
          error={error}
          helperText={helperText}
          {...(rest as InputAsTextarea)}
        />
      ) : (
        <InputField
          id={id}
          label={label}
          error={error}
          helperText={helperText}
          {...(rest as InputAsInput)}
        />
      )}

      {error && (
        <p style={{ fontSize: "12px", color: "var(--color-red)", margin: 0 }}>{error}</p>
      )}
      {!error && helperText && (
        <p style={{ fontSize: "12px", color: "var(--color-dim)", margin: 0 }}>{helperText}</p>
      )}
    </div>
  );
}

export { Input };
export type { InputProps };
