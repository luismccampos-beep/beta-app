import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  try {
    const body = await request.json();

    // Support both single entry and batched { entries: [...] }
    const entries = body.entries ? body.entries : [body];

    for (const entry of entries) {
      // TODO: Persist to database
      console.debug('[404-log]', entry.url, entry.referer ?? '');
    }

    return NextResponse.json({ success: true, logged: entries.length });
  } catch {
    return NextResponse.json({ success: true });
  }
}

