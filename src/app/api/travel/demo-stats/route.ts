import { NextResponse } from 'next/server';

import {
  getCatalogStatsFromDb,
  isTravelCatalogDbEnabled,
} from '../../../../lib/travel/catalog-db';
import { getTravelDemoStats, resolveTravelBundlePath } from '../../../../lib/travel/mock-travel/load';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (isTravelCatalogDbEnabled()) {
    try {
      const stats = await getCatalogStatsFromDb();
      return NextResponse.json({ ok: true, ...stats });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Database error';
      return NextResponse.json({ ok: false, source: 'db', message }, { status: 503 });
    }
  }

  const stats = getTravelDemoStats();
  if (!stats) {
    return NextResponse.json({ ok: false, message: 'Demo bundle not built' }, { status: 404 });
  }
  return NextResponse.json({
    ok: true,
    bundlePath: resolveTravelBundlePath(),
    ...stats,
  });
}
