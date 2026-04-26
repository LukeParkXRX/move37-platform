"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number;
  max?: number;
  interactive?: boolean;
  onChange?: (v: number) => void;
  size?: number;
}

export function StarRating({
  value,
  max = 5,
  interactive = false,
  onChange,
  size = 18,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const display = hovered ?? value;

  return (
    <div
      style={{ display: "inline-flex", alignItems: "center", gap: 2 }}
      onMouseLeave={() => interactive && setHovered(null)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < display;
        return (
          <span
            key={i}
            onClick={() => interactive && onChange?.(i + 1)}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            style={{
              fontSize: size,
              lineHeight: 1,
              color: filled ? "var(--color-accent)" : "var(--color-border)",
              cursor: interactive ? "pointer" : "default",
              userSelect: "none",
              transition: "color 0.1s ease",
            }}
            aria-label={`${i + 1}점`}
          >
            {filled ? "★" : "☆"}
          </span>
        );
      })}
    </div>
  );
}
