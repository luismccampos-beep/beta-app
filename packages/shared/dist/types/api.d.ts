export interface ApiResponse<T = unknown> {
    data?: T;
    error?: ApiError;
    code: number;
    message: string;
    traceId: string;
    timestamp: string;
}
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    field?: string;
    stack?: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
