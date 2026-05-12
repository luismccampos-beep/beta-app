// shared/src/hooks/index.ts

// Export base hook
export * from './useHook';

// Export AI preferences hook (explicit name to avoid conflict with UnifiedAI)
export { useAIPreferences as useSharedAIPreferences, type UseAIPreferencesReturn } from './useAIPreferences';

// Add more exports as needed
