import { z } from 'zod';

const languageSchema = z.object({
  language: z.string().min(1),
  proficiency: z.string().min(1),
});

export const quickStartSchema = z.object({
  travelStyles: z.array(z.string()).min(1),
  budgetRange: z.array(z.number()).length(2),
  preferredDestinations: z.array(z.string()).min(1),
});

export const travelPreferencesSchema = quickStartSchema.extend({
  travelFrequency: z.string().default('occasional'),
  travelPurpose: z.array(z.string()).default([]),
  nationality: z.string().optional(),
  preferredCountries: z.array(z.string()).default([]),
  preferredContinents: z.array(z.string()).default([]),
  currency: z.string().default('EUR'),
  budgetPriority: z.string().default('balanced'),
  dailyBudgetProfile: z
    .enum(['mochileiro', 'conforto', 'luxo'])
    .default('conforto'),
  cabinClass: z.string().default('economy'),
  seatPreference: z.string().default('any'),
  mealPreference: z.string().default('any'),
  accommodationType: z.array(z.string()).default([]),
  loyaltyPrograms: z.array(z.string()).default([]),
  hotelChain: z.array(z.string()).default([]),
  roomType: z.string().default(''),
  amenities: z.array(z.string()).default([]),
  cruiseEnabled: z.boolean().default(false),
  cruiseDestinations: z.array(z.string()).default([]),
  cruiseBrandNames: z.array(z.string()).default([]),
  cruiseTier: z.string().default(''),
  cruiseShipType: z.string().default(''),
  cruiseDuration: z.string().default(''),
  activityTypes: z.array(z.string()).default([]),
  pacePreference: z.string().default('moderate'),
  experienceTypes: z.array(z.string()).default([]),
  languages: z.array(languageSchema).default([]),
  sustainabilityLevel: z.string().default('medium'),
  ecoPreferences: z.array(z.string()).default([]),
  carbonOffset: z.boolean().default(false),
  dietaryRestrictions: z.array(z.string()).default([]),
  accessibility: z.array(z.string()).default([]),
  medicalConditions: z.string().default(''),
  aiRecommendations: z.boolean().default(true),
  dataSharing: z.boolean().default(false),
  notifications: z.array(z.string()).default(['email']),
  privacyLevel: z.string().default('standard'),
});

export type TravelPreferences = z.infer<typeof travelPreferencesSchema>;
export type QuickStartPreferences = z.infer<typeof quickStartSchema>;

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

export const STEP_FIELDS: Record<number, (keyof TravelPreferences)[]> = {
  0: ['travelStyles', 'preferredDestinations'],
  1: ['dailyBudgetProfile', 'budgetRange'],
  2: [],
};

export const OPTIONAL_FIELD_HINT =
  'Podes preencher depois – não é obrigatório para veres resultados';
