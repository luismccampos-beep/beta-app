// shared/src/types/resolver.ts
import type { ApiError } from './api';

// Result type for resolver operations
export type ResolverResult<T> = T | { error: ApiError; message: string; errorNotes?: string[]; };

// Context for resolution operations
export type IResolutionContext<T> = {
  data: T;
  timestamp: number;
  // Add additional context fields as needed
};

// Base resolution state
export type IResolutionState = {
  [key: string]: unknown;
  status: 'idle' | 'pending' | 'resolved' | 'rejected';
  error?: string;
};

// Async resolver state with additional properties
export interface IAsyncResolverState extends IResolutionState {
  status: 'pending' | 'resolved' | 'rejected';
  error?: string;
  timestamp?: number;
}

// Metric tracking interface
export interface IMetric<T> {
  readValue: () => T | Promise<T>;
  update: () => void;
  thenState: { status: 'pending' }[];
}

// Async mapper state with metrics
export type IAsyncMapperState<T> = IResolutionState & {
  data?: T;
  metrics?: Record<string, unknown>;
};

// Metadata for async resolvers
export type AsyncResolverMetadata = {
  async: true;
  metadataKey?: keyof IAsyncResolverState;
  requestArgs?: Record<string, unknown>;
  timestamp?: number;
};

// Meta information for async resolution
export interface IAsyncResolveMeta extends AsyncResolverMetadata {
  endpoint?: string;
  signature: string;
}

// Generic async mapper type
export type IAsyncMapper<T> = {
  resolve: () => Promise<ResolverResult<T>>;
  state: IAsyncResolverState;
};
