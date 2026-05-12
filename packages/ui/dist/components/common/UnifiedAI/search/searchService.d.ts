export type AISearchSuggestion = {
    id: string;
    title: string;
    description?: string;
    category?: string;
    country?: string;
    tags?: string[];
    popularity?: number;
    imageUrl?: string;
};
export type AISearchResult = {
    suggestions: AISearchSuggestion[];
    popularDestinations?: unknown[];
    total: number;
    hasMore: boolean;
};
export type AISearchOptions = {
    limit?: number;
    includePopular?: boolean;
    includeCategories?: boolean;
    includeCountries?: boolean;
    includeTags?: boolean;
    cacheTtlMs?: number;
    apiEndpoint?: string;
};
export declare function runAISearch(query: string, options?: AISearchOptions): Promise<AISearchResult>;
