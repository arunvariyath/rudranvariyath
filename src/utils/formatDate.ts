import type { LanguageCode } from '../locales';

const INTL_LOCALE: Record<LanguageCode, string> = {
  en: 'en-GB',
  ml: 'ml-IN',
};

/**
 * Accepts either the `YYYYMMDD` string yt-dlp produces, or any ISO date string.
 * Returns null for missing / unparseable values so callers can hide the field.
 */
export function parsePoemDate(raw?: string | null): Date | null {
  if (!raw) return null;

  if (/^\d{8}$/.test(raw)) {
    const year = Number(raw.slice(0, 4));
    const month = Number(raw.slice(4, 6));
    const day = Number(raw.slice(6, 8));
    const date = new Date(Date.UTC(year, month - 1, day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** e.g. "14 Mar 2024" / "14 മാർ 2024" */
export function formatPoemDate(raw: string | undefined, lang: LanguageCode): string | null {
  const date = parsePoemDate(raw);
  if (!date) return null;

  try {
    return new Intl.DateTimeFormat(INTL_LOCALE[lang], {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'second' },
  { amount: 60, unit: 'minute' },
  { amount: 24, unit: 'hour' },
  { amount: 7, unit: 'day' },
  { amount: 4.34524, unit: 'week' },
  { amount: 12, unit: 'month' },
  { amount: Number.POSITIVE_INFINITY, unit: 'year' },
];

/** e.g. "2 months ago" / "2 മാസം മുൻപ്" */
export function formatRelativeDate(
  raw: string | undefined,
  lang: LanguageCode
): string | null {
  const date = parsePoemDate(raw);
  if (!date) return null;

  try {
    const rtf = new Intl.RelativeTimeFormat(INTL_LOCALE[lang], { numeric: 'auto' });
    let duration = (date.getTime() - Date.now()) / 1000;

    for (const division of DIVISIONS) {
      if (Math.abs(duration) < division.amount) {
        return rtf.format(Math.round(duration), division.unit);
      }
      duration /= division.amount;
    }
    return null;
  } catch {
    return null;
  }
}

/** Newest first. Entries without a date keep their original relative order, at the end. */
export function sortByNewest<T extends { publishedAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = parsePoemDate(a.publishedAt)?.getTime();
    const dateB = parsePoemDate(b.publishedAt)?.getTime();
    if (dateA === undefined && dateB === undefined) return 0;
    if (dateA === undefined) return 1;
    if (dateB === undefined) return -1;
    return dateB - dateA;
  });
}
