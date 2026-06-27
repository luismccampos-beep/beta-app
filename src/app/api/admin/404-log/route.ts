import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
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

