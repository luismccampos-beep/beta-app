import type { MockDestination } from './mock-travel/types';

const IATA_RE = /^[A-Z0-9]{3}$/;

function normalizeIata(value: string | null | undefined): string | null {
  const code = value?.trim().toUpperCase() ?? '';
  return IATA_RE.test(code) ? code : null;
}

/** Prefer transport enrich, then destination field, then flight fallback. */
export function resolveDestinationIata(
  dest: Pick<MockDestination, 'iata' | 'transporte'>,
  flightIata?: string | null,
): string | null {
  const transport = dest.transporte as { aeroporto?: { iata?: string } } | null | undefined;
  const fromTransport = normalizeIata(transport?.aeroporto?.iata);
  if (fromTransport) return fromTransport;

  const fromDest = normalizeIata(dest.iata);
  if (fromDest) return fromDest;

  return normalizeIata(flightIata);
}
