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
export declare class ComponentError extends Error {
    code: string;
    metadata?: Record<string, unknown>;
    constructor(message: string, code?: string, metadata?: Record<string, unknown>);
}
export declare class NavigationError extends ComponentError {
    constructor(message: string, metadata?: Record<string, unknown>);
}
export declare const normalizeError: (error: unknown) => Error;
export declare const reportError: (error: unknown, context?: ErrorReportContext) => void;
