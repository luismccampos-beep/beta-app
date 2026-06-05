const LOCALES = new Set(['en', 'pt', 'es', 'fr']);

/** Path to destination detail page, locale-aware. */
export function destinationDetailPath(slug: string, locale?: string | null): string {
  const safe = encodeURIComponent(slug);
  if (locale && LOCALES.has(locale)) return `/${locale}/destinations/${safe}`;
  return `/destinations/${safe}`;
}

/** Path to destinations browse / catalog page. */
export function destinationsBrowsePath(locale?: string | null): string {
  if (locale && LOCALES.has(locale)) return `/${locale}/destinations`;
  return '/destinations';
}

/** Path back to results preserving search query. */
export function resultsListPath(locale?: string | null, searchQuery?: string): string {
  const base = locale && LOCALES.has(locale) ? `/${locale}/results` : '/results';
  if (!searchQuery?.trim()) return base;
  const q = searchQuery.startsWith('?') ? searchQuery : `?${searchQuery}`;
  return `${base}${q}`;
}
