import { NextResponse } from 'next/server';

import type { TravelResult } from '../../../components/data/mockResults';
import { defaultCruiseMonthFrom } from '../../../../lib/travel/buildCruiseQuery';
import {
  continentFromSiloahDestination,
  fetchSiloahVoyages,
  scoreFromCruisePrice,
  SILOAH_DESTINATION_IDS,
  type SiloahBrandTier,
  type SiloahShipType,
  type SiloahVoyage,
} from '../../../../lib/travel/siloah';

export const dynamic = 'force-dynamic';

const CRUISE_IMAGE =
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=70';

function parseDestination(raw: string | null): string | undefined {
  const v = raw?.trim();
  if (!v) return undefined;
  if ((SILOAH_DESTINATION_IDS as readonly string[]).includes(v)) return v;
  return undefined;
}

function parseTier(raw: string | null): SiloahBrandTier | undefined {
  const v = (raw ?? '').trim() as SiloahBrandTier;
  if (v === 'ultra_luxury' || v === 'luxury' || v === 'popular') return v;
  return undefined;
}

function parseShipType(raw: string | null): SiloahShipType | undefined {
  const v = (raw ?? '').trim() as SiloahShipType;
  if (v === 'ocean' || v === 'river' || v === 'expedition') return v;
  return undefined;
}

function parseIntParam(raw: string | null, min: number, max: number): number | undefined {
  if (!raw?.trim()) return undefined;
  const n = parseInt(raw, 10);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(max, Math.max(min, n));
}

function mapVoyageToTravelResult(v: SiloahVoyage, index: number): TravelResult {
  const destLabel =
    v.destinations[0] ?? v.departurePort ?? v.name ?? `Cruise ${index + 1}`;
  const continent = continentFromSiloahDestination(destLabel);
  const price = v.price ?? 0;
  const blurb = [
    v.brandName,
    v.shipName,
    v.sailDate ? `Sail ${v.sailDate}` : null,
    v.departurePort && v.arrivalPort ? `${v.departurePort} → ${v.arrivalPort}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return {
    id: `cruise-${encodeURIComponent(v.link || v.name)}-${index}`,
    destination: v.name || `${v.shipName} — ${destLabel}`,
    country: v.brandName || 'Cruise',
    continent,
    imageUrl: v.image?.trim() || CRUISE_IMAGE,
    aiMatchScore: scoreFromCruisePrice(v.price),
    rating: v.brandName.toLowerCase().includes('silversea') ? 4.9 : 4.6,
    reviews: 120 + (v.nights || 7) * 8,
    duration: Math.max(1, v.nights || 7),
    price,
    priceCurrency: 'USD',
    sustainable: false,
    productType: 'cruise',
    description: {
      en: blurb,
      pt: blurb,
      es: blurb,
      fr: blurb,
    },
    highlights: [v.brandName, v.shipName, v.sailDate].filter(Boolean),
    bestFor: ['Luxury cruise', v.brandName, `${v.nights} nights`].filter(Boolean),
    flight: { class: '—' },
    accommodation: { type: 'Cruise cabin' },
    cruise: {
      brandName: v.brandName,
      shipName: v.shipName,
      sailDate: v.sailDate,
      departurePort: v.departurePort,
      arrivalPort: v.arrivalPort,
      link: v.link,
    },
  };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const destination =
    parseDestination(url.searchParams.get('destination')) ?? 'Mediterranean';
  const brandName = url.searchParams.get('brandName')?.trim() || undefined;
  const departureCity = url.searchParams.get('departureCity')?.trim() || undefined;
  const monthFrom = url.searchParams.get('monthFrom')?.trim() || defaultCruiseMonthFrom(60);
  const minNights = parseIntParam(url.searchParams.get('minNights'), 1, 60);
  const maxNights = parseIntParam(url.searchParams.get('maxNights'), 1, 60);
  const maxPrice = parseIntParam(url.searchParams.get('maxPrice'), 100, 500_000);
  const tier = parseTier(url.searchParams.get('tier'));
  const shipType = parseShipType(url.searchParams.get('shipType'));

  try {
    const { total, voyages } = await fetchSiloahVoyages({
      destination,
      brandName,
      departureCity,
      monthFrom,
      minNights,
      maxNights,
      maxPrice,
    });

    const results = voyages.slice(0, 24).map(mapVoyageToTravelResult);

    return NextResponse.json({
      ok: true,
      results,
      errors: [],
      meta: {
        provider: 'siloah',
        destination,
        brandName: brandName ?? null,
        monthFrom,
        total,
        returned: results.length,
        tier: tier ?? null,
        shipType: shipType ?? null,
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Siloah cruise search failed';
    return NextResponse.json(
      {
        ok: false,
        message,
        results: [] as TravelResult[],
        errors: [{ message }],
      },
      { status: 502 },
    );
  }
}
