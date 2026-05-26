import type { MockDestination } from './mock-travel/types';

/** Stable URL id: `pt-42`, `en-1203` */
export function buildDestinationSlug(dest: Pick<MockDestination, 'id' | 'lang'>): string {
  return `${dest.lang ?? 'pt'}-${dest.id}`;
}

export function parseDestinationSlug(slug: string): { lang: string; id: number } | null {
  const decoded = decodeURIComponent(slug.trim());
  const m = decoded.match(/^([a-z]{2})-(\d+)$/i);
  if (!m) return null;
  const id = parseInt(m[2], 10);
  if (!Number.isFinite(id) || id < 1) return null;
  return { lang: m[1].toLowerCase(), id };
}
