export interface AgencyApiOptions {
    includeAgencyId?: boolean;
    fallbackToUserAgency?: boolean;
}
export declare function useAgencyApi(): {
    agency: import("..").Agency | null;
    domain: string | null;
    isSubdomain: boolean;
    isCustomDomain: boolean;
    createAgencyRequest: (options?: RequestInit, apiOptions?: AgencyApiOptions) => RequestInit;
    fetchWithAgency: (url: string, options?: RequestInit, apiOptions?: AgencyApiOptions) => Promise<Response>;
    api: {
        get: (url: string, options?: AgencyApiOptions) => Promise<Response>;
        post: (url: string, data?: unknown, options?: AgencyApiOptions) => Promise<Response>;
        put: (url: string, data?: unknown, options?: AgencyApiOptions) => Promise<Response>;
        patch: (url: string, data?: unknown, options?: AgencyApiOptions) => Promise<Response>;
        delete: (url: string, options?: AgencyApiOptions) => Promise<Response>;
    };
    canPerformAction: (action: "create_user" | "create_client" | "access_feature") => boolean;
    getApiBaseUrl: () => string;
};
/**
 * Create agency-aware query key for React Query/TanStack Query
 */
export declare function createAgencyQueryKey(baseKey: string[], agencyId?: string): string[];
/**
 * Create agency-aware mutation function
 */
export declare function createAgencyMutation<TData, TVariables>(mutationFn: (variables: TVariables, agencyId: string) => Promise<TData>, agencyId: string): (variables: TVariables) => Promise<TData>;
//# sourceMappingURL=useAgencyApi.d.ts.map