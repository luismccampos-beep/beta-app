import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { requireInternalApiKey } from '@/lib/auth-internal';

export async function POST(request: NextRequest) {
  const denied = requireInternalApiKey(request);
  if (denied) return denied;

  try {
    const body = await request.json();
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
