/**
 * Road / network distance via ml-service SCGraph (world_highways).
 * Uses centralized MlServiceClient with circuit breaker.
 */

import { getRoadDistance, getRoadDistanceBatch } from '../ml-service/client';

export type LatLon = { lat: number; lon: number };

export type RoadDistanceResult = {
  id?: string;
  distanceKm: number;
  method: 'scgraph' | 'haversine' | string;
};

/** Single origin → destination distance (km). */
export async function fetchRoadDistanceKm(
  origin: LatLon,
  destination: LatLon,
): Promise<RoadDistanceResult | null> {
  const data = await getRoadDistance(origin, destination);
  if (!data?.success || data.distance_km == null) return null;
  return {
    distanceKm: data.distance_km,
    method: (data.method as RoadDistanceResult['method']) ?? 'scgraph',
  };
}

/** Batch distances for ranking (max 50 per call — enforced by ML service schema). */
export async function fetchRoadDistanceBatch(
  origin: LatLon,
  destinations: Array<{ id: string; lat: number; lon: number }>,
): Promise<Map<string, RoadDistanceResult>> {
  const out = new Map<string, RoadDistanceResult>();
  if (destinations.length === 0) return out;

  // Chunk into max 50 per request (ML service Pydantic: max_length=50)
  const chunkSize = 50;
  for (let i = 0; i < destinations.length; i += chunkSize) {
    const chunk = destinations.slice(i, i + chunkSize);
    const data = await getRoadDistanceBatch(
      origin,
      chunk.map((d) => ({ id: d.id, lat: d.lat, lon: d.lon })),
    );

    if (!data?.success || !data.results) continue;

    for (const row of data.results) {
      if (row.id && row.distance_km != null && Number.isFinite(row.distance_km)) {
        out.set(row.id, {
          id: row.id,
          distanceKm: row.distance_km,
          method: (row.method as RoadDistanceResult['method']) ?? 'scgraph',
        });
      }
    }
  }

  return out;
}

/** 0–1 score: closer destinations score higher (~800 km scale). */
export function proximityScoreFromKm(distanceKm: number): number {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) return 0.5;
  return Math.exp(-distanceKm / 800);
}
