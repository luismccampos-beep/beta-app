import type { AISearchResult } from './searchService';
export interface AISearchState {
    results: AISearchResult | null;
    isLoading: boolean;
    error: string | null;
    search: (query: string) => Promise<AISearchResult | null>;
    clear: () => void;
}
export declare function useAISearch(): AISearchState;
