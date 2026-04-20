import { describe, expect, test } from "bun:test";
import {
  toSlot,
  hasConflict,
  findConflicts,
  isAvailable,
} from "@/lib/utils/availability";

describe("toSlot", () => {
  test("adds duration in minutes", () => {
    const start = new Date("2026-04-25T09:00:00Z");
    const slot = toSlot(start, 60);
    expect(slot.endsAt.getTime() - slot.startsAt.getTime()).toBe(60 * 60_000);
  });
});

describe("hasConflict", () => {
  const s = (h: number, m: number, dur: number) =>
    toSlot(new Date(`2026-04-25T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00Z`), dur);

  test("detects overlap", () => {
    expect(hasConflict(s(9, 0, 60), s(9, 30, 60))).toBe(true);
  });

  test("adjacent slots do not conflict", () => {
    expect(hasConflict(s(9, 0, 60), s(10, 0, 60))).toBe(false);
  });

  test("disjoint slots", () => {
    expect(hasConflict(s(9, 0, 60), s(14, 0, 60))).toBe(false);
  });

  test("same start time conflicts", () => {
    expect(hasConflict(s(9, 0, 60), s(9, 0, 30))).toBe(true);
  });
});

describe("isAvailable / findConflicts", () => {
  const mkSlot = (h: number) =>
    toSlot(new Date(`2026-04-25T${String(h).padStart(2, "0")}:00:00Z`), 60);

  test("empty calendar = available", () => {
    expect(isAvailable(mkSlot(9), [])).toBe(true);
  });

  test("returns conflicting slots", () => {
    const candidate = mkSlot(10);
    const existing = [mkSlot(9), mkSlot(10), mkSlot(14)];
    const conflicts = findConflicts(candidate, existing);
    expect(conflicts.length).toBe(1);
  });
});
