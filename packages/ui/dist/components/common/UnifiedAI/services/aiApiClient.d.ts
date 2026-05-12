type AIRequestConfig = Omit<RequestInit, 'body'> & {
    baseUrl?: string;
    timeoutMs?: number;
    retryAttempts?: number;
    retryDelayMs?: number;
    parseAs?: 'json' | 'text';
    body?: BodyInit | Record<string, unknown> | null | object;
};
type AIClientConfig = {
    baseUrl: string;
    timeoutMs: number;
    retryAttempts: number;
    retryDelayMs: number;
    headers: Record<string, string>;
};
export declare function configureAIClient(config: Partial<AIClientConfig>): void;
export declare function aiRequest<T>(path: string, options?: AIRequestConfig): Promise<T>;
export {};
