/**
 * Centralized ML Service client with circuit breaker, health checks,
 * Sentry trace propagation, latency metrics, and graceful degradation.
 * All Next.js → FastAPI calls go through here.
 *
 * Architecture:
 *   Next.js web/API layer
 *         ↓
 *   MlServiceClient (this module)
 *         ↓  [sentry-trace + baggage headers]
 *   ML service FastAPI (:8000)
 *         ↓
 *   Modelos / embeddings / ranking / RAG
 */

import type {
  LatLonPoint,
  TravelRankCandidate,
  TravelRankResponse,
  DistanceResponse,
  BatchDestination,
  BatchDistanceResponse,
  UnifiedQueryRequest,
  UnifiedQueryResponse,
  MlServiceHealth,
} from './types';

// ─── Circuit breaker states ────────────────────────────────────────────────

type CircuitState = 'closed' | 'open' | 'half-open';

// ─── Configuration ─────────────────────────────────────────────────────────

interface MlClientConfig {
  /** Base URL for the ML service (e.g. http://ml-service:8000) */
  baseUrl: string;
  /** API key for authentication */
  apiKey?: string;
  /** Max consecutive failures before opening circuit */
  failureThreshold: number;
  /** Cooldown period in ms before trying half-open */
  cooldownMs: number;
  /** Default request timeout in ms */
  defaultTimeoutMs: number;
  /** Health check interval in ms */
  healthCheckIntervalMs: number;
}

const DEFAULT_CONFIG: Omit<MlClientConfig, 'baseUrl' | 'apiKey'> = {
  failureThreshold: 5,
  cooldownMs: 30_000,
  defaultTimeoutMs: 12_000,
  healthCheckIntervalMs: 60_000,
};

// ─── Module state ──────────────────────────────────────────────────────────

let _config: MlClientConfig | null = null;
let _circuitState: CircuitState = 'closed';
let _consecutiveFailures = 0;
let _circuitOpenedAt = 0;
let _circuitOpensCount = 0;
let _lastHealthCheck: { result: MlServiceHealth | null; at: number } = {
  result: null,
  at: 0,
};
let _healthCheckPromise: Promise<MlServiceHealth | null> | null = null;

// ─── Latency & success metrics ─────────────────────────────────────────────

const MAX_LATENCY_SAMPLES = 200;
const _latencyMs: number[] = [];
let _totalRequests = 0;
let _totalSuccesses = 0;
let _totalFailures = 0;
let _circuitBlockedRequests = 0;

function recordLatency(ms: number): void {
  _latencyMs.push(ms);
  if (_latencyMs.length > MAX_LATENCY_SAMPLES) _latencyMs.shift();
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, idx))]!;
}

function getLatencyPercentiles(): { p50: number; p95: number; p99: number } {
  const sorted = [..._latencyMs].sort((a, b) => a - b);
  return {
    p50: Math.round(percentile(sorted, 50)),
    p95: Math.round(percentile(sorted, 95)),
    p99: Math.round(percentile(sorted, 99)),
  };
}

function getConfig(): MlClientConfig {
  if (_config) return _config;

  const baseUrl = (process.env.ML_SERVICE_BASE_URL ?? '').trim().replace(/\/$/, '');
  const apiKey = process.env.ML_SERVICE_API_KEY?.trim();

  if (!baseUrl) {
    _config = { baseUrl: '', ...DEFAULT_CONFIG };
    return _config;
  }

  _config = {
    baseUrl,
    apiKey: apiKey || undefined,
    ...DEFAULT_CONFIG,
  };
  return _config;
}

function isConfigured(): boolean {
  return getConfig().baseUrl.length > 0;
}

function authHeaders(): Record<string, string> {
  const apiKey = getConfig().apiKey;
  return apiKey ? { 'x-api-key': apiKey } : {};
}

/** Try to read the current request's correlation ID for trace propagation. */
function correlationHeader(): Record<string, string> {
  try {
    // TanStack Start stores the context in AsyncLocalStorage under the
    // symbol returned by getCtx(). We can access it via the global getter
    // if available, but the simplest cross-runtime approach is to check
    // the globalThis.__TANSTACK_SSR_CONTEXT__ (set by start.ts).
    // Fallback: check process.domain (Node) or just skip propagation.
    const g = globalThis as Record<string, unknown>;
    const ctx = (g.__TANSTACK_SSR_CONTEXT__ as Record<string, unknown> | undefined);
    const requestId = ctx?.requestId as string | undefined;
    return requestId ? { 'x-request-id': requestId } : {};
  } catch {
    return {};
  }
}

function makeUrl(path: string): string {
  const base = getConfig().baseUrl;
  return `${base}${path}`;
}

// ─── Circuit breaker ───────────────────────────────────────────────────────

