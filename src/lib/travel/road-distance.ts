/**
 * Road / network distance via ml-service SCGraph (world_highways).
 */

export type LatLon = { lat: number; lon: number };

export type RoadDistanceResult = {
  id?: string;
  distanceKm: number;
  method: 'scgraph' | 'haversine' | string;
};

function mlServiceBaseUrl(): string | null {
  const url = process.env.ML_SERVICE_BASE_URL?.trim();
  return url ? url.replace(/\/$/, '') : null;
}

/** Single origin → destination distance (km). */
export async function fetchRoadDistanceKm(
  origin: LatLon,
  destination: LatLon,
): Promise<RoadDistanceResult | null> {
  const base = mlServiceBaseUrl();
  if (!base) return null;

  const apiKey = process.env.ML_SERVICE_API_KEY?.trim();
  try {
    const res = await fetch(`${base}/v1/travel/distance`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(apiKey ? { 'x-api-key': apiKey } : {}),
      },
      body: JSON.stringify({
        origin,
        destination,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(60_000),
    });
    const data = (await res.json()) as {
      success?: boolean;
      distance_km?: number;
      method?: string;
    };
    if (!res.ok || !data.success || data.distance_km == null) return null;
    return {
      distanceKm: data.distance_km,
      method: (data.method as RoadDistanceResult['method']) ?? 'scgraph',
    };
  } catch {
    return null;
  }
}

/** Batch distances for ranking (max 50 per call). */
export async function fetchRoadDistanceBatch(
  origin: LatLon,
  destinations: Array<{ id: string; lat: number; lon: number }>,
): Promise<Map<string, RoadDistanceResult>> {
  const out = new Map<string, RoadDistanceResult>();
  const base = mlServiceBaseUrl();
  if (!base || destinations.length === 0) return out;

  const apiKey = process.env.ML_SERVICE_API_KEY?.trim();
  const chunkSize = 50;

  for (let i = 0; i < destinations.length; i += chunkSize) {
    const chunk = destinations.slice(i, i + chunkSize);
    try {
      const res = await fetch(`${base}/v1/travel/distance/batch`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(apiKey ? { 'x-api-key': apiKey } : {}),
        },
        body: JSON.stringify({
          origin,
          destinations: chunk.map((d) => ({ id: d.id, lat: d.lat, lon: d.lon })),
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(120_000),
      });
      const data = (await res.json()) as {
        success?: boolean;
        results?: Array<{
          id?: string;
          distance_km?: number | null;
          method?: string;
        }>;
      };
      if (!res.ok || !data.success || !data.results) continue;
      for (const row of data.results) {
        if (row.id && row.distance_km != null && Number.isFinite(row.distance_km)) {
          out.set(row.id, {
            id: row.id,
            distanceKm: row.distance_km,
            method: (row.method as RoadDistanceResult['method']) ?? 'scgraph',
          });
        }
      }
    } catch {
      continue;
    }
  }

  return out;
}

/** 0–1 score: closer destinations score higher (~800 km scale). */
export function proximityScoreFromKm(distanceKm: number): number {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return 0.5;
  return Math.exp(-distanceKm / 800);
}
