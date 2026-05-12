import type { AISuggestion } from '../types/ai.types';
export type SuggestionsOptions = {
    limit?: number;
    includePopular?: boolean;
    includePersonalized?: boolean;
    diversityFactor?: number;
    userId?: string;
    excludeIds?: string[];
    cacheTtlMs?: number;
    apiEndpoint?: string;
};
export declare function fetchSuggestions(options?: SuggestionsOptions): Promise<AISuggestion[]>;
