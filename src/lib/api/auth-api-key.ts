import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

const API_KEY_HEADER = 'x-api-key';

export type ApiKeyAuth = {
  id: string;
  name: string;
  serviceName: string;
  scopes: string[];
  permissions: string[];
};

function hashKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

async function lookupApiKey(key: string): Promise<ApiKeyAuth | null> {
  const hash = hashKey(key);

  const record = await prisma.apiKey.findUnique({
    where: { keyHash: hash },
  });

  if (!record) return null;
  if (!record.isActive) return null;
  if (record.revokedAt) return null;
  if (record.expiresAt && record.expiresAt < new Date()) return null;

  try {
    await prisma.apiKey.update({
      where: { id: record.id },
      data: { lastUsedAt: new Date() },
    });
  } catch {
    // non-critical — don't fail auth if lastUsedAt fails
  }

  return {
    id: record.id,
    name: record.name,
    serviceName: record.serviceName,
    scopes: (record.scopes ?? []) as string[],
    permissions: (record.permissions ?? []) as string[],
  };
}

export async function authenticateApiKey(request: Request): Promise<ApiKeyAuth | null> {
  const key = request.headers.get(API_KEY_HEADER);
  if (!key) return null;
  return lookupApiKey(key);
}

export function withApiKeyAuth(fn: (req: Request, ctx: { params: Promise<Record<string, string>> }) => Promise<Response>): typeof fn {
  return async (req, ctx) => {
    const auth = await authenticateApiKey(req);
    if (!auth) {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid API key', code: 'UNAUTHORIZED' },
        { status: 401 },
      );
    }
    (req as unknown as { apiKeyAuth: ApiKeyAuth }).apiKeyAuth = auth;
    return fn(req, ctx);
  };
}
