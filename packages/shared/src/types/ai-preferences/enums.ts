// packages/shared/src/types/ai-preferences/enums.ts

export enum AIProvider {
  OpenAI = 'openai',
  Anthropic = 'anthropic',
  Google = 'google',
  Weather = 'weather',
  Currency = 'currency',
  Local = 'local',
}

export const AI_PROVIDERS = { ...AIProvider } as const;

export enum TravelStyle {
  Luxury = 'Luxury',
  Comfort = 'Comfort',
  Budget = 'Budget',
  Adventure = 'Adventure',
  Cultural = 'Cultural',
  Relaxation = 'Relaxation',
}

export const TRAVEL_STYLES = { ...TravelStyle } as const;

export enum SustainabilityLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export const SUSTAINABILITY_LEVELS = { ...SustainabilityLevel } as const;

export enum PersonalityType {
  Professional = 'Professional',
  Friendly = 'Friendly',
  Enthusiastic = 'Enthusiastic',
  Detailed = 'Detailed',
  Concise = 'Concise',
  Casual = 'Casual',
}

export const PERSONALITY_TYPES = { ...PersonalityType } as const;

export enum ResponseLength {
  Short = 'Short',
  Medium = 'Medium',
  Detailed = 'Detailed',
  Brief = 'Brief',
}

export const RESPONSE_LENGTHS = { ...ResponseLength } as const;

export enum NotificationType {
  Email = 'email',
  Push = 'push',
  SMS = 'sms',
  InApp = 'in-app',
}

export const NOTIFICATION_TYPES = { ...NotificationType } as const;

export enum NotificationFrequency {
  Immediate = 'Immediate',
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Never = 'Never',
}

export const NOTIFICATION_FREQUENCIES = { ...NotificationFrequency } as const;

/**
 * Budget level choices for AI preferences
 * 5 money options based on user spending preferences
 */
export enum BudgetLevel {
  /** Budget-friendly options, lowest cost */
  Economy = 'Economy',
  /** Moderate spending, balanced value */
  Moderate = 'Moderate',
  /** Comfortable spending, good value */
  Comfort = 'Comfort',
  /** Higher spending, premium experience */
  Premium = 'Premium',
  /** Maximum spending, luxury options only */
  Luxury = 'Luxury',
}

export const BUDGET_LEVELS = { ...BudgetLevel } as const;
