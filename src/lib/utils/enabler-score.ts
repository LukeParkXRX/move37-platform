export type ScoreInputs = {
  rating: number;
  reRequestRate: number;
  sessionCount: number;
};

export function computeEnablerScore({
  rating,
  reRequestRate,
  sessionCount,
}: ScoreInputs): number {
  if (rating < 0 || rating > 5) {
    throw new Error("rating must be between 0 and 5");
  }
  if (reRequestRate < 0 || reRequestRate > 100) {
    throw new Error("reRequestRate must be between 0 and 100");
  }
  if (sessionCount < 0) {
    throw new Error("sessionCount must be non-negative");
  }

  const ratingNorm = (rating / 5) * 100;
  const experienceBonus = Math.min(sessionCount / 100, 1) * 100;

  const raw =
    ratingNorm * 0.5 + reRequestRate * 0.35 + experienceBonus * 0.15;

  return Math.round(raw * 100) / 100;
}
