import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import {
  rankDestinations,
  getRoadDistance,
  getRoadDistanceBatch,
  unifiedQuery,
  healthCheck,
  isAvailable,
  getCircuitState,
  getMetrics,
  isHealthy,
  resetClient,
  setTestConfig,
} from '../client';

const BASE = 'http://ml:8000';

/**
 * Helper: create a mock fetch that returns a successful JSON response.
 */
function mockFetchOk<T>(data: T, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status,
    json: () => Promise.resolve(data),
  });
}

/**
 * Helper: create a mock fetch that returns a failing response.
 */
function mockFetchError(status: number, body: Record<string, unknown> = {}) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () => Promise.resolve(body),
  });
}

/**
 * Helper: create a mock fetch that throws (network error).
 */
function mockFetchNetworkError() {
  return vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
}

describe('MlServiceClient', () => {
  beforeEach(() => {
    resetClient();
    setTestConfig({ baseUrl: BASE, failureThreshold: 3, cooldownMs: 500 });
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Circuit breaker: closed → open ──────────────────────────────────

  describe('circuit breaker — failure threshold', () => {
    it('allows requests when circuit is closed', async () => {
      global.fetch = mockFetchOk({ success: true, rankings: [] });

      const result = await rankDestinations({}, [], 5);

      expect(result).toEqual({ success: true, rankings: [] });
      expect(getCircuitState().state).toBe('closed');
    });

    it('opens circuit after N consecutive failures', async () => {
      global.fetch = mockFetchError(500, { error: 'Server error' });

      // 3 failures → circuit opens (threshold = 3)
      await rankDestinations({}, [], 5);
      await rankDestinations({}, [], 5);
      expect(getCircuitState().state).toBe('closed');

      await rankDestinations({}, [], 5);
      expect(getCircuitState().state).toBe('open');
    });

    it('blocks requests when circuit is open', async () => {
      global.fetch = mockFetchError(500);

      // Open the circuit
      for (let i = 0; i < 3; i++) await rankDestinations({}, [], 5);
      expect(getCircuitState().state).toBe('open');

      // Create a fresh mock that should never be called
      const fetchMock = vi.fn();
      global.fetch = fetchMock;

      const result = await rankDestinations({}, [], 5);
      expect(result).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('transitions to half-open after cooldown', async () => {
      vi.useFakeTimers();
      global.fetch = mockFetchError(500);

      // Open the circuit
      for (let i = 0; i < 3; i++) await rankDestinations({}, [], 5);
      expect(getCircuitState().state).toBe('open');

      // Advance past cooldown
      vi.advanceTimersByTime(501);

      // Next request should trigger half-open
      global.fetch = mockFetchOk({ success: true, rankings: [] });
      const result = await rankDestinations({}, [], 5);

      expect(result).not.toBeNull();
      expect(getCircuitState().state).toBe('closed'); // success → closed

      vi.useRealTimers();
    });

    it('returns to open if half-open request fails', async () => {
      vi.useFakeTimers();
      global.fetch = mockFetchError(500);

      // Open circuit
      for (let i = 0; i < 3; i++) await rankDestinations({}, [], 5);
      expect(getCircuitState().state).toBe('open');

      // Advance past cooldown
      vi.advanceTimersByTime(501);

      // Half-open request fails
      await rankDestinations({}, [], 5);
      expect(getCircuitState().state).toBe('open'); // back to open

      vi.useRealTimers();
    });

    it('closes circuit after successful half-open request', async () => {
      vi.useFakeTimers();
      global.fetch = mockFetchError(500);

      // Open circuit
      for (let i = 0; i < 3; i++) await rankDestinations({}, [], 5);
      expect(getCircuitState().state).toBe('open');

      // Advance past cooldown
      vi.advanceTimersByTime(501);

      // Half-open succeeds
      global.fetch = mockFetchOk({ success: true, rankings: [] });
      await rankDestinations({}, [], 5);
      expect(getCircuitState().state).toBe('closed');

      vi.useRealTimers();
    });
  });

  // ─── Graceful degradation ────────────────────────────────────────────

  describe('graceful degradation — not configured', () => {
    it('returns null for all operations when base URL is empty', async () => {
      resetClient();
      setTestConfig({ baseUrl: '' });
      global.fetch = vi.fn();

      const rank = await rankDestinations({}, [], 5);
      const dist = await getRoadDistance({ lat: 0, lon: 0 }, { lat: 1, lon: 1 });
      const batch = await getRoadDistanceBatch({ lat: 0, lon: 0 }, []);
      const query = await unifiedQuery({ query: 'test' });
      const health = await healthCheck();

      expect(rank).toBeNull();
      expect(dist).toBeNull();
      expect(batch).toBeNull();
      expect(query).toBeNull();
      expect(health).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('isAvailable returns false when not configured', () => {
      resetClient();
      setTestConfig({ baseUrl: '' });
      expect(isAvailable()).toBe(false);
    });

    it('isHealthy returns false when not configured', async () => {
      resetClient();
      setTestConfig({ baseUrl: '' });
      const healthy = await isHealthy();
      expect(healthy).toBe(false);
    });
  });

  // ─── Recovery after success ──────────────────────────────────────────

  describe('recovery', () => {
    it('resets consecutive failures after a success', async () => {
      // 2 failures
      global.fetch = mockFetchError(500);
      await rankDestinations({}, [], 5);
      await rankDestinations({}, [], 5);
      expect(getCircuitState().failures).toBe(2);

      // 1 success
      global.fetch = mockFetchOk({ success: true, rankings: [] });
      await rankDestinations({}, [], 5);
      expect(getCircuitState().failures).toBe(0);
      expect(getCircuitState().state).toBe('closed');
    });
  });

  // ─── Network errors ──────────────────────────────────────────────────

  describe('network errors', () => {
    it('counts network errors as failures', async () => {
      global.fetch = mockFetchNetworkError();

      for (let i = 0; i < 3; i++) await rankDestinations({}, [], 5);

      expect(getCircuitState().state).toBe('open');
      expect(getCircuitState().failures).toBeGreaterThanOrEqual(3);
    });

    it('returns null on network error', async () => {
      global.fetch = mockFetchNetworkError();

      const result = await rankDestinations({}, [], 5);
      expect(result).toBeNull();
    });
  });

  // ─── HTTP error responses ────────────────────────────────────────────

  describe('HTTP error responses', () => {
    it('treats 4xx as failures', async () => {
      global.fetch = mockFetchError(400, { detail: 'Bad request' });
      const result = await unifiedQuery({ query: 'test' });
      expect(result).toBeNull();
      expect(getCircuitState().failures).toBe(1);
    });

    it('treats 5xx as failures', async () => {
      global.fetch = mockFetchError(503, { detail: 'Unavailable' });
      const result = await unifiedQuery({ query: 'test' });
      expect(result).toBeNull();
      expect(getCircuitState().failures).toBe(1);
    });
  });

  // ─── Health check ────────────────────────────────────────────────────

  describe('healthCheck', () => {
    it('returns health data when service is up', async () => {
      global.fetch = mockFetchOk({
        status: 'ok',
        time: new Date().toISOString(),
        version: '1.0.0',
      });

      const health = await healthCheck();

      expect(health).toEqual({
        status: 'ok',
        time: expect.any(String) as string,
        version: '1.0.0',
      });
    });

    it('returns unhealthy when service returns error', async () => {
      global.fetch = mockFetchError(500);

      const health = await healthCheck();

      expect(health).toEqual({
        status: 'unhealthy',
        error: 'No response from ML service',
      });
    });

    it('caches health check results', async () => {
      global.fetch = mockFetchOk({ status: 'ok' });

      await healthCheck();
      await healthCheck();
      await healthCheck();

      // Should only have called fetch once (cached)
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
  });

  // ─── Metrics ─────────────────────────────────────────────────────────

  describe('getMetrics', () => {
    it('tracks request counts', async () => {
      global.fetch = mockFetchOk({ success: true, rankings: [] });

      await rankDestinations({}, [], 5);
      await rankDestinations({}, [], 5);

      const metrics = getMetrics();
      expect(metrics.requests.total).toBe(2);
      expect(metrics.requests.successes).toBe(2);
      expect(metrics.requests.failures).toBe(0);
      expect(metrics.requests.successRate).toBe(100);
    });

    it('tracks circuit opens count', async () => {
      global.fetch = mockFetchError(500);

      for (let i = 0; i < 3; i++) await rankDestinations({}, [], 5);

      const metrics = getMetrics();
      expect(metrics.circuit.totalOpens).toBe(1);
      expect(metrics.circuit.state).toBe('open');
    });

    it('tracks blocked requests when circuit is open', async () => {
      global.fetch = mockFetchError(500);

      // Open circuit
      for (let i = 0; i < 3; i++) await rankDestinations({}, [], 5);

      // These should be blocked
      await rankDestinations({}, [], 5);
      await rankDestinations({}, [], 5);

      const metrics = getMetrics();
      expect(metrics.circuit.blockedRequests).toBe(2);
    });

    it('tracks latency percentiles', async () => {
      global.fetch = mockFetchOk({ success: true, rankings: [] });

      await rankDestinations({}, [], 5);
      await rankDestinations({}, [], 5);
      await rankDestinations({}, [], 5);

      const metrics = getMetrics();
      expect(metrics.latency.samples).toBe(3);
      expect(metrics.latency.p50).toBeGreaterThanOrEqual(0);
      expect(metrics.latency.p95).toBeGreaterThanOrEqual(metrics.latency.p50);
      expect(metrics.latency.p99).toBeGreaterThanOrEqual(metrics.latency.p95);
    });
  });

  // ─── Rank destinations ───────────────────────────────────────────────

  describe('rankDestinations', () => {
    it('calls /v1/travel/rank with correct body', async () => {
      const fetchSpy = mockFetchOk({
        success: true,
        rankings: [{ id: 'x', score: 0.9, confidence: 0.8, rank: 1, method: 'embedding' }],
        model_loaded: true,
        processing_time: 0.05,
        timestamp: new Date().toISOString(),
      });
      global.fetch = fetchSpy;

      const result = await rankDestinations({ style: 'beach' }, [{ iata: 'LIS' }], 10);

      expect(result?.rankings).toHaveLength(1);
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringContaining('/v1/travel/rank'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('"style":"beach"'),
        }),
      );
    });
  });

  // ─── Unified query ───────────────────────────────────────────────────

  describe('unifiedQuery', () => {
    it('calls /v1/unified/query', async () => {
      global.fetch = mockFetchOk({
        success: true,
        data: { answer: 'Great choice!', confidence: 0.9 },
        processing_time: 0.1,
      });

      const result = await unifiedQuery({ query: 'Best beach in Portugal?' });

      expect(result?.data?.answer).toBe('Great choice!');
    });
  });

  // ─── Distance ────────────────────────────────────────────────────────

  describe('getRoadDistance', () => {
    it('returns distance data', async () => {
      global.fetch = mockFetchOk({
        success: true,
        distance_km: 300.5,
        method: 'scgraph',
        geograph: 'world_highways',
        scgraph_available: true,
        processing_time: 0.2,
        timestamp: new Date().toISOString(),
      });

      const result = await getRoadDistance({ lat: 0, lon: 0 }, { lat: 1, lon: 1 });

      expect(result?.distance_km).toBe(300.5);
      expect(result?.method).toBe('scgraph');
    });
  });
});
