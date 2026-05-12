import type { ApiError } from './api';
export type ResolverResult<T> = T | {
    error: ApiError;
    message: string;
    errorNotes?: string[];
};
export type IResolutionContext<T> = {
    data: T;
    timestamp: number;
};
export type IResolutionState = {
    [key: string]: unknown;
    status: 'idle' | 'pending' | 'resolved' | 'rejected';
    error?: string;
};
export interface IAsyncResolverState extends IResolutionState {
    status: 'pending' | 'resolved' | 'rejected';
    error?: string;
    timestamp?: number;
}
export interface IMetric<T> {
    readValue: () => T | Promise<T>;
    update: () => void;
    thenState: {
        status: 'pending';
    }[];
}
export type IAsyncMapperState<T> = IResolutionState & {
    data?: T;
    metrics?: Record<string, unknown>;
};
export type AsyncResolverMetadata = {
    async: true;
    metadataKey?: keyof IAsyncResolverState;
    requestArgs?: Record<string, unknown>;
    timestamp?: number;
};
export interface IAsyncResolveMeta extends AsyncResolverMetadata {
    endpoint?: string;
    signature: string;
}
export type IAsyncMapper<T> = {
    resolve: () => Promise<ResolverResult<T>>;
    state: IAsyncResolverState;
};
