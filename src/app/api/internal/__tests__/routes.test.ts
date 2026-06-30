import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../url-redirects/route';
import { POST } from '../404-log/route';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    urlRedirect: {
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

function makeRequest(url: string, headers: Record<string, string> = {}): Request {
  return new Request(url, { headers });
}

describe('/api/internal/url-redirects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INTERNAL_API_KEY = 'test-key';
  });

  it('returns 403 without x-api-key', async () => {
    const req = makeRequest('http://localhost:3000/api/internal/url-redirects');
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it('returns 403 with wrong x-api-key', async () => {
    const req = makeRequest('http://localhost:3000/api/internal/url-redirects', {
      'x-api-key': 'wrong-key',
    });
    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it('returns 200 with valid x-api-key', async () => {
    vi.mocked(prisma.urlRedirect.findMany).mockResolvedValue([]);
    const req = makeRequest('http://localhost:3000/api/internal/url-redirects', {
      'x-api-key': 'test-key',
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });

  it('passes activeOnly and limit params to prisma', async () => {
    vi.mocked(prisma.urlRedirect.findMany).mockResolvedValue([]);
    const req = makeRequest(
      'http://localhost:3000/api/internal/url-redirects?activeOnly=true&limit=100',
      { 'x-api-key': 'test-key' },
    );
    await GET(req);
    expect(prisma.urlRedirect.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { is_active: true },
        take: 100,
      }),
    );
  });
});

describe('/api/internal/404-log', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INTERNAL_API_KEY = 'test-key';
  });

  it('returns 403 without x-api-key', async () => {
    const req = makeRequest('http://localhost:3000/api/internal/404-log');
    const res = await POST(req);
    expect(res.status).toBe(403);
  });

  it('returns 200 with valid x-api-key', async () => {
    const req = new Request('http://localhost:3000/api/internal/404-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'test-key',
      },
      body: JSON.stringify({ entries: [{ url: '/test', referer: null }] }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.logged).toBe(1);
  });

  it('handles batch entries', async () => {
    const req = new Request('http://localhost:3000/api/internal/404-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'test-key',
      },
      body: JSON.stringify({
        entries: [
          { url: '/a', referer: null },
          { url: '/b', referer: '/home' },
          { url: '/c', referer: null },
        ],
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.logged).toBe(3);
  });
});
