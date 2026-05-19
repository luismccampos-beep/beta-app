import type { TravelResult } from '../../app/components/data/mockResults';
import {
  scoreDestinationMatch,
  softmaxToMatchPercents,
  type CompactTravelPreferences,
} from './preference-match';
import {
  iataFromMockResultId,
  rankResultsByPreferences,
  resolveMockDestinationForResult,
} from './mock-travel/preference-lookup';

export type MlRankScore = {
  score: number;
  confidence: number;
  itemId?: string;
};

const ML_RULE_BLEND = 0.45;

function mlServiceBaseUrl(): string | null {
  const url = process.env.ML_SERVICE_BASE_URL?.trim();
  return url ? url.replace(/\/$/, '') : null;
}

/**
 * Call ml-service POST /v1/travel/rank for candidate destinations.
 */
export async function fetchMlTravelRankScores(
  results: TravelResult[],
  preferences: CompactTravelPreferences,
): Promise<Map<string, MlRankScore>> {
  const base = mlServiceBaseUrl();
  const out = new Map<string, MlRankScore>();
  if (!base || results.length === 0) return out;

  const candidates = results.map((r) => {
    const info = resolveMockDestinationForResult(r);
    return {
      destino_id: info?.dest.id,
      iata: info?.dest.iata ?? iataFromMockResultId(r.id) ?? undefined,
      lang: info?.dest.lang ?? 'pt',
      nome: r.destination,
    };
  });

  const apiKey = process.env.ML_SERVICE_API_KEY?.trim();
  const url = `${base}/v1/travel/rank`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
      body: JSON.stringify({
        preferences,
        candidates,
        limit: results.length,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      rankings?: Array<{
        destino_id?: number;
        iata?: string;
        score?: number;
        confidence?: number;
        id?: string;
      }>;
    };

    if (!res.ok || !data.success || !data.rankings?.length) return out;

    for (const r of results) {
      const iata = iataFromMockResultId(r.id);
      const info = resolveMockDestinationForResult(r);
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
  } catch {
    return out;
  }

  return out;
}

/** Rule-based scores + optional ML embedding blend → softmax % on aiMatchScore. */
export async function rankResultsWithMlAndPreferences(
  results: TravelResult[],
  preferences: CompactTravelPreferences | null | undefined,
  destIataByResultId?: Map<string, string>,
): Promise<{ results: TravelResult[]; mlUsed: boolean }> {
  if (!preferences || !results.length) {
    return { results, mlUsed: false };
  }

  const mlScores = await fetchMlTravelRankScores(results, preferences);
  const mlUsed = mlScores.size > 0;

  if (!mlUsed) {
    return {
      results: rankResultsByPreferences(results, preferences, destIataByResultId),
      mlUsed: false,
    };
  }

  const raw: number[] = [];
  for (const r of results) {
    const info = resolveMockDestinationForResult(r, destIataByResultId?.get(r.id));
    const ruleScore = info
      ? scoreDestinationMatch(info.dest, preferences, {
          hotel: info.hotel,
          nights: r.duration,
          sustainable: r.sustainable,
        })
      : 0.5;
    const ml = mlScores.get(r.id);
    const mlNorm = ml ? Math.min(1, Math.max(0, ml.score)) : 0.5;
    const priceNorm = Math.min(1, Math.max(0, r.aiMatchScore / 100));
    raw.push(
      (1 - ML_RULE_BLEND) * ruleScore + ML_RULE_BLEND * mlNorm + 0.1 * priceNorm,
    );
  }

  const percents = softmaxToMatchPercents(raw);
  const ranked = results.map((r, i) => ({
    ...r,
    aiMatchScore: percents[i] ?? r.aiMatchScore,
  }));
  ranked.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

  return { results: ranked, mlUsed: true };
}
