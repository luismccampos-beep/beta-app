import { NextResponse } from 'next/server';
import { apiHandler } from '@/lib/api/handler';
import { getMetrics, healthCheck, getCircuitState } from '@/lib/ml-service/client';

export const dynamic = 'force-dynamic';

/**
 * GET /api/health/ml-status
 *
 * Observability endpoint for the ML service client.
 * Returns circuit breaker state, latency percentiles, success rate,
 * and the latest health check result from the ML service.
 *
 * Response: {@link MlStatusResponse}
 */
export const GET = apiHandler(async () => {
  const metrics = getMetrics();
  const health = await healthCheck();

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    mlService: {
      configured: metrics.configured,
      health: health
        ? {
            status: health.status,
            version: health.version ?? null,
            error: health.error ?? null,
            capabilities: health.capabilities ?? [],
          }
        : null,
    },
    circuit: {
      state: metrics.circuit.state,
      consecutiveFailures: metrics.circuit.failures,
      openedAt: metrics.circuit.openedAt > 0 ? new Date(metrics.circuit.openedAt).toISOString() : null,
      totalOpens: metrics.circuit.totalOpens,
      blockedRequests: metrics.circuit.blockedRequests,
    },
    requests: {
      total: metrics.requests.total,
      successes: metrics.requests.successes,
      failures: metrics.requests.failures,
      successRate: metrics.requests.successRate,
    },
    latency: {
      p50: metrics.latency.p50,
      p95: metrics.latency.p95,
      p99: metrics.latency.p99,
      samples: metrics.latency.samples,
    },
    config: {
      cooldownMs: 30_000,
      failureThreshold: 5,
    },
    _note: 'Circuit state transitions and latency are process-local. Resets on deploy/restart.',
  });
});

/**
 * Response type for the ml-status endpoint.
 */
export type MlStatusResponse = {
  ok: boolean;
  timestamp: string;
  mlService: {
    configured: boolean;
    health: {
      status: string;
      version: string | null;
      error: string | null;
      capabilities: string[];
    } | null;
  };
  circuit: {
    state: string;
    consecutiveFailures: number;
    openedAt: string | null;
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
  config: {
    cooldownMs: number;
    failureThreshold: number;
  };
  _note: string;
};
