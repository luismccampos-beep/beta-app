"use client";
// packages/shared/src/hooks/useAIPreferences.ts
// Shared AI Preferences Hook for AKMLEVA Application
// Provides unified AI preferences management across web app and smart form
import { useCallback, useEffect, useState, useMemo } from 'react';

import { DEFAULT_AI_PREFERENCES } from '../types/ai-preferences';
// Storage keys
const STORAGE_KEY = 'akmleva-ai-preferences';
const BACKUP_KEY = 'akmleva-ai-preferences-backup';
// FIX: Exported the constant to resolve the 'unused variable' warning while keeping it for future use.
// Cache duration in milliseconds (5 minutes) - reserved for future caching implementation
export const CACHE_DURATION = 5 * 60 * 1000;
// Local storage helpers
function loadFromStorage() {
    if (typeof window === 'undefined')
        return null;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    }
    catch (error) {
        console.warn('[useAIPreferences] Failed to load from localStorage:', error);
    }
    return null;
}
function saveToStorage(preferences) {
    if (typeof window === 'undefined')
        return false;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        return true;
    }
    catch (error) {
        console.error('[useAIPreferences] Failed to save to localStorage:', error);
        return false;
    }
}
function saveBackup(preferences) {
    if (typeof window === 'undefined')
        return;
    try {
        localStorage.setItem(BACKUP_KEY, JSON.stringify({
            preferences,
            timestamp: Date.now()
        }));
    }
    catch (error) {
        console.warn('[useAIPreferences] Failed to save backup:', error);
    }
}
function loadBackup() {
    if (typeof window === 'undefined')
        return null;
    try {
        const stored = localStorage.getItem(BACKUP_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                preferences: parsed.preferences,
                timestamp: parsed.timestamp
            };
        }
    }
    catch (error) {
        console.warn('[useAIPreferences] Failed to load backup:', error);
    }
    return null;
}
function createDefaultPreferences() {
    return {
        ...DEFAULT_AI_PREFERENCES,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
    };
}
// Validate preferences structure
function validatePreferences(data) {
    if (!data || typeof data !== 'object')
        return false;
    const prefs = data;
    // Check required top-level fields
    return (prefs.travelPreferences !== undefined &&
        prefs.personalizationSettings !== undefined &&
        prefs.advancedSettings !== undefined);
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
export function useAIPreferences() {
    const [preferences, setPreferences] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    // Initialize preferences on mount
    useEffect(() => {
        const initializePreferences = () => {
            setIsLoading(true);
            setError(null);
            try {
                // Try to load from localStorage first
                let storedPrefs = loadFromStorage();
                // If not found or invalid, try backup
                if (!storedPrefs || !validatePreferences(storedPrefs)) {
                    const backup = loadBackup();
                    if (backup && validatePreferences(backup.preferences)) {
                        storedPrefs = backup.preferences;
                        // Restore from backup to main storage
                        saveToStorage(storedPrefs);
                    }
                }
                // If still not found, use defaults
                if (!storedPrefs || !validatePreferences(storedPrefs)) {
                    storedPrefs = createDefaultPreferences();
                    saveToStorage(storedPrefs);
                }
                setPreferences(storedPrefs);
            }
            catch (err) {
                console.error('[useAIPreferences] Initialization error:', err);
                setError('Failed to load preferences');
                // Set defaults on error
                const defaultPrefs = createDefaultPreferences();
                setPreferences(defaultPrefs);
            }
            finally {
                setIsLoading(false);
            }
        };
        initializePreferences();
    }, []);
    // Save to storage whenever preferences change (debounced)
    useEffect(() => {
        if (!preferences || isLoading)
            return;
        const timer = setTimeout(() => {
            if (hasUnsavedChanges) {
                saveToStorage(preferences);
                saveBackup(preferences);
                setHasUnsavedChanges(false);
            }
        }, 500); // Debounce changes
        return () => clearTimeout(timer);
    }, [preferences, isLoading, hasUnsavedChanges]);
    // Core update function
    const updatePreferences = useCallback(async (updates) => {
        if (!preferences)
            return;
        setError(null);
        try {
            const updatedPrefs = {
                ...preferences,
                ...updates,
                updatedAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
            };
            setPreferences(updatedPrefs);
            setHasUnsavedChanges(true);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to update preferences';
            setError(message);
            throw err;
        }
    }, [preferences]);
    // Save preferences explicitly
    const savePreferences = useCallback(async () => {
        if (!preferences)
            return;
        setIsSaving(true);
        setError(null);
        try {
            const prefsToSave = {
                ...preferences,
                updatedAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
            };
            const success = saveToStorage(prefsToSave);
            if (!success) {
                throw new Error('Failed to save to local storage');
            }
            saveBackup(prefsToSave);
            setHasUnsavedChanges(false);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to save preferences';
            setError(message);
            throw err;
        }
        finally {
            setIsSaving(false);
        }
    }, [preferences]);
    // Reset to defaults
    const resetPreferences = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const defaultPrefs = createDefaultPreferences();
            setPreferences(defaultPrefs);
            saveToStorage(defaultPrefs);
            saveBackup(defaultPrefs);
            setHasUnsavedChanges(false);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to reset preferences';
            setError(message);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Section-specific update functions
    const updateTravelPreferences = useCallback(async (updates) => {
        if (!preferences)
            return;
        await updatePreferences({ travelPreferences: { ...preferences.travelPreferences, ...updates } });
    }, [preferences, updatePreferences]);
    const updatePersonalizationSettings = useCallback(async (updates) => {
        if (!preferences)
            return;
        await updatePreferences({ personalizationSettings: { ...preferences.personalizationSettings, ...updates } });
    }, [preferences, updatePreferences]);
    const updateAdvancedSettings = useCallback(async (updates) => {
        if (!preferences)
            return;
        await updatePreferences({ advancedSettings: { ...preferences.advancedSettings, ...updates } });
    }, [preferences, updatePreferences]);
    const updatePrivacySettings = useCallback(async (updates) => {
        if (!preferences)
            return;
        await updatePreferences({ privacySettings: { ...preferences.privacySettings, ...updates } });
    }, [preferences, updatePreferences]);
    const updateNotificationSettings = useCallback(async (updates) => {
        if (!preferences)
            return;
        await updatePreferences({ notificationSettings: { ...preferences.notificationSettings, ...updates } });
    }, [preferences, updatePreferences]);
    // SECURITY FIX: Replaced dynamic object injection with explicit switch statements to prevent Prototype Pollution
    const isSectionValid = useCallback((section) => {
        if (!preferences)
            return false;
        switch (section) {
            case 'travelPreferences': {
                const tp = preferences.travelPreferences;
                return tp?.preferredLanguages !== undefined && tp?.preferredTravelStyle !== undefined;
            }
            case 'personalizationSettings': {
                const ps = preferences.personalizationSettings;
                return ps?.personalityType !== undefined && ps?.responseLength !== undefined;
            }
            case 'advancedSettings':
                return preferences.advancedSettings !== undefined && preferences.advancedSettings !== null;
            case 'privacySettings':
                return preferences.privacySettings !== undefined && preferences.privacySettings !== null;
            case 'notificationSettings':
                return preferences.notificationSettings !== undefined && preferences.notificationSettings !== null;
            case 'createdAt':
                return !!preferences.createdAt;
            case 'updatedAt':
                return !!preferences.updatedAt;
            case 'lastUpdated':
                return !!preferences.lastUpdated;
            default:
                return false;
        }
    }, [preferences]);
    // SECURITY FIX: Replaced dynamic object injection with explicit switch statements to prevent Prototype Pollution
    const getSection = useCallback((section) => {
        if (!preferences)
            return null;
        switch (section) {
            case 'travelPreferences':
                return preferences.travelPreferences;
            case 'personalizationSettings':
                return preferences.personalizationSettings;
            case 'advancedSettings':
                return preferences.advancedSettings;
            case 'privacySettings':
                return preferences.privacySettings;
            case 'notificationSettings':
                return preferences.notificationSettings;
            case 'createdAt':
                return preferences.createdAt;
            case 'updatedAt':
                return preferences.updatedAt;
            case 'lastUpdated':
                return preferences.lastUpdated;
            default:
                return null;
        }
    }, [preferences]);
    // Memoized return value
    const returnValue = useMemo(() => ({
        preferences,
        isLoading,
        isSaving,
        error,
        hasUnsavedChanges,
        updatePreferences,
        savePreferences,
        resetPreferences,
        updateTravelPreferences,
        updatePersonalizationSettings,
        updateAdvancedSettings,
        updatePrivacySettings,
        updateNotificationSettings,
        isSectionValid,
        getSection,
        data: preferences,
    }), [
        preferences,
        isLoading,
        isSaving,
        error,
        hasUnsavedChanges,
        updatePreferences,
        savePreferences,
        resetPreferences,
        updateTravelPreferences,
        updatePersonalizationSettings,
        updateAdvancedSettings,
        updatePrivacySettings,
        updateNotificationSettings,
        isSectionValid,
        getSection,
    ]);
    return returnValue;
}
// Export the hook as default for convenience
export default useAIPreferences;
//# sourceMappingURL=useAIPreferences.js.map