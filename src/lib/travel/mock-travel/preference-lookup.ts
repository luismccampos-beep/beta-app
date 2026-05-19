import type { TravelResult } from '../../../app/components/data/mockResults';
import type { CompactTravelPreferences } from '../preference-match';
import { applyPreferenceMatchScores } from '../preference-match';
import {
  getMockDestinationByIata,
  getMockDestinationByName,
  getMockHotelsForDestination,
} from './load';
import type { MockDestination, MockHotel } from './types';

export function iataFromMockResultId(id: string): string | null {
  const m = id.match(/^mock-\w+-[A-Z]{3}-([A-Z]{3})-/i);
  return m?.[1]?.toUpperCase() ?? null;
}

export function resolveMockDestinationForResult(
  result: TravelResult,
  destIataHint?: string,
): { dest: MockDestination; hotel: MockHotel | null } | null {
  const iata = destIataHint ?? iataFromMockResultId(result.id);
  const dest = iata
    ? getMockDestinationByIata(iata)
    : getMockDestinationByName(result.destination);
  if (!dest) return null;
  const hotels = getMockHotelsForDestination(dest.id);
  const hotel =
    hotels.find((h) => result.accommodation.type.includes(h.nome)) ??
    hotels.sort((a, b) => a.preco_por_noite - b.preco_por_noite)[0] ??
    null;
  return { dest, hotel };
}

export function rankResultsByPreferences(
  results: TravelResult[],
  prefs: CompactTravelPreferences | null | undefined,
  destIataByResultId?: Map<string, string>,
): TravelResult[] {
  if (!prefs || !results.length) return results;
  return applyPreferenceMatchScores(results, prefs, (r) => {
    const hint = destIataByResultId?.get(r.id);
    return resolveMockDestinationForResult(r, hint);
  });
}
