import { NextResponse } from 'next/server';

import { recommendDestinations } from '../../../../../lib/travel/trip-recommendation';
import type { CompactTravelPreferences } from '../../../../../lib/travel/preference-match';
import { decodeTravelPreferencesCompact } from '../../../../../lib/travel/travel-preferences-query';

export const dynamic = 'force-dynamic';

/**
 * Recomendação MVP: regras + custo diário estimado (não previsão ML de preços).
 *
 * GET /api/travel/v1/recommend?nights=5&travelers=2&origin=LIS&prefs=...&budgetFilter=1
 * POST { preferences, nights, travelers, originIata, limit, budgetFilter }
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const prefs =
    decodeTravelPreferencesCompact(url.searchParams.get('prefs')) ??
    ({} as CompactTravelPreferences);

  const nights = parseInt(url.searchParams.get('nights') ?? '5', 10);
  const travelers = parseInt(url.searchParams.get('travelers') ?? '1', 10);
  const originIata = url.searchParams.get('origin')?.trim() || undefined;
  const limit = parseInt(url.searchParams.get('limit') ?? '12', 10);
  const budgetFilter =
    url.searchParams.get('budgetFilter') === '1' ||
    url.searchParams.get('budgetFilter') === 'true';
  const lang = url.searchParams.get('lang')?.trim() || 'pt';

  if (!prefs.budgetRange && !prefs.activityTypes?.length && !prefs.travelStyles?.length) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Provide prefs (encoded) with budgetRange and/or activityTypes — use preferences form',
      },
      { status: 400 },
    );
  }

  try {
    const { source, destinations } = await recommendDestinations({
      preferences: prefs,
      nights: Number.isFinite(nights) ? nights : 5,
      travelers: Number.isFinite(travelers) ? travelers : 1,
      originIata,
      limit: Number.isFinite(limit) ? limit : 12,
      budgetFilter,
      lang,
    });

    return NextResponse.json({
      ok: true,
      source,
      disclaimer:
        'Preços de voo e hotéis são estimativas do catálogo (não garantia de preço em tempo real).',
      count: destinations.length,
      destinations,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Recommendation failed';
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }
}

export async function POST(req: Request) {
  let body: {
    preferences?: CompactTravelPreferences;
    nights?: number;
    travelers?: number;
    originIata?: string;
    limit?: number;
    budgetFilter?: boolean;
    lang?: string;
  };

  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON' }, { status: 400 });
  }

  const prefs = body.preferences;
  if (!prefs) {
    return NextResponse.json({ ok: false, message: 'preferences required' }, { status: 400 });
  }

  try {
    const { source, destinations } = await recommendDestinations({
      preferences: prefs,
      nights: body.nights ?? 5,
      travelers: body.travelers ?? 1,
      originIata: body.originIata,
      limit: body.limit ?? 12,
      budgetFilter: body.budgetFilter ?? true,
      lang: body.lang ?? 'pt',
    });

    return NextResponse.json({
      ok: true,
      source,
      disclaimer:
        'Preços de voo e hotéis são estimativas do catálogo (não garantia de preço em tempo real).',
      count: destinations.length,
      destinations,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Recommendation failed';
    return NextResponse.json({ ok: false, message }, { status: 503 });
  }
}
