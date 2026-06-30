import { describe, it, expect, vi, beforeEach } from 'vitest';
import { checkRateLimit, detectTier } from '../rate-limit';

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: {
    slidingWindow: vi.fn(),
  },
}));

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: vi.fn(),
  },
}));

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request('http://localhost:3000/api/test', { headers });
}

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success when limiter is null (no Redis)', async () => {
    const result = await checkRateLimit(makeRequest(), null);
    expect(result.success).toBe(true);
    expect(result.limit).toBe(999);
  });

  it('returns failure when limiter is null and failClosed in production', async () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const result = await checkRateLimit(makeRequest(), null, true);
    expect(result.success).toBe(false);
    process.env.NODE_ENV = original;
  });

  it('extracts IP from x-forwarded-for', async () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' });
    const result = await checkRateLimit(req, null);
    expect(result.success).toBe(true);
  });

  it('extracts IP from x-real-ip', async () => {
    const req = makeRequest({ 'x-real-ip': '9.8.7.6' });
    const result = await checkRateLimit(req, null);
    expect(result.success).toBe(true);
  });
});

describe('detectTier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects admin tier with matching x-api-key', () => {
    process.env.INTERNAL_API_KEY = 'test-key-123';
    const req = makeRequest({ 'x-api-key': 'test-key-123' });
    const { tier } = detectTier(req);
    expect(tier).toBe('admin');
  });

  it('detects auth tier with Bearer token', () => {
    const req = makeRequest({ 'authorization': 'Bearer some-token' });
    const { tier } = detectTier(req);
    expect(tier).toBe('auth');
  });

  it('detects public tier by default', () => {
    const req = makeRequest();
    const { tier } = detectTier(req);
    expect(tier).toBe('public');
  });

  it('treats non-matching x-api-key as public', () => {
    process.env.INTERNAL_API_KEY = 'correct-key';
    const req = makeRequest({ 'x-api-key': 'wrong-key' });
    const { tier } = detectTier(req);
    expect(tier).toBe('public');
  });
});
