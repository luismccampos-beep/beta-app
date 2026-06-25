import { prisma } from '../prisma';

export interface NearbyResult {
  id: string;
  nome: string;
  distance_km: number;
}

export async function getNearbyHotels(
  lat: number,
  lng: number,
  radiusKm = 50,
  limit = 20,
): Promise<NearbyResult[]> {
  const rows = await prisma.$queryRaw<NearbyResult[]>`
    SELECT
      id,
      nome,
      ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
      ) / 1000 AS distance_km
    FROM wv_hotels
    WHERE location IS NOT NULL
      AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
        ${radiusKm * 1000}
      )
    ORDER BY location <-> ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography
    LIMIT ${limit}
  `;
  return rows;
}
