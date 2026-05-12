export interface RequestConfig extends RequestInit {
    params?: Record<string, string | number | boolean | null | undefined | Array<string | number | boolean>>;
    timeoutMs?: number;
}
export declare class ApiClientError extends Error {
    statusCode?: number;
    response?: Response;
    isUnauthorized: boolean;
    body?: unknown;
    constructor(message: string, opts?: {
        statusCode?: number;
        response?: Response;
        body?: unknown;
    });
}
declare class ApiClient {
    private baseURL;
    private defaultHeaders;
    constructor(baseURL?: string);
    setBaseURL(baseURL: string): void;
    private request;
    get<T>(endpoint: string, config?: RequestConfig): Promise<T>;
    post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
    put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
    patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T>;
    delete<T>(endpoint: string, config?: RequestConfig): Promise<T>;
    setAuthToken(token: string): void;
    removeAuthToken(): void;
}
declare const apiClient: ApiClient;
export default apiClient;
