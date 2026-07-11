import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { recommendDestinations } from '../../../../../lib/travel/trip-recommendation';
import type { CompactTravelPreferences } from '../../../../../lib/travel/preference-match';
import { decodeTravelPreferencesCompact } from '../../../../../lib/travel/travel-preferences-query';

export const dynamic = 'force-dynamic';

const RecommendQuerySchema = z.object({
  prefs: z.string().optional(),
  nights: z.coerce.number().int().min(1).default(5),
  travelers: z.coerce.number().int().min(1).default(1),
  origin: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  budgetFilter: z.enum(['0', '1', 'true', 'false']).default('1'),
  lang: z.string().default('pt'),
});

const RecommendBodySchema = z.object({
  preferences: z.record(z.string(), z.unknown()),
  nights: z.number().int().min(1).optional().default(5),
  travelers: z.number().int().min(1).optional().default(1),
  originIata: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(12),
  budgetFilter: z.boolean().optional().default(true),
  lang: z.string().optional().default('pt'),
});

export const GET = apiHandler(async (req: Request) => {
  const url = new URL(req.url);
  const params = RecommendQuerySchema.parse(Object.fromEntries(url.searchParams));

  const prefs = decodeTravelPreferencesCompact(params.prefs) ?? ({} as CompactTravelPreferences);

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

  const { source, destinations } = await recommendDestinations({
    preferences: prefs,
    nights: params.nights,
    travelers: params.travelers,
    originIata: params.origin?.trim() || undefined,
    limit: params.limit,
    budgetFilter: params.budgetFilter === '1' || params.budgetFilter === 'true',
    lang: params.lang,
  });

  return NextResponse.json({
    ok: true,
    source,
    disclaimer:
      'Preços de voo e hotéis são estimativas do catálogo (não garantia de preço em tempo real).',
    count: destinations.length,
    destinations,
  });
});

export const POST = apiHandler(async (req: Request) => {
  const body = RecommendBodySchema.parse(await req.json());

  const { source, destinations } = await recommendDestinations({
    preferences: body.preferences as CompactTravelPreferences,
    nights: body.nights,
    travelers: body.travelers,
    originIata: body.originIata,
    limit: body.limit,
    budgetFilter: body.budgetFilter,
    lang: body.lang,
  });

  return NextResponse.json({
    ok: true,
    source,
    disclaimer:
      'Preços de voo e hotéis são estimativas do catálogo (não garantia de preço em tempo real).',
    count: destinations.length,
    destinations,
  });
});
