import { NextResponse } from 'next/server';

import {
  buildDestinationImageQuery,
  fetchUnsplashDestinationPhoto,
} from '../../../../lib/travel/unsplash';

export const dynamic = 'force-dynamic';

/** On-demand Unsplash lookup (dev/demo). Prefer enrich-bundle script for bulk. */
export async function GET(req: Request) {
  if (!process.env.UNSPLASH_ACCESS_KEY?.trim()) {
    return NextResponse.json(
      { ok: false, message: 'UNSPLASH_ACCESS_KEY not configured' },
      { status: 503 },
    );
  }

  const url = new URL(req.url);
  const nome = url.searchParams.get('nome')?.trim();
  const pais = url.searchParams.get('pais')?.trim();
  const tipo = url.searchParams.get('tipo')?.trim();
  const q = url.searchParams.get('q')?.trim();

  const query =
    q ||
    (nome
      ? buildDestinationImageQuery({ nome, pais: pais ?? undefined, tipo: tipo ?? undefined })
      : '');

  if (!query) {
    return NextResponse.json({ ok: false, message: 'Provide ?nome= or ?q=' }, { status: 400 });
  }

  const photo = await fetchUnsplashDestinationPhoto(query);
  if (!photo) {
    return NextResponse.json({ ok: false, message: 'No photo found', query }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    query,
    url: photo.url,
    attribution: {
      photographer: photo.photographer,
      photographerUrl: photo.photographerUrl,
      unsplashUrl: photo.unsplashUrl,
    },
  });
}
