import type { AIPreferences, TravelPreferencesData, PersonalizationSettingsData, AdvancedSettingsData, PrivacySettingsData, NotificationSettings } from '../types/ai-preferences';
export declare const CACHE_DURATION: number;
export interface UseAIPreferencesReturn {
    preferences: AIPreferences | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
    hasUnsavedChanges: boolean;
    updatePreferences: (updates: Partial<AIPreferences>) => Promise<void>;
    savePreferences: () => Promise<void>;
    resetPreferences: () => Promise<void>;
    updateTravelPreferences: (updates: Partial<TravelPreferencesData>) => Promise<void>;
    updatePersonalizationSettings: (updates: Partial<PersonalizationSettingsData>) => Promise<void>;
    updateAdvancedSettings: (updates: Partial<AdvancedSettingsData>) => Promise<void>;
    updatePrivacySettings: (updates: Partial<PrivacySettingsData>) => Promise<void>;
    updateNotificationSettings: (updates: Partial<NotificationSettings>) => Promise<void>;
    isSectionValid: (section: keyof AIPreferences) => boolean;
    getSection: <T extends keyof AIPreferences>(section: T) => AIPreferences[T] | null;
    data: AIPreferences | null;
}
/**
 * Shared AI Preferences Hook
 *
 * Provides comprehensive AI preferences management with:
 * - Local storage persistence
 * - Backup/restore functionality
 * - Section-specific updates
 * - Change tracking
 * - Default values handling
 */
export declare function useAIPreferences(): UseAIPreferencesReturn;
export default useAIPreferences;
