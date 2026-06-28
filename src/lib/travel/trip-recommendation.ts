import { prisma } from '../prisma';
import { buildDestinationSlug } from './destination-slug';
import { resolveDestinationImageUrl } from './destination-image';
import { resolveDestinationIata } from './destination-iata';
import { isAccommodationHotel } from './hotel-filter';
import { scoreWikivoyageInterests } from './destination-interests';
import {
  scoreDestinationMatch,
  softmaxToMatchPercents,
  type CompactTravelPreferences,
} from './preference-match';
import { estimateTripCost, type TripCostBreakdown } from './trip-cost-estimator';
import type { MockDestination, MockHotel } from './mock-travel/types';
import { rowToDestination } from './catalog-db';

function displayCountryFromCode(code: string | null | undefined, locale: string): string | null {
  const cc = (code ?? '').trim().toUpperCase();
  if (!cc || cc === 'XX') return null;
  try {
    const dn = new Intl.DisplayNames([locale], { type: 'region' });
    const label = dn.of(cc);
    return label && label !== cc ? label : null;
  } catch {
    return null;
  }
}

export type RecommendedDestination = {
  destinoId: number;
  slug: string;
  nome: string;
  pais: string;
  iata: string | null;
  tipo: string;
  matchScore: number;
  matchPercent: number;
  wikivoyageInterestScore: number;
  cost: TripCostBreakdown;
  hotel: Pick<MockHotel, 'id' | 'nome' | 'estrelas' | 'preco_por_noite'> | null;
  imageUrl?: string;
};

export type RecommendDestinationsInput = {
  preferences: CompactTravelPreferences;
  nights: number;
  travelers: number;
  originIata?: string;
  limit?: number;
  /** Só destinos dentro do orçamento máximo. */
  budgetFilter?: boolean;
  lang?: string;
};

async function recommendFromDb(input: RecommendDestinationsInput): Promise<RecommendedDestination[]> {
  const limit = Math.min(input.limit ?? 24, 60);
  const lang = input.lang ?? 'pt';
  const minStars =
    input.preferences.dailyBudgetProfile === 'luxo' ||
    input.preferences.budgetPriority === 'luxury'
      ? 4
      : 1;

  const rows = await prisma.wvDestination.findMany({
    where: { lang, hotelCount: { gt: 0 } },
    orderBy: { hotelCount: 'desc' },
    take: Math.min(limit * 6, 180),
  });

  if (!rows.length) return [];

  const destIds = rows.map((r: { id: number }) => r.id);
  const origin = input.originIata?.toUpperCase();

  const [allHotels, flightRows] = await Promise.all([
    prisma.wvHotel.findMany({
      where: {
        destinoId: { in: destIds },
        estrelas: { gte: minStars },
        NOT: { fonte: 'rejected_geo' },
      },
      orderBy: { precoPorNoite: 'asc' },
      select: {
        id: true,
        destinoId: true,
        nome: true,
        estrelas: true,
        precoPorNoite: true,
        fonte: true,
      },
    }),
    origin
      ? prisma.wvFlight.findMany({
          where: { origem: origin, destinoId: { in: destIds } },
          orderBy: { preco: 'asc' },
          distinct: ['destinoId'],
          select: { destinoId: true, preco: true, destinoIata: true },
        })
      : Promise.resolve([]),
  ]);

  const hotelByDest = new Map<number, (typeof allHotels)[0]>();
  for (const h of allHotels) {
    if (!isAccommodationHotel(h)) continue;
    if (!hotelByDest.has(h.destinoId)) hotelByDest.set(h.destinoId, h);
  }
  const flightByDest = new Map(flightRows.map((f: { destinoId: number; preco: number }) => [f.destinoId, f.preco]));
  const flightIataByDest = new Map(
    flightRows.map((f: { destinoId: number; destinoIata: string | null }) => [f.destinoId, f.destinoIata?.trim().toUpperCase() || null] as const),
  );

  const candidates: RecommendedDestination[] = [];
  const rawScores: number[] = [];

  for (const row of rows) {
    const dest = rowToDestination(row);
    if (!dest.paisCode || dest.paisCode === 'XX') continue;
    const hRow = hotelByDest.get(row.id);
    const hotel = hRow
      ? {
          id: hRow.id,
          destino_id: row.id,
          nome: hRow.nome,
          estrelas: hRow.estrelas,
          preco_por_noite: Number(hRow.precoPorNoite),
          comodidades: [] as string[],
        }
      : null;

    const flight = (flightByDest.get(row.id) as number | undefined) ?? null;
    const cost = estimateTripCost(dest, input, {
      hotel,
      flightPrice: flight,
      flightIsEstimate: true,
    });

    if (input.budgetFilter && !cost.withinBudget) continue;

    const wv = scoreWikivoyageInterests(dest, input.preferences.activityTypes);
    const rule = scoreDestinationMatch(dest, input.preferences, {
      hotel,
      nights: input.nights,
    });
    const combined = 0.72 * rule + 0.28 * wv;
    rawScores.push(combined);

    candidates.push({
      destinoId: row.id,
      slug: row.slug,
      nome: dest.nome,
      pais: displayCountryFromCode(dest.paisCode, lang) ?? dest.pais,
      iata: resolveDestinationIata(dest, flightIataByDest.get(row.id) as string | null | undefined),
      tipo: dest.tipo,
      matchScore: combined,
      matchPercent: 0,
      wikivoyageInterestScore: wv,
      cost,
      hotel: hotel
        ? {
            id: hotel.id,
            nome: hotel.nome,
            estrelas: hotel.estrelas,
            preco_por_noite: hotel.preco_por_noite,
          }
        : null,
      imageUrl: resolveDestinationImageUrl(dest),
    });
  }

  const percents = softmaxToMatchPercents(rawScores);
  return candidates
    .map((c, i) => ({ ...c, matchPercent: percents[i] ?? 50 }))
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, limit);
}

export async function recommendDestinations(
  input: RecommendDestinationsInput,
): Promise<{ source: 'db'; destinations: RecommendedDestination[] }> {
  const destinations = await recommendFromDb(input);
  return { source: 'db', destinations };
}

/** Resolve destino por id (DB). */
export async function getDestinationForRecommend(
  destinoId: number,
  lang = 'pt',
): Promise<MockDestination | null> {
  const row = await prisma.wvDestination.findFirst({
    where: { id: destinoId, lang },
  });
  if (row) return rowToDestination(row);
  return null;
}
