import type { TravelResult } from '../../app/components/data/mockResults';
import type { MockDestination, MockHotel } from './mock-travel/types';
import { getDestinationByIataFromDb } from './catalog-db';
import { iataFromMockResultId } from './result-id-utils';

export type ResolvedResult = {
  dest: MockDestination;
  hotel: MockHotel | null;
};

export async function resolveDestinationForResult(
  result: TravelResult,
  destIataHint?: string,
): Promise<ResolvedResult | null> {
  const iata = destIataHint ?? iataFromMockResultId(result.id);
  if (!iata) return null;
  const dest = await getDestinationByIataFromDb(iata);
  if (!dest) return null;
  return { dest, hotel: null };
}

export async function resolveDestinationsForResults(
  results: TravelResult[],
  destIataByResultId?: Map<string, string>,
): Promise<Map<string, ResolvedResult>> {
  const map = new Map<string, ResolvedResult>();
  const iatas = new Map<string, string>();
  for (const r of results) {
    const iata = destIataByResultId?.get(r.id) ?? iataFromMockResultId(r.id);
    if (iata) iatas.set(r.id, iata);
  }
  const unique = [...new Set(iatas.values())];
  const dests = await Promise.all(unique.map((i) => getDestinationByIataFromDb(i)));
  const destByIata = new Map<string, MockDestination>();
  for (let i = 0; i < unique.length; i++) {
    const d = dests[i];
    if (d) destByIata.set(unique[i]!, d);
  }
  for (const [id, iata] of iatas) {
    const dest = destByIata.get(iata);
    if (dest) map.set(id, { dest, hotel: null });
  }
  return map;
}
