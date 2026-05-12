import type { AISuggestion } from '../types/ai.types';
import { type SuggestionsOptions } from './suggestionsService';
export interface AISuggestionsState {
    items: AISuggestion[];
    isLoading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}
export declare function useAISuggestions(options?: SuggestionsOptions): AISuggestionsState;
