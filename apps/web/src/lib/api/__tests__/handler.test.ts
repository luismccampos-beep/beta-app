import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { apiHandler, apiHandlerWithBody } from '../handler';

function makeGetRequest(url = 'http://localhost:3000/api/test'): Request {
  return new Request(url, { method: 'GET' });
}

function makePostRequest(body: unknown, url = 'http://localhost:3000/api/test'): Request {
  return new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('apiHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns handler response on success', async () => {
    const handler = apiHandler(async () => {
      return Response.json({ ok: true });
    });

    const res = await handler(makeGetRequest(), { params: Promise.resolve({}) });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.ok).toBe(true);
  });

  it('adds no-store cache headers to GET responses', async () => {
    const handler = apiHandler(async () => {
      return Response.json({ data: 'test' });
    });

    const res = await handler(makeGetRequest(), { params: Promise.resolve({}) });
    expect(res.headers.get('Cache-Control')).toBe('private, no-store, max-age=0');
  });

  it('does not add cache headers to POST responses', async () => {
    const handler = apiHandler(async () => {
      return Response.json({ ok: true });
    });

    const res = await handler(makePostRequest({}), { params: Promise.resolve({}) });
    expect(res.headers.get('Cache-Control')).toBeNull();
  });

  it('preserves existing Cache-Control header', async () => {
    const handler = apiHandler(async () => {
      return new Response(JSON.stringify({ data: 'public' }), {
        headers: { 'Cache-Control': 'public, max-age=60' },
      });
    });

    const res = await handler(makeGetRequest(), { params: Promise.resolve({}) });
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=60');
  });

  it('returns 400 for ZodError', async () => {
    const schema = z.object({ email: z.string().email() });
    const handler = apiHandlerWithBody(schema, async () => {
      return Response.json({ ok: true });
    });

    const res = await handler(makePostRequest({ email: 'invalid' }), { params: Promise.resolve({}) });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Validation failed');
  });

  it('returns 500 for unexpected errors', async () => {
    const handler = apiHandler(async () => {
      throw new Error('Unexpected failure');
    });

    const res = await handler(makeGetRequest(), { params: Promise.resolve({}) });
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json.code).toBe('INTERNAL_ERROR');
  });

  it('returns 400 for invalid JSON body', async () => {
    const schema = z.object({ name: z.string() });
    const handler = apiHandlerWithBody(schema, async () => {
      return Response.json({ ok: true });
    });

    const badRequest = new Request('http://localhost:3000/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not json',
    });

    const res = await handler(badRequest, { params: Promise.resolve({}) });
    expect(res.status).toBe(400);
  });
});
