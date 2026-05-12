import type { AIPreferences } from '../types/preferences.types';
export interface AIPreferencesState {
    data: AIPreferences | null;
    isLoading: boolean;
    error: string | null;
    save: (preferences: AIPreferences) => Promise<AIPreferences | null>;
    reset: () => Promise<AIPreferences | null>;
    refresh: () => Promise<void>;
}
export declare function useAIPreferences(): AIPreferencesState;
