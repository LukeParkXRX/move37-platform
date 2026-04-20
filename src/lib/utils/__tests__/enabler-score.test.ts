import { describe, expect, test } from "bun:test";
import { computeEnablerScore } from "@/lib/utils/enabler-score";

describe("computeEnablerScore", () => {
  test("perfect profile scores near 100", () => {
    const score = computeEnablerScore({
      rating: 5,
      reRequestRate: 100,
      sessionCount: 100,
    });
    expect(score).toBeGreaterThanOrEqual(99);
    expect(score).toBeLessThanOrEqual(100);
  });

  test("zero inputs score 0", () => {
    const score = computeEnablerScore({
      rating: 0,
      reRequestRate: 0,
      sessionCount: 0,
    });
    expect(score).toBe(0);
  });

  test("session count saturates at 100", () => {
    const a = computeEnablerScore({
      rating: 4,
      reRequestRate: 50,
      sessionCount: 100,
    });
    const b = computeEnablerScore({
      rating: 4,
      reRequestRate: 50,
      sessionCount: 500,
    });
    expect(a).toBe(b);
  });

  test("rating has highest weight", () => {
    const highRating = computeEnablerScore({
      rating: 5,
      reRequestRate: 0,
      sessionCount: 0,
    });
    const highReRequest = computeEnablerScore({
      rating: 0,
      reRequestRate: 100,
      sessionCount: 0,
    });
    expect(highRating).toBeGreaterThan(highReRequest);
  });

  test("validates bounds", () => {
    expect(() =>
      computeEnablerScore({ rating: 6, reRequestRate: 0, sessionCount: 0 }),
    ).toThrow();
    expect(() =>
      computeEnablerScore({ rating: 4, reRequestRate: 120, sessionCount: 0 }),
    ).toThrow();
    expect(() =>
      computeEnablerScore({ rating: 4, reRequestRate: 50, sessionCount: -1 }),
    ).toThrow();
  });
});
