import { z } from 'zod';

// ── Language sub-schema ──────────────────────────────────────────────
const languageSchema = z.object({
  language: z.string().min(1),
  proficiency: z.string().min(1),
});

// ── Quick start: the bare minimum to see results ────────────────────
export const quickStartSchema = z.object({
  travelStyles: z.array(z.string()).min(1),
  budgetRange: z.array(z.number()).length(2),
  preferredDestinations: z.array(z.string()).min(1),
});

// ── Full schema: everything optional with intelligent defaults ──────
export const travelPreferencesSchema = quickStartSchema.extend({
  // Travel Style
  travelFrequency: z.string().default('occasional'),
  travelPurpose: z.array(z.string()).default([]),
  nationality: z.string().optional(),
  preferredCountries: z.array(z.string()).default([]),
  preferredContinents: z.array(z.string()).default([]),

  // Budget
  currency: z.string().default('EUR'),
  budgetPriority: z.string().default('balanced'),
  dailyBudgetProfile: z
    .enum(['mochileiro', 'conforto', 'luxo'])
    .default('conforto'),

  // Flight & Accommodation
  cabinClass: z.string().default('economy'),
  seatPreference: z.string().default('any'),
  mealPreference: z.string().default('any'),
  accommodationType: z.array(z.string()).default([]),
  loyaltyPrograms: z.array(z.string()).default([]),
  hotelChain: z.array(z.string()).default([]),
  roomType: z.string().default(''),
  amenities: z.array(z.string()).default([]),

  // Cruise
  cruiseEnabled: z.boolean().default(false),
  cruiseDestinations: z.array(z.string()).default([]),
  cruiseBrandNames: z.array(z.string()).default([]),
  cruiseTier: z.string().default(''),
  cruiseShipType: z.string().default(''),
  cruiseDuration: z.string().default(''),

  // Activities
  activityTypes: z.array(z.string()).default([]),
  pacePreference: z.string().default('moderate'),
  experienceTypes: z.array(z.string()).default([]),
  languages: z.array(languageSchema).default([]),

  // Special Requirements
  sustainabilityLevel: z.string().default('medium'),
  ecoPreferences: z.array(z.string()).default([]),
  carbonOffset: z.boolean().default(false),
  dietaryRestrictions: z.array(z.string()).default([]),
  accessibility: z.array(z.string()).default([]),
  medicalConditions: z.string().default(''),

  // Advanced Settings
  aiRecommendations: z.boolean().default(true),
  dataSharing: z.boolean().default(false),
  notifications: z.array(z.string()).default(['email']),
  privacyLevel: z.string().default('standard'),
});

// Exported types
export type TravelPreferences = z.infer<typeof travelPreferencesSchema>;
export type QuickStartPreferences = z.infer<typeof quickStartSchema>;

// ── Default values ───────────────────────────────────────────────────
export const DEFAULT_TRAVEL_PREFERENCES: TravelPreferences = {
  travelStyles: [],
  budgetRange: [2000, 5000],
  preferredDestinations: [],
  travelFrequency: 'occasional',
  travelPurpose: [],
  nationality: '',
  preferredCountries: [],
  preferredContinents: [],
  currency: 'EUR',
  budgetPriority: 'balanced',
  dailyBudgetProfile: 'conforto',
  cabinClass: 'economy',
  seatPreference: 'any',
  mealPreference: 'any',
  accommodationType: [],
  loyaltyPrograms: [],
  hotelChain: [],
  roomType: '',
  amenities: [],
  cruiseEnabled: false,
  cruiseDestinations: [],
  cruiseBrandNames: [],
  cruiseTier: '',
  cruiseShipType: '',
  cruiseDuration: '',
  activityTypes: [],
  pacePreference: 'moderate',
  experienceTypes: [],
  languages: [],
  sustainabilityLevel: 'medium',
  ecoPreferences: [],
  carbonOffset: false,
  dietaryRestrictions: [],
  accessibility: [],
  medicalConditions: '',
  aiRecommendations: true,
  dataSharing: false,
  notifications: ['email'],
  privacyLevel: 'standard',
};

// ── Step field grouping for validation ──────────────────────────────
export const STEP_FIELDS: Record<number, (keyof TravelPreferences)[]> = {
  // Step 0: Destination – only required for quick start
  0: ['travelStyles', 'preferredDestinations'],
  // Step 1: Budget – only budget range is required
  1: ['dailyBudgetProfile', 'budgetRange'],
  // Step 2: Refine (optional) – nothing required, free to skip
  2: [],
};

// Fields that are always optional (hints only)
export const OPTIONAL_FIELD_HINT =
  'Podes preencher depois – não é obrigatório para veres resultados';
