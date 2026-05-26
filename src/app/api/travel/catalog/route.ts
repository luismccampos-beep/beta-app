import { NextResponse } from 'next/server';

import {
  DUFFEL_CABIN_CLASSES,
  fetchDuffelAirportsPage,
  fetchDuffelLoyaltyProgrammes,
} from '../../../../lib/travel/duffel';
import {
  fetchHotelbedsAccommodations,
  fetchHotelbedsChains,
  fetchHotelbedsFacilities,
  localeToHotelbedsLanguage,
} from '../../../../lib/travel/hotelbeds';
import { getMockCatalogData } from '../../../../lib/travel/mock-travel/catalog';
import { shouldUseMockHotels } from '../../../../lib/travel/mock-travel/load';
import { isLiteApiConfigured } from '../../../../lib/travel/liteapi';
import { isScrapeDoConfigured } from '../../../../lib/travel/scrape-do';
import { fetchSiloahBrands, SILOAH_DESTINATION_IDS } from '../../../../lib/travel/siloah';

export const dynamic = 'force-dynamic';

type CatalogError = { source: string; message: string };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const locale = searchParams.get('locale') ?? 'en';
  const hbLanguage = localeToHotelbedsLanguage(locale);

  const duffelToken = process.env.DUFFEL_ACCESS_TOKEN?.trim();
  const hbKey = process.env.HOTELBEDS_API_KEY?.trim();
  const hbSecret = process.env.HOTELBEDS_API_SECRET?.trim();
  const hbBase =
    process.env.HOTELBEDS_API_BASE_URL?.trim() || 'https://api.test.hotelbeds.com';

  const errors: CatalogError[] = [];
  const useMockHotels = shouldUseMockHotels(hbKey, hbSecret);
  let mockCatalog: ReturnType<typeof getMockCatalogData> | null = null;
  if (useMockHotels) {
    try {
      mockCatalog = getMockCatalogData();
    } catch (e: unknown) {
      errors.push({
        source: 'mock',
        message: e instanceof Error ? e.message : 'Mock catalog load failed',
      });
    }
  }

  const [loyaltyRes, airportsRes, accRes, chainsRes, facRes, cruiseBrandsRes] = await Promise.all([
    duffelToken
      ? fetchDuffelLoyaltyProgrammes(duffelToken).catch((e: unknown) => {
          errors.push({
            source: 'duffel',
            message: e instanceof Error ? e.message : 'Duffel loyalty fetch failed',
          });
          return [];
        })
      : Promise.resolve([]),
    duffelToken
      ? fetchDuffelAirportsPage(duffelToken, 100).catch((e: unknown) => {
          errors.push({
            source: 'duffel',
            message: e instanceof Error ? e.message : 'Duffel airports fetch failed',
          });
          return [];
        })
      : Promise.resolve([]),
    hbKey && hbSecret && !useMockHotels
      ? fetchHotelbedsAccommodations(hbBase, hbKey, hbSecret, hbLanguage).catch((e: unknown) => {
          errors.push({
            source: 'hotelbeds',
            message: e instanceof Error ? e.message : 'Hotelbeds accommodations fetch failed',
          });
          return [];
        })
      : Promise.resolve(mockCatalog?.accommodations ?? []),
    hbKey && hbSecret && !useMockHotels
      ? fetchHotelbedsChains(hbBase, hbKey, hbSecret, hbLanguage).catch((e: unknown) => {
          errors.push({
            source: 'hotelbeds',
            message: e instanceof Error ? e.message : 'Hotelbeds chains fetch failed',
          });
          return [];
        })
      : Promise.resolve(mockCatalog?.chains ?? []),
    hbKey && hbSecret && !useMockHotels
      ? fetchHotelbedsFacilities(hbBase, hbKey, hbSecret, hbLanguage, 150).catch((e: unknown) => {
          errors.push({
            source: 'hotelbeds',
            message: e instanceof Error ? e.message : 'Hotelbeds facilities fetch failed',
          });
          return [];
        })
      : Promise.resolve(mockCatalog?.facilities ?? []),
    fetchSiloahBrands({ tier: 'luxury' }).catch((e: unknown) => {
      errors.push({
        source: 'siloah',
        message: e instanceof Error ? e.message : 'Siloah brands fetch failed',
      });
      return [];
    }),
  ]);

  const duffelAirports = airportsRes.map((a) => ({
    iataCode: a.iataCode,
    label: `${a.cityName ?? a.name} (${a.iataCode})`,
    country: a.iataCountryCode,
  }));
  const mockAirports = mockCatalog?.airports ?? [];
  const airportMap = new Map<string, { iataCode: string; label: string; country: string | null }>();
  for (const a of [...mockAirports, ...duffelAirports]) {
    airportMap.set(a.iataCode, a);
  }
  const airportsSorted = [...airportMap.values()].sort((a, b) => a.label.localeCompare(b.label));

  return NextResponse.json({
    configured: {
      duffel: Boolean(duffelToken),
      scrapeDo: isScrapeDoConfigured(),
      hotelbeds: Boolean(hbKey && hbSecret),
      liteapi: isLiteApiConfigured(),
      mockHotels: Boolean(mockCatalog),
      siloah: cruiseBrandsRes.length > 0,
    },
    cruiseDestinations: SILOAH_DESTINATION_IDS.map((id) => ({ id, label: id })),
    cruiseBrands: cruiseBrandsRes.map((b) => ({
      name: b.name,
      tier: b.tier,
      label: b.name,
      shipCount: b.shipCount,
    })),
    duffelCabinClasses: DUFFEL_CABIN_CLASSES.map((c) => ({ value: c.value, label: c.label })),
    loyaltyProgrammes: loyaltyRes.map((p) => ({
      id: p.id,
      label: [p.alliance, p.name].filter(Boolean).join(' · '),
    })),
    airports: airportsSorted,
    accommodations: accRes,
    chains: chainsRes,
    facilities: facRes,
    errors,
  });
}
