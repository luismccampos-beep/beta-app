import type { TravelResult } from '../../app/components/data/mockResults';
import {
  scoreDestinationMatch,
  softmaxToMatchPercents,
  applyPreferenceMatchScores,
  type CompactTravelPreferences,
  type DestinationLookup,
} from './preference-match';
import { getDestinationByIataFromDb } from './catalog-db';
import { iataFromMockResultId } from './result-id-utils';
import { resolveDestinationsForResults, type ResolvedResult } from './resolve-destination';
import {
  fetchRoadDistanceBatch,
  proximityScoreFromKm,
  type LatLon,
  type RoadDistanceResult,
} from './road-distance';
import { rankDestinations } from '../ml-service/client';
import type { TravelRankCandidate } from '../ml-service/types';

export type MlRankScore = {
  score: number;
  confidence: number;
  itemId?: string;
};

const ML_RULE_BLEND = 0.45;
const ROAD_DISTANCE_BLEND = 0.12;

function coordsFromDestination(dest: {
  latitude?: number | null;
  longitude?: number | null;
  transporte?: { aeroporto?: { lat: number; lon: number } } | null;
}): LatLon | null {
  const lat = dest.latitude ?? dest.transporte?.aeroporto?.lat;
  const lon = dest.longitude ?? dest.transporte?.aeroporto?.lon;
  if (lat == null || lon == null || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

async function coordsForOriginIata(originIata: string): Promise<LatLon | null> {
  const dest = await getDestinationByIataFromDb(originIata);
  if (!dest) return null;
  return coordsFromDestination(dest);
}

function coordsForResult(
  result: TravelResult,
  resolvedMap: Map<string, ResolvedResult>,
  destIataHint?: string,
): LatLon | null {
  const iata = destIataHint ?? iataFromMockResultId(result.id);
  if (iata) {
    const entry = resolvedMap.get(result.id);
    if (entry) return coordsFromDestination(entry.dest);
  }
  return null;
}

/**
 * Call ml-service POST /v1/travel/rank for candidate destinations.
 * Uses centralized MlServiceClient with circuit breaker.
 */
export async function fetchMlTravelRankScores(
  results: TravelResult[],
  preferences: CompactTravelPreferences,
): Promise<Map<string, MlRankScore>> {
  const out = new Map<string, MlRankScore>();
  if (results.length === 0) return out;

  const resolvedMap = await resolveDestinationsForResults(results);

  const candidates: TravelRankCandidate[] = results.map((r) => {
    const info = resolvedMap.get(r.id);
    return {
      destino_id: info?.dest.id,
      iata: info?.dest.iata ?? iataFromMockResultId(r.id) ?? undefined,
      lang: info?.dest.lang ?? 'pt',
      nome: r.destination,
    };
  });

  const data = await rankDestinations(preferences, candidates, results.length);

  if (!data?.success || !data.rankings?.length) return out;

  for (const r of results) {
    const iata = iataFromMockResultId(r.id);
    const info = resolvedMap.get(r.id);
    const destId = info?.dest.id;
    const match = data.rankings.find(
      (row) =>
        (iata && row.iata?.toUpperCase() === iata) ||
        (destId != null && row.destino_id === destId),
    );
    if (match && typeof match.score === 'number') {
      out.set(r.id, {
        score: match.score,
        confidence: match.confidence ?? match.score,
        itemId: match.id,
      });
    }
  }

  return out;
}

/** Rule-based scores + optional ML embedding + SCGraph road proximity → softmax %. */
export async function rankResultsWithMlAndPreferences(
  results: TravelResult[],
  preferences: CompactTravelPreferences | null | undefined,
  destIataByResultId?: Map<string, string>,
  originIata?: string,
): Promise<{ results: TravelResult[]; mlUsed: boolean; roadDistanceUsed: boolean }> {
  if (!preferences || !results.length) {
    return { results, mlUsed: false, roadDistanceUsed: false };
  }

  const resolvedMap = await resolveDestinationsForResults(results, destIataByResultId);

  const syncLookup: DestinationLookup = (r) => {
    const entry = resolvedMap.get(r.id);
    return entry ?? null;
  };

  const mlScores = await fetchMlTravelRankScores(results, preferences);
  const mlUsed = mlScores.size > 0;

  let roadByResultId = new Map<string, RoadDistanceResult>();
  const originCoords = originIata ? await coordsForOriginIata(originIata) : null;
  if (originCoords) {
    const destPoints: Array<{ id: string; lat: number; lon: number }> = [];
    for (const r of results) {
      const iata = destIataByResultId?.get(r.id) ?? iataFromMockResultId(r.id);
      const c = coordsForResult(r, resolvedMap, iata ?? undefined);
      if (c) destPoints.push({ id: r.id, lat: c.lat, lon: c.lon });
    }
    if (destPoints.length) {
      roadByResultId = await fetchRoadDistanceBatch(originCoords, destPoints);
    }
  }
  const roadDistanceUsed = roadByResultId.size > 0;

  if (!mlUsed && !roadDistanceUsed) {
    return {
      results: applyPreferenceMatchScores(results, preferences, syncLookup),
      mlUsed: false,
      roadDistanceUsed: false,
    };
  }

  const raw: number[] = [];
  for (const r of results) {
    const info = resolvedMap.get(r.id);
    const ruleScore = info
      ? scoreDestinationMatch(info.dest, preferences, {
          hotel: info.hotel ?? undefined,
          nights: r.duration,
          sustainable: r.sustainable,
        })
      : 0.5;
    const ml = mlScores.get(r.id);
    const mlNorm = ml ? Math.min(1, Math.max(0, ml.score)) : 0.5;
    const priceNorm = Math.min(1, Math.max(0, r.aiMatchScore / 100));
    const road = roadByResultId.get(r.id);
    const roadNorm = road ? proximityScoreFromKm(road.distanceKm) : 0.5;

    const mlPart = mlUsed ? ML_RULE_BLEND * mlNorm : 0;
    const rulePart = mlUsed ? (1 - ML_RULE_BLEND) * ruleScore : ruleScore;
    const roadPart = roadDistanceUsed ? ROAD_DISTANCE_BLEND * roadNorm : 0;
    const baseWeight = 1 - (roadDistanceUsed ? ROAD_DISTANCE_BLEND : 0);

    raw.push(baseWeight * (rulePart + mlPart) + roadPart + 0.1 * priceNorm);
  }

  const percents = softmaxToMatchPercents(raw);
  const ranked = results.map((r, i) => ({
    ...r,
    aiMatchScore: percents[i] ?? r.aiMatchScore,
  }));
  ranked.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

  return { results: ranked, mlUsed, roadDistanceUsed };
}
