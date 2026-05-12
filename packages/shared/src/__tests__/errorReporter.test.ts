import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NavigationError, normalizeError, reportError } from '../logger/errorReporter';
import { logger } from '../logger/logger';

describe('errorReporter', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('normalizes different error types', () => {
    const error = new Error('Boom');
    expect(normalizeError(error).message).toBe('Boom');
    expect(normalizeError('Oops').message).toBe('Oops');
    expect(normalizeError({ code: 1 }).message).toContain('"code":1');
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(normalizeError(circular).message).toBe('Unknown error');
  });

  it('reports errors to logger and monitoring hooks', () => {
    const error = new NavigationError('Navigation failed', { href: '/account' });
    const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});

    const captureException = vi.fn();
    const withScope = vi.fn((callback: (scope: { setTag: (key: string, value: string) => void; setTags: (tags: Record<string, string>) => void; setContext: (key: string, context: Record<string, unknown>) => void; setUser: (user: { id?: string; email?: string; role?: string }) => void }) => void) => {
      callback({
        setTag: vi.fn(),
        setTags: vi.fn(),
        setContext: vi.fn(),
        setUser: vi.fn(),
      });
    });
    const logRocketCapture = vi.fn();

    (window as unknown as { Sentry?: unknown; LogRocket?: unknown }).Sentry = {
      captureException,
      withScope,
    };
    (window as unknown as { LogRocket?: unknown }).LogRocket = {
      captureException: logRocketCapture,
    };

    reportError(error, { boundaryId: 'breadcrumbs', tags: { component: 'Breadcrumbs' } });

    expect(logSpy).toHaveBeenCalled();
    expect(withScope).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalled();
    expect(logRocketCapture).toHaveBeenCalled();
  });

  it('reports errors when only captureException is available', () => {
    const error = new Error('Boom');
    const logSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const captureException = vi.fn();

    (window as unknown as { Sentry?: unknown }).Sentry = {
      captureException,
    };

    reportError(error, { tags: { component: 'ErrorBoundary' } });

    expect(logSpy).toHaveBeenCalled();
    expect(captureException).toHaveBeenCalled();
  });
});
