// packages/shared/src/types/ai-preferences/utils.ts
import { AIPreferences } from './interfaces';

/**
 * Validates the AI preferences object.
 * @param preferences - The object to validate.
 * @returns True if the object is a valid AIPreferences, false otherwise.
 */
export function validateAIPreferences(preferences: unknown): preferences is AIPreferences {
  if (!preferences || typeof preferences !== 'object' || preferences === null) return false;
  
  const prefs = preferences as Record<string, unknown>;
  // Basic check for required top-level fields
  const requiredFields = [
    'openaiSecret',
    'interfaceSettings',
    'travelPreferences',
    'personalizationSettings',
    'advancedSettings',
    'privacySettings',
    'notificationSettings'
  ];
  
  const hasAllFields = requiredFields.every(field => field in prefs);
  if (!hasAllFields) return false;

  // Type checks for critical fields
  if (typeof prefs.openaiSecret !== 'string') return false;
  
  return true;
}
