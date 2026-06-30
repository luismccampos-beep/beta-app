import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextResponse } from 'next/server';
import { requireInternalApiKey } from '../auth-internal';

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request('http://localhost:3000/api/internal/test', { headers });
}

describe('requireInternalApiKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.INTERNAL_API_KEY = 'test-internal-key';
  });

  it('returns null when API key is valid', () => {
    const req = makeRequest({ 'x-api-key': 'test-internal-key' });
    const result = requireInternalApiKey(req);
    expect(result).toBeNull();
  });

  it('returns 403 when API key is missing', () => {
    const req = makeRequest();
    const result = requireInternalApiKey(req);
    expect(result).not.toBeNull();
    expect(result).toBeInstanceOf(NextResponse);
  });

  it('returns 403 when API key is wrong', () => {
    const req = makeRequest({ 'x-api-key': 'wrong-key' });
    const result = requireInternalApiKey(req);
    expect(result).not.toBeNull();
  });

  it('returns 500 when INTERNAL_API_KEY is not configured', () => {
    delete process.env.INTERNAL_API_KEY;
    const req = makeRequest({ 'x-api-key': 'any-key' });
    const result = requireInternalApiKey(req);
    expect(result).not.toBeNull();
  });
});
