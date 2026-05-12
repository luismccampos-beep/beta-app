import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type PreferencesPayload = Record<string, unknown>;

export async function POST(req: Request) {
  const baseUrl = process.env.ML_SERVICE_BASE_URL?.trim();
  const apiKey = process.env.ML_SERVICE_API_KEY?.trim();
  if (!baseUrl) {
    return NextResponse.json(
      { ok: false, message: 'ML service is not configured (ML_SERVICE_BASE_URL).' },
      { status: 503 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    preferences?: PreferencesPayload;
    locale?: string;
  };

  const preferences = body.preferences ?? {};
  const locale = (body.locale ?? 'pt').toString();

  const query = `Generate short travel insights and recommended next steps based on these preferences:\n\n${JSON.stringify(
    preferences,
    null,
    2,
  )}`;

  const upstreamUrl = new URL(`${baseUrl.replace(/\/$/, '')}/v1/unified/query`);
  const res = await fetch(upstreamUrl.toString(), {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(apiKey ? { 'x-api-key': apiKey } : {}),
    },
    body: JSON.stringify({
      query,
      context: { source: 'web-preferences', locale },
      user_preferences: preferences,
      include_explanation: false,
      include_alternatives: false,
      max_sources: 5,
      language: locale,
    }),
    cache: 'no-store',
  });

  const data = (await res.json().catch(() => ({}))) as {
    success?: boolean;
    data?: { answer?: string; confidence?: number };
    error?: string;
    detail?: string;
  };

  if (!res.ok || data.success === false) {
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
}