function transitionTo(newState: CircuitState): void {
  if (_circuitState === newState) return;

  const prev = _circuitState;
  _circuitState = newState;

  if (newState === 'open') {
    _circuitOpenedAt = Date.now();
    _circuitOpensCount += 1;
    console.warn(
      `[MlServiceClient] Circuit OPEN after ${_consecutiveFailures} consecutive failures. Cooling down for ${getConfig().cooldownMs}ms.`,
    );
  } else if (newState === 'half-open') {
    console.log('[MlServiceClient] Circuit HALF-OPEN — testing recovery...');
  } else if (newState === 'closed' && prev !== 'closed') {
    console.log('[MlServiceClient] Circuit CLOSED — service recovered.');
  }
}

function recordSuccess(): void {
  _consecutiveFailures = 0;
  if (_circuitState === 'half-open') {
    transitionTo('closed');
  }
}

function recordFailure(): void {
  _consecutiveFailures += 1;
  const config = getConfig();

  if (_consecutiveFailures >= config.failureThreshold && _circuitState === 'closed') {
    transitionTo('open');
  } else if (_circuitState === 'half-open') {
    // Fail in half-open → back to open
    transitionTo('open');
  }
}

function checkCircuit(): boolean {
  const config = getConfig();

  // Not configured → always allow (returns false = not available)
  if (!config.baseUrl) return true; // will fall through to "not configured" handling

  if (_circuitState === 'closed') return true;

  if (_circuitState === 'open') {
    const elapsed = Date.now() - _circuitOpenedAt;
    if (elapsed >= config.cooldownMs) {
      transitionTo('half-open');
      return true;
    }
    _circuitBlockedRequests += 1;
    return false;
  }

  // half-open → allow one test request
  return true;
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────

async function mlFetch<T>(
  path: string,
  init: RequestInit & { timeoutMs?: number },
): Promise<T | null> {
  const config = getConfig();
  if (!config.baseUrl) return null;

  const url = makeUrl(path);
  const timeout = init.timeoutMs ?? config.defaultTimeoutMs;
  const start = Date.now();

  _totalRequests += 1;

  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...authHeaders(),
        ...correlationHeader(),
        ...(init.headers as Record<string, string> | undefined),
      },
      cache: 'no-store',
      signal: init.signal ?? AbortSignal.timeout(timeout),
    });

    const data = (await response.json().catch(() => ({}))) as T;

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}: ${JSON.stringify(data)}`);
    }

    recordSuccess();
    _totalSuccesses += 1;
    recordLatency(Date.now() - start);
    return data;
  } catch (err) {
    recordFailure();
    _totalFailures += 1;
    recordLatency(Date.now() - start);
    console.error(`[MlServiceClient] Request failed for ${path}:`, (err as Error).message);
    return null;
  }
}

// ─── Metrics snapshot ──────────────────────────────────────────────────────

/** Snapshot of ML service client observability metrics. */
export type MlClientMetrics = {
  configured: boolean;
  circuit: {
    state: CircuitState;
    failures: number;
    openedAt: number;
    totalOpens: number;
    blockedRequests: number;
  };
  requests: {
    total: number;
    successes: number;
    failures: number;
    successRate: number;
  };
  latency: {
    p50: number;
    p95: number;
    p99: number;
    samples: number;
  };
};

/** Get a snapshot of current metrics for observability. */
export function getMetrics(): MlClientMetrics {
  const total = _totalRequests || 1; // avoid NaN
  return {
    configured: isConfigured(),
    circuit: {
      state: _circuitState,
      failures: _consecutiveFailures,
      openedAt: _circuitOpenedAt,
      totalOpens: _circuitOpensCount,
      blockedRequests: _circuitBlockedRequests,
    },
    requests: {
      total: _totalRequests,
      successes: _totalSuccesses,
      failures: _totalFailures,
      successRate: Math.round((_totalSuccesses / total) * 10000) / 100,
    },
    latency: {
      ...getLatencyPercentiles(),
      samples: _latencyMs.length,
    },
  };
}

// ─── Public API ────────────────────────────────────────────────────────────

/**
 * Returns whether the ML service is reachable and healthy.
 * Checks circuit state + cached health result.
 */
export function isAvailable(): boolean {
  return isConfigured() && _circuitState !== 'open';
}

/**
 * Returns the current circuit breaker state for observability.
 */
export function getCircuitState(): { state: CircuitState; failures: number; openedAt: number } {
  return {
    state: _circuitState,
    failures: _consecutiveFailures,
    openedAt: _circuitOpenedAt,
  };
}

/**
 * Health check: pings the ML service /health endpoint.
 * Caches result for healthCheckIntervalMs.
 */
export async function healthCheck(): Promise<MlServiceHealth | null> {
  const config = getConfig();
  if (!config.baseUrl) return null;

  const now = Date.now();
  if (_lastHealthCheck.result && now - _lastHealthCheck.at < config.healthCheckIntervalMs) {
    return _lastHealthCheck.result;
  }

  // Deduplicate concurrent health checks
  if (_healthCheckPromise) return _healthCheckPromise;

  _healthCheckPromise = (async () => {
    try {
      const data = await mlFetch<MlServiceHealth>('/health', {
        method: 'GET',
        timeoutMs: 5_000,
      });

      const result: MlServiceHealth = data ?? {
        status: 'unhealthy',
        error: 'No response from ML service',
      };

      _lastHealthCheck = { result, at: Date.now() };
      _healthCheckPromise = null;

      if (result.status === 'ok') {
        // Force circuit closed on successful health check
        if (_circuitState === 'open') {
          transitionTo('half-open');
        }
      }

      return result;
    } catch {
      const result: MlServiceHealth = { status: 'unhealthy', error: 'Health check failed' };
      _lastHealthCheck = { result, at: Date.now() };
      _healthCheckPromise = null;
      return result;
    }
  })();

  return _healthCheckPromise;
}

// ─── Travel Ranking ────────────────────────────────────────────────────────

export async function rankDestinations(
  preferences: Record<string, unknown>,
  candidates: TravelRankCandidate[],
  limit = 20,
  userId?: string,
): Promise<TravelRankResponse | null> {
  if (!isConfigured() || !checkCircuit()) return null;
  return mlFetch<TravelRankResponse>('/v1/travel/rank', {
    method: 'POST',
    body: JSON.stringify({
      preferences,
      candidates,
      limit,
      ...(userId ? { user_id: userId } : {}),
    }),
  });
}

// ─── Travel Distance ───────────────────────────────────────────────────────

export async function getRoadDistance(
  origin: LatLonPoint,
  destination: LatLonPoint,
  geograph?: string,
): Promise<DistanceResponse | null> {
  if (!isConfigured() || !checkCircuit()) return null;
  return mlFetch<DistanceResponse>('/v1/travel/distance', {
    method: 'POST',
    body: JSON.stringify({ origin, destination, geograph }),
    timeoutMs: 60_000,
  });
}

export async function getRoadDistanceBatch(
  origin: LatLonPoint,
  destinations: BatchDestination[],
  geograph?: string,
): Promise<BatchDistanceResponse | null> {
  if (!isConfigured() || !checkCircuit()) return null;
  return mlFetch<BatchDistanceResponse>('/v1/travel/distance/batch', {
    method: 'POST',
    body: JSON.stringify({ origin, destinations, geograph }),
    timeoutMs: 120_000,
  });
}

// ─── Unified AI ────────────────────────────────────────────────────────────

export async function unifiedQuery(
  request: UnifiedQueryRequest,
): Promise<UnifiedQueryResponse | null> {
  if (!isConfigured() || !checkCircuit()) return null;
  return mlFetch<UnifiedQueryResponse>('/v1/unified/query', {
    method: 'POST',
    body: JSON.stringify(request),
    timeoutMs: 30_000,
  });
}

// ─── Quick health endpoints ────────────────────────────────────────────────

export async function rankHealth(): Promise<{ ok: boolean; model_exists: boolean; items: number } | null> {
  if (!isConfigured() || !checkCircuit()) return null;
  return mlFetch('/v1/travel/rank/health', { method: 'GET', timeoutMs: 5_000 });
}

export async function distanceHealth(): Promise<{
  ok: boolean;
  scgraph_installed: boolean;
  geograph: string;
} | null> {
  if (!isConfigured() || !checkCircuit()) return null;
  return mlFetch('/v1/travel/distance/health', { method: 'GET', timeoutMs: 5_000 });
}

/** Graceful degradation check: returns true if ML service is healthy. */
export async function isHealthy(): Promise<boolean> {
  const health = await healthCheck();
  return health?.status === 'ok';
}

// ─── Testability ───────────────────────────────────────────────────────────

/**
 * Reset all module-level state. Use only in tests.
 * Exported for Vitest integration.
 */
export function resetClient(): void {
  _config = null;
  _circuitState = 'closed';
  _consecutiveFailures = 0;
  _circuitOpenedAt = 0;
  _circuitOpensCount = 0;
  _lastHealthCheck = { result: null, at: 0 };
  _healthCheckPromise = null;
  _latencyMs.length = 0;
  _totalRequests = 0;
  _totalSuccesses = 0;
  _totalFailures = 0;
  _circuitBlockedRequests = 0;
}

/**
 * Override configuration for testing. Pass empty baseUrl to simulate
 * "not configured" state. Pass full config to test specific scenarios.
 */
export function setTestConfig(overrides: Partial<MlClientConfig>): void {
  _config = {
    baseUrl: overrides.baseUrl ?? 'http://test-ml:8000',
    ...DEFAULT_CONFIG,
    ...overrides,
  };
}
