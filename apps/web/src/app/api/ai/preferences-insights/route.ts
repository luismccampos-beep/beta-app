import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiHandler } from '@/lib/api/handler';
import { unifiedQuery } from '@/lib/ml-service/client';

export const dynamic = 'force-dynamic';

const PreferencesInsightsSchema = z.object({
  preferences: z.record(z.string(), z.unknown()).default({}),
  locale: z.string().optional().default('pt'),
});

export const POST = apiHandler(async (req: Request) => {
  const { preferences, locale } = PreferencesInsightsSchema.parse(await req.json());

  const query = `Generate short travel insights and recommended next steps based on these preferences:\n\n${JSON.stringify(
    preferences,
    null,
    2,
  )}`;

  const data = await unifiedQuery({
    query,
    context: { source: 'web-preferences', locale },
    user_preferences: preferences,
    include_explanation: false,
    include_alternatives: false,
    max_sources: 5,
    language: locale,
  });

  // ML service unavailable or circuit open — graceful degradation
  if (!data) {
    return NextResponse.json({
      ok: true,
      answer: null,
      confidence: null,
    });
  }

  if (!data.success) {
    return NextResponse.json(
      {
        ok: false,
        message: data.detail || data.error || 'ML service request failed',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    answer: data.data?.answer ?? '',
    confidence: data.data?.confidence ?? null,
  });
});

