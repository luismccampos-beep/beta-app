import { NextResponse } from 'next/server';

const API_KEY_HEADER = 'x-api-key';

function hashKey(key: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(key).digest('hex');
}

export async function validateApiKey(req: Request): Promise<{ key: string; hash: string } | null> {
  const key = req.headers.get(API_KEY_HEADER);
  if (!key) return null;

  const h = hashKey(key);
  return { key, hash: h };
}

export function requireApiKey() {
  return async (req: Request): Promise<Response | null> => {
    const result = await validateApiKey(req);
    if (!result) {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid API key', code: 'UNAUTHORIZED' },
        { status: 401 },
      );
    }
    return null;
  };
}
