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

  const [loyaltyRes, airportsRes, accRes, chainsRes, facRes] = await Promise.all([
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
    hbKey && hbSecret
      ? fetchHotelbedsAccommodations(hbBase, hbKey, hbSecret, hbLanguage).catch((e: unknown) => {
          errors.push({
            source: 'hotelbeds',
            message: e instanceof Error ? e.message : 'Hotelbeds accommodations fetch failed',
          });
          return [];
        })
      : Promise.resolve([]),
    hbKey && hbSecret
      ? fetchHotelbedsChains(hbBase, hbKey, hbSecret, hbLanguage).catch((e: unknown) => {
          errors.push({
            source: 'hotelbeds',
            message: e instanceof Error ? e.message : 'Hotelbeds chains fetch failed',
          });
          return [];
        })
      : Promise.resolve([]),
    hbKey && hbSecret
      ? fetchHotelbedsFacilities(hbBase, hbKey, hbSecret, hbLanguage, 150).catch((e: unknown) => {
          errors.push({
            source: 'hotelbeds',
            message: e instanceof Error ? e.message : 'Hotelbeds facilities fetch failed',
          });
          return [];
        })
      : Promise.resolve([]),
  ]);

  const airportsSorted = [...airportsRes].sort((a, b) =>
    (a.cityName ?? a.name).localeCompare(b.cityName ?? b.name),
  );

  return NextResponse.json({
    configured: {
      duffel: Boolean(duffelToken),
      hotelbeds: Boolean(hbKey && hbSecret),
    },
    duffelCabinClasses: DUFFEL_CABIN_CLASSES.map((c) => ({ value: c.value, label: c.label })),
    loyaltyProgrammes: loyaltyRes.map((p) => ({
      id: p.id,
      label: [p.alliance, p.name].filter(Boolean).join(' · '),
    })),
    airports: airportsSorted.map((a) => ({
      iataCode: a.iataCode,
      label: `${a.cityName ?? a.name} (${a.iataCode})`,
      country: a.iataCountryCode,
    })),
    accommodations: accRes,
    chains: chainsRes,
    facilities: facRes,
    errors,
  });
}
