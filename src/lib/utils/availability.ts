export type TimeSlot = {
  startsAt: Date;
  endsAt: Date;
};

export function toSlot(startsAt: Date, durationMinutes: number): TimeSlot {
  return {
    startsAt,
    endsAt: new Date(startsAt.getTime() + durationMinutes * 60_000),
  };
}

export function hasConflict(a: TimeSlot, b: TimeSlot): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

export function findConflicts(
  candidate: TimeSlot,
  existing: TimeSlot[],
): TimeSlot[] {
  return existing.filter((slot) => hasConflict(candidate, slot));
}

export function isAvailable(
  candidate: TimeSlot,
  existing: TimeSlot[],
): boolean {
  return findConflicts(candidate, existing).length === 0;
}
