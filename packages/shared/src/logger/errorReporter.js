import { logger } from './logger';
export class ComponentError extends Error {
    constructor(message, code = 'COMPONENT_ERROR', metadata) {
        super(message);
        this.name = 'ComponentError';
        this.code = code;
        if (metadata) {
            this.metadata = metadata;
        }
    }
}
export class NavigationError extends ComponentError {
    constructor(message, metadata) {
        super(message, 'NAVIGATION_ERROR', metadata);
        this.name = 'NavigationError';
    }
}
export const normalizeError = (error) => {
    if (error instanceof Error)
        return error;
    if (typeof error === 'string')
        return new Error(error);
    if (typeof error === 'object' && error !== null) {
        try {
            return new Error(JSON.stringify(error));
        }
        catch {
            return new Error('Unknown error');
        }
    }
    return new Error(String(error));
};
const getGlobal = () => {
    if (typeof window !== 'undefined')
        return window;
    if (typeof globalThis !== 'undefined')
        return globalThis;
    return undefined;
};
export const reportError = (error, context) => {
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
    const globalObj = getGlobal();
    const sentry = globalObj?.Sentry;
    if (sentry?.withScope) {
        sentry.withScope((scope) => {
            if (context?.boundaryId)
                scope.setTag('boundaryId', context.boundaryId);
            if (context?.tags)
                scope.setTags(context.tags);
            if (context?.metadata)
                scope.setContext('metadata', context.metadata);
            if (context?.componentStack)
                scope.setContext('react', { componentStack: context.componentStack });
            if (context?.user)
                scope.setUser(context.user);
            sentry.captureException?.(normalized, { extra: payload });
        });
    }
    else {
        sentry?.captureException?.(normalized, { extra: payload });
    }
    const logRocket = globalObj?.LogRocket;
    logRocket?.captureException?.(normalized);
};
//# sourceMappingURL=errorReporter.js.map