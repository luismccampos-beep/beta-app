import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { aiRequest, configureAIClient } from '../services/aiApiClient';

describe('aiRequest', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    configureAIClient({ baseUrl: '/api', headers: {} });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  it('sends json body and returns response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    });
    globalThis.fetch = fetchMock as typeof fetch;

    const result = await aiRequest<{ success: boolean }>('/test', {
      method: 'POST',
      body: { enabled: true },
    });

    const call = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headers = call?.headers as Record<string, string>;

    expect(headers['Content-Type']).toBe('application/json');
    expect(call.body).toBe(JSON.stringify({ enabled: true }));
    expect(result.success).toBe(true);
  });

  it('retries on server error', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'server error',
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ ok: true }),
      });
    globalThis.fetch = fetchMock as typeof fetch;

    const promise = aiRequest<{ ok: boolean }>('/retry');
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
