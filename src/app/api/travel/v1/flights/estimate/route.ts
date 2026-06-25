import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { estimateFlightPrice, scoreFlight } from '../../../../../../lib/travel/flight-price-estimator';
import { isTravelCatalogDbEnabled } from '../../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

const FlightEstimateQuerySchema = z.object({
  origin: z.string().min(1),
  dest: z.string().min(1),
  month: z.coerce.number().int().min(1).max(12).optional(),
  distanceKm: z.coerce.number().positive().optional(),
  passengers: z.coerce.number().int().min(1).default(1),
  budget: z.coerce.number().positive().optional(),
  tripNights: z.coerce.number().int().min(1).default(7),
}).refine((data) => data.origin.toUpperCase() !== data.dest.toUpperCase(), {
  message: 'origin and dest must be different',
  path: ['dest'],
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = FlightEstimateQuerySchema.parse(Object.fromEntries(url.searchParams));
  const origin = params.origin.trim().toUpperCase();
  const dest = params.dest.trim().toUpperCase();

  let dbStats = null;
  if (isTravelCatalogDbEnabled()) {
    try {
      const { prisma } = await import('../../../../../../lib/prisma');
      dbStats = await prisma.flightPriceStatistic.findMany({
        where: {
          route: {
            origin: { code: origin },
            dest: { code: dest },
          },
          mes: params.month ?? undefined,
        },
        orderBy: { ano: 'desc' },
        take: 12,
      });
    } catch {
      // DB might not be available
    }
  }

  const estimate = estimateFlightPrice({
    originIata: origin,
    destIata: dest,
    month: params.month,
    distanceKm: params.distanceKm,
    passengers: params.passengers,
  });

  let score: number | null = null;
  if (params.budget != null && params.budget > 0) {
    score = scoreFlight(estimate.estimatedPricePerTraveler, params.budget, params.tripNights);
  }

  return NextResponse.json({
    ok: true,
    origin,
    dest,
    month: params.month ?? new Date().getMonth() + 1,
    estimate,
    score,
    dbStatsCount: dbStats?.length ?? 0,
    message: estimate.isEstimate
      ? 'Preço médio estimado baseado em dados históricos — não é preço garantido'
      : 'Preço em tempo real (live)',
  });
});
