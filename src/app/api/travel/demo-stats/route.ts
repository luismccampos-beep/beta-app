import { NextResponse } from 'next/server';

import { getTravelDemoStats, resolveTravelBundlePath } from '../../../../lib/travel/mock-travel/load';

export const dynamic = 'force-dynamic';

export async function GET() {
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
