import {
  getDestinationByIataFromDb,
  getFlightsFromDb,
  getHotelsFromDb,
  getHotelStatsForDestinations,
  listTopDestinationIatasFromDb,
} from '../catalog-db';
import { rankResultsWithMlAndPreferences } from '../ml-ranking';
import type { MockSearchInput, MockSearchOutput } from '../mock-travel/search';
import type { MockHotel } from '../mock-travel/types';
import { pickBestAccommodationHotel } from '../hotel-filter';
import {
  buildCatalogTravelResult,
  pickCheapestFlight,
} from '../mock-travel/search';

export async function searchDbTravelResults(input: MockSearchInput): Promise<MockSearchOutput> {
  const origin = input.origin.trim().toUpperCase();
  const iatas =
    input.destinationIatas.length > 0
      ? input.destinationIatas.map((s) => s.toUpperCase())
      : await listTopDestinationIatasFromDb(6);

  const results: MockSearchOutput['results'] = [];
  const errors: MockSearchOutput['errors'] = [];
  const iataHints = new Map<string, string>();

  for (const destIata of iatas) {
    if (destIata === origin) continue;

    const dest = await getDestinationByIataFromDb(destIata);
    if (!dest) {
      errors.push({ destination: destIata, message: 'Destino não encontrado na base de dados' });
      continue;
    }

    const resolvedIata = dest.iata ?? destIata;
    const flights =
      input.mode === 'hotels'
        ? []
        : await getFlightsFromDb({
            origin,
            destinoId: dest.id,
            destinoIata: resolvedIata,
          });
    const flight = input.mode === 'hotels' ? null : pickCheapestFlight(flights, input.cabinClass);
    const hotels =
      input.mode === 'flights' ? [] : await getHotelsFromDb({ destinoId: dest.id, limit: 24 });
    const hotel = (input.mode === 'flights' ? null : pickBestAccommodationHotel(hotels)) as MockHotel | null;

    if (input.mode === 'flights' && !flight) {
      errors.push({ destination: destIata, message: 'Sem voos na base para esta rota' });
      continue;
    }
    if (input.mode === 'hotels' && !hotel) {
      errors.push({ destination: destIata, message: 'Sem hotéis na base para este destino' });
      continue;
    }

    const result = buildCatalogTravelResult({
      dest,
      destIata: resolvedIata,
      origin,
      flight,
      hotel,
      mode: input.mode,
      nights: input.nights,
      tripType: input.tripType,
      departureDate: input.departureDate,
      returnDate: input.returnDate,
    });

    if (result) {
      results.push(result);
      iataHints.set(result.id, resolvedIata);
    } else {
      errors.push({ destination: destIata, message: 'Não foi possível montar o pacote' });
    }
  }

  // Enrich results with hotel type breakdown per destination
  if (results.length > 0) {
    const destIdToResult = new Map<number, (typeof results)[number]>();
    for (const r of results) {
      const m = r.destinationSlug?.match(/^(?:pt|en|es|fr)-(\d+)$/);
      if (m) destIdToResult.set(parseInt(m[1], 10), r);
    }
    if (destIdToResult.size > 0) {
      const statsMap = await getHotelStatsForDestinations([...destIdToResult.keys()]);
      for (const [destId, r] of destIdToResult) {
        const stats = statsMap.get(destId);
        if (stats?.hotelTypes) r.hotelTypes = stats.hotelTypes;
      }
    }
  }

  const { results: ranked, mlUsed } = await rankResultsWithMlAndPreferences(
    results,
    input.preferences,
    iataHints,
    input.origin,
  );
  if (!mlUsed) {
    ranked.sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  }

  return { results: ranked, errors };
}
