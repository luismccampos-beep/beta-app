import type { AIPreferences } from '../types/preferences.types';
export type PreferencesOptions = {
    apiEndpoint?: string;
    cacheTtlMs?: number;
};
export declare function savePreferences(preferences: AIPreferences, options?: PreferencesOptions): Promise<AIPreferences>;
export declare function loadPreferences(options?: PreferencesOptions): Promise<AIPreferences | null>;
export declare function resetPreferences(options?: PreferencesOptions): Promise<AIPreferences | null>;
