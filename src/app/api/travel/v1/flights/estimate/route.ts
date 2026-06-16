import { NextResponse } from 'next/server';

import { estimateFlightPrice, scoreFlight } from '../../../../../../lib/travel/flight-price-estimator';
import { isTravelCatalogDbEnabled } from '../../../../../../lib/travel/catalog-db';

export const dynamic = 'force-dynamic';
export const maxDuration = 15;

/**
 * GET /api/travel/v1/flights/estimate
 *
 * Query params:
 *   origin      (obrigatório) IATA do aeroporto de origem, ex: "LIS"
 *   dest        (obrigatório) IATA do destino, ex: "FCO"
 *   month       (opcional) Mês da viagem 1-12. Default: mês corrente
 *   distanceKm  (opcional) Distância em km para fallback heurístico
 *   passengers  (opcional) Nº de passageiros. Default: 1
 *   budget      (opcional) Orçamento total em EUR
 *   tripNights  (opcional) Nº de noites da viagem (para scoring)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const origin = url.searchParams.get('origin')?.trim().toUpperCase();
  const dest = url.searchParams.get('dest')?.trim().toUpperCase();
  const monthParam = url.searchParams.get('month');
  const distanceKmParam = url.searchParams.get('distanceKm');
  const passengersParam = url.searchParams.get('passengers');
  const budgetParam = url.searchParams.get('budget');
  const tripNightsParam = url.searchParams.get('tripNights');

  // ── Validation ──────────────────────────────────────────────────
  if (!origin || !dest) {
    return NextResponse.json(
      { ok: false, message: 'origin and dest IATA codes required' },
      { status: 400 },
    );
  }

  if (origin === dest) {
    return NextResponse.json(
      { ok: false, message: 'origin and dest must be different' },
      { status: 400 },
    );
  }

  const monthRaw = monthParam ? parseInt(monthParam, 10) : NaN;
  const month = !isNaN(monthRaw) ? Math.max(1, Math.min(12, monthRaw)) : undefined;
  const distanceKmRaw = distanceKmParam ? parseFloat(distanceKmParam) : NaN;
  const distanceKm = !isNaN(distanceKmRaw) ? distanceKmRaw : undefined;
  const passengersRaw = passengersParam ? parseInt(passengersParam, 10) : NaN;
  const passengers = !isNaN(passengersRaw) ? Math.max(1, passengersRaw) : undefined;
  const budgetRaw = budgetParam ? parseFloat(budgetParam) : NaN;
  const budget = !isNaN(budgetRaw) ? budgetRaw : undefined;
  const tripNightsRaw = tripNightsParam ? parseInt(tripNightsParam, 10) : NaN;
  const tripNights = !isNaN(tripNightsRaw) ? Math.max(1, tripNightsRaw) : 7;

  // ── DB lookup (se configurado) ──────────────────────────────────
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
          mes: month ?? undefined,
        },
        orderBy: { ano: 'desc' },
        take: 12,
      });
    } catch {
      // DB might not be available
    }
  }

  // ── Estimate ────────────────────────────────────────────────────
  const estimate = estimateFlightPrice({
    originIata: origin,
    destIata: dest,
    month,
    distanceKm,
    passengers,
  });

  // ── Score (se budget fornecido) ─────────────────────────────────
  let score: number | null = null;
  if (budget != null && budget > 0) {
    score = scoreFlight(estimate.estimatedPricePerTraveler, budget, tripNights);
  }

  // ── Response ────────────────────────────────────────────────────
  return NextResponse.json({
    ok: true,
    origin,
    dest,
    month: month ?? new Date().getMonth() + 1,
    estimate,
    score,
    dbStatsCount: dbStats?.length ?? 0,
    message: estimate.isEstimate
      ? 'Preço médio estimado baseado em dados históricos — não é preço garantido'
      : 'Preço em tempo real (live)',
  });
}
