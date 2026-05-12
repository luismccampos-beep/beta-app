import { logger } from './logger';

export type ErrorReportContext = {
  boundaryId?: string;
  componentStack?: string;
  tags?: Record<string, string>;
  metadata?: Record<string, unknown>;
  user?: {
    id?: string;
    email?: string;
    role?: string;
  };
};

export class ComponentError extends Error {
  code: string;
  metadata?: Record<string, unknown>;

  constructor(message: string, code = 'COMPONENT_ERROR', metadata?: Record<string, unknown>) {
    super(message);
    this.name = 'ComponentError';
    this.code = code;
    if (metadata) {
      this.metadata = metadata;
    }
  }
}

export class NavigationError extends ComponentError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, 'NAVIGATION_ERROR', metadata);
    this.name = 'NavigationError';
  }
}

export const normalizeError = (error: unknown): Error => {
  if (error instanceof Error) return error;
  if (typeof error === 'string') return new Error(error);
  if (typeof error === 'object' && error !== null) {
    try {
      return new Error(JSON.stringify(error));
    } catch {
      return new Error('Unknown error');
    }
  }
  return new Error(String(error));
};

const getGlobal = (): typeof globalThis | undefined => {
  if (typeof window !== 'undefined') return window;
  if (typeof globalThis !== 'undefined') return globalThis;
  return undefined;
};

export const reportError = (error: unknown, context?: ErrorReportContext): void => {
  const normalized = normalizeError(error);
  const payload = {
    message: normalized.message,
    name: normalized.name,
    stack: normalized.stack,
    boundaryId: context?.boundaryId,
    componentStack: context?.componentStack,
    tags: context?.tags,
    metadata: context?.metadata,
    user: context?.user,
  };

  logger.error('Shared component error', payload);

  const globalObj = getGlobal() as {
    Sentry?: {
      captureException?: (err: unknown, options?: { extra?: Record<string, unknown> }) => void;
      withScope?: (callback: (scope: { setTag: (key: string, value: string) => void; setTags: (tags: Record<string, string>) => void; setContext: (key: string, context: Record<string, unknown>) => void; setUser: (user: { id?: string; email?: string; role?: string }) => void }) => void) => void;
    };
    LogRocket?: {
      captureException?: (err: unknown) => void;
    };
  } | undefined;

  const sentry = globalObj?.Sentry;
  if (sentry?.withScope) {
    sentry.withScope((scope) => {
      if (context?.boundaryId) scope.setTag('boundaryId', context.boundaryId);
      if (context?.tags) scope.setTags(context.tags);
      if (context?.metadata) scope.setContext('metadata', context.metadata);
      if (context?.componentStack) scope.setContext('react', { componentStack: context.componentStack });
      if (context?.user) scope.setUser(context.user);
      sentry.captureException?.(normalized, { extra: payload });
    });
  } else {
    sentry?.captureException?.(normalized, { extra: payload });
  }

  const logRocket = globalObj?.LogRocket;
  logRocket?.captureException?.(normalized);
};
