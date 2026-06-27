import { differenceInCalendarDays, format, parseISO } from "date-fns";

/** Number of days the user has been alive given a birth date (ISO string). */
export function daysAlive(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  return differenceInCalendarDays(new Date(), parseISO(birthDate));
}

/** Percentage of an assumed 80-year lifespan that has elapsed. */
export function lifePercent(birthDate: string | null | undefined, lifespan = 80): number | null {
  const days = daysAlive(birthDate);
  if (days == null) return null;
  return Math.min(100, Math.round((days / (lifespan * 365.25)) * 1000) / 10);
}

export function formatDate(date: string, pattern = "d MMM yyyy"): string {
  try {
    return format(parseISO(date), pattern);
  } catch {
    return date;
  }
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Compute current consecutive-day streak from a list of YYYY-MM-DD dates. */
export function streakCount(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  if (!set.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  let count = 0;
  while (set.has(cursor.toISOString().slice(0, 10))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
