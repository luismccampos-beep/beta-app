// packages/shared/src/types/traveler-profile.ts

/**
 * Traveler document types for identity verification
 */
export type DocumentType = 'passport' | 'national_id' | 'visa' | 'drivers_license' | 'travel_pass';

/**
 * Document status for tracking validity
 */
export type DocumentStatus = 'valid' | 'expiring_soon' | 'expired' | 'needs_verification';

/**
 * Traveler document information
 */
export interface TravelerDocument {
  id: string;
  type: DocumentType;
  documentNumber: string;
  issuer: string;           // Country or organization that issued the document
  issueDate: string;        // ISO date string
  expiryDate: string;       // ISO date string
  status: DocumentStatus;
  documentUrl?: string;     // URL to scanned document image/PDF
  country: string;          // Country code (ISO 3166-1 alpha-2)
  notes?: string;
  isVerified: boolean;
}

/**
 * Emergency contact information
 */
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;     // e.g., "Spouse", "Parent", "Sibling", "Friend"
  phone: string;
  alternativePhone?: string;
  email?: string;
  country: string;          // Country code
  isPrimary: boolean;
}

/**
 * Travel achievement/badge types
 */
export type BadgeType = 
  | 'first_trip'
  | 'explorer'
  | 'world_traveler'
  | 'early_booker'
  | 'sustainable_traveler'
  | 'reviewer'
  | 'loyal_customer'
  | 'adventure_seeker'
  | 'culture_enthusiast'
  | 'beach_lover'
  | 'mountain_explorer'
  | 'city_hopper'
  | 'foodie_traveler'
  | 'budget_savvy'
  | 'luxury_traveler';

/**
 * Travel badge/achievement
 */
export interface TravelBadge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;             // Lucide icon name or emoji
  earnedAt?: string;        // ISO date string - optional for locked badges
  progress?: number;        // 0-100 for badges in progress
  isLocked: boolean;
}

/**
 * Travel statistics
 */
export interface TravelStats {
  totalTrips: number;
  countriesVisited: number;
  citiesVisited: number;
  continentsVisited: number;
  totalDaysTraveled: number;
  totalMilesTraveled: number;
  totalPhotos: number;
  totalReviews: number;
  favoriteDestination?: string;
  upcomingTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  totalSpent: number;
  currency: string;
  averageTripRating: number;
  longestTrip: number;      // in days
  badges: TravelBadge[];
}

/**
 * Known traveler program info (e.g., TSA PreCheck, Global Entry)
 */
export interface KnownTravelerProgram {
  id: string;
  programName: string;      // e.g., "TSA PreCheck", "Global Entry", "NEXUS"
  membershipNumber: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending';
}

/**
 * Traveler profile completeness items
 */
export interface ProfileCompletenessItem {
  key: string;
  label: string;
  isComplete: boolean;
  weight: number;           // Importance weight for percentage calculation
}

/**
 * Profile completeness summary
 */
export interface ProfileCompleteness {
  percentage: number;
  items: ProfileCompletenessItem[];
  missingItems: string[];
  nextSuggestedAction: string;
}

/**
 * Full traveler profile data
 */
export interface TravelerProfileData {
  documents: TravelerDocument[];
  emergencyContacts: EmergencyContact[];
  stats: TravelStats;
  knownTravelerPrograms: KnownTravelerProgram[];
  completeness: ProfileCompleteness;
}

/**
 * Input types for mutations
 */
export interface CreateDocumentInput {
  type: DocumentType;
  documentNumber: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  country: string;
  documentUrl?: string;
  notes?: string;
}

export interface UpdateDocumentInput extends Partial<CreateDocumentInput> {
  id: string;
}

export interface CreateEmergencyContactInput {
  name: string;
  relationship: string;
  phone: string;
  alternativePhone?: string;
  email?: string;
  country: string;
  isPrimary: boolean;
}

export interface UpdateEmergencyContactInput extends Partial<CreateEmergencyContactInput> {
  id: string;
}

/**
 * Document type labels for display
 */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  passport: 'Passport',
  national_id: 'National ID',
  visa: 'Visa',
  drivers_license: "Driver's License",
  travel_pass: 'Travel Pass',
};

/**
 * Badge type configurations
 */
export const BADGE_CONFIGS: Record<BadgeType, { name: string; description: string; icon: string; threshold?: number }> = {
  first_trip: {
    name: 'First Trip',
    description: 'Completed your first trip',
    icon: 'Plane',
    threshold: 1,
  },
  explorer: {
    name: 'Explorer',
    description: 'Visited 5 different countries',
    icon: 'Globe',
    threshold: 5,
  },
  world_traveler: {
    name: 'World Traveler',
    description: 'Visited 10 different countries',
    icon: 'World',
    threshold: 10,
  },
  early_booker: {
    name: 'Early Booker',
    description: 'Booked 3 trips more than 60 days in advance',
    icon: 'Calendar',
    threshold: 3,
  },
  sustainable_traveler: {
    name: 'Sustainable Traveler',
    description: 'Chose eco-friendly options 5 times',
    icon: 'Leaf',
    threshold: 5,
  },
  reviewer: {
    name: 'Reviewer',
    description: 'Left 5 reviews for your trips',
    icon: 'Star',
    threshold: 5,
  },
  loyal_customer: {
    name: 'Loyal Customer',
    description: 'Completed 10 trips with us',
    icon: 'Heart',
    threshold: 10,
  },
  adventure_seeker: {
    name: 'Adventure Seeker',
    description: 'Booked 3 adventure activities',
    icon: 'Mountain',
    threshold: 3,
  },
  culture_enthusiast: {
    name: 'Culture Enthusiast',
    description: 'Visited 5 museums or historical sites',
    icon: 'Landmark',
    threshold: 5,
  },
  beach_lover: {
    name: 'Beach Lover',
    description: 'Booked 3 beach destinations',
    icon: 'Umbrella',
    threshold: 3,
  },
  mountain_explorer: {
    name: 'Mountain Explorer',
    description: 'Completed 3 mountain trips',
    icon: 'Tent',
    threshold: 3,
  },
  city_hopper: {
    name: 'City Hopper',
    description: 'Visited 5 different cities',
    icon: 'Building',
    threshold: 5,
  },
  foodie_traveler: {
    name: 'Foodie Traveler',
    description: 'Booked 3 culinary experiences',
    icon: 'Utensils',
    threshold: 3,
  },
  budget_savvy: {
    name: 'Budget Savvy',
    description: 'Saved money using our deals 5 times',
    icon: 'PiggyBank',
    threshold: 5,
  },
  luxury_traveler: {
    name: 'Luxury Traveler',
    description: 'Booked 3 premium packages',
    icon: 'Crown',
    threshold: 3,
  },
};

// ============================================================
// LOYALTY AND FREQUENT FLYER PROGRAMS
// ============================================================

/**
 * Loyalty program category
 */
export type LoyaltyProgramCategory = 'airline' | 'hotel' | 'car_rental' | 'credit_card' | 'other';

/**
 * Loyalty program status/tier levels
 */
export type LoyaltyStatus = 
  | 'basic'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'elite'
  | 'super_elite'
  | 'concierge';

/**
 * Loyalty program information (airlines, hotels, etc.)
 */
export interface LoyaltyProgram {
  id: string;
  programName: string;           // e.g., "TAP Miles&Go", "Marriott Bonvoy"
  programCategory: LoyaltyProgramCategory;
  membershipNumber: string;
  status: LoyaltyStatus;
  statusLabel?: string;          // Custom status label if different from standard
  points: number;
  pointsLabel?: string;          // e.g., "Miles", "Points", "Nights"
  tierPoints?: number;           // Points toward next tier
  tierThreshold?: number;        // Points needed for next tier
  expiryDate?: string;           // ISO date string when points might expire
  joinDate?: string;             // ISO date string
  programUrl?: string;           // Link to program website
  redeemUrl?: string;            // Direct link to redeem points
  helpUrl?: string;              // Link to help/support
  logoUrl?: string;              // Program logo URL
  benefits?: string[];           // List of current benefits
  isVerified: boolean;           // Whether the membership has been verified
  lastSyncedAt?: string;         // Last time data was synced from program
}

/**
 * Input type for creating a loyalty program
 */
export interface CreateLoyaltyProgramInput {
  programName: string;
  programCategory: LoyaltyProgramCategory;
  membershipNumber: string;
  status?: LoyaltyStatus;
  statusLabel?: string;
  points?: number;
  pointsLabel?: string;
  tierPoints?: number;
  tierThreshold?: number;
  expiryDate?: string;
  joinDate?: string;
  programUrl?: string;
  redeemUrl?: string;
  helpUrl?: string;
  logoUrl?: string;
}

/**
 * Input type for updating a loyalty program
 */
export interface UpdateLoyaltyProgramInput extends Partial<CreateLoyaltyProgramInput> {
  id: string;
}

/**
 * Loyalty status display labels
 */
export const LOYALTY_STATUS_LABELS: Record<LoyaltyStatus, string> = {
  basic: 'Basic',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
  elite: 'Elite',
  super_elite: 'Super Elite',
  concierge: 'Concierge',
};

/**
 * Loyalty category display labels
 */
export const LOYALTY_CATEGORY_LABELS: Record<LoyaltyProgramCategory, string> = {
  airline: 'Airline',
  hotel: 'Hotel',
  car_rental: 'Car Rental',
  credit_card: 'Credit Card',
  other: 'Other',
};

// ============================================================
// SAVED TRAVELERS
// ============================================================

/**
 * Traveler type (adult, child, infant)
 */
export type TravelerType = 'adult' | 'child' | 'infant';

/**
 * Meal preference options
 */
export type MealPreference = 
  | 'standard'
  | 'vegetarian'
  | 'vegan'
  | 'kosher'
  | 'halal'
  | 'gluten_free'
  | 'diabetic'
  | 'low_sodium'
  | 'hindu'
  | 'asian_veg'
  | 'other';

/**
 * Seat preference options
 */
export type SeatPreference = 'aisle' | 'window' | 'middle' | 'no_preference';

/**
 * Assistance needs for travelers
 */
export type AssistanceNeed = 
  | 'wheelchair'
  | 'visual_impairment'
  | 'hearing_impairment'
  | 'mobility_assistance'
  | 'oxygen_required'
  | 'service_animal'
  | 'stretcher'
  | 'medical_equipment'
  | 'cognitive_support'
  | 'other';

/**
 * Saved traveler profile (for reuse during checkout)
 */
export interface SavedTraveler {
  id: string;
  type: TravelerType;
  firstName: string;
  lastName: string;
  dateOfBirth: string;           // ISO date string
  nationality: string;           // Country code (ISO 3166-1 alpha-2)
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  email?: string;
  phone?: string;
  
  // Documents
  documents: TravelerDocument[];
  
  // Preferences
  mealPreference?: MealPreference;
  seatPreference?: SeatPreference;
  frequentFlyerPrograms?: LoyaltyProgram[];  // Traveler-specific loyalty programs
  
  // Special assistance
  assistanceNeeds?: AssistanceNeed[];
  assistanceNotes?: string;
  
  // Additional info
  knownTravelerNumber?: string;  // For TSA PreCheck, etc.
  redressNumber?: string;        // DHS redress number
  
  // Metadata
  isPrimary: boolean;            // Is this the primary traveler (account holder)?
  relationship?: string;         // Relationship to primary traveler (e.g., "Spouse", "Child")
  createdAt: string;
  updatedAt: string;
}

/**
 * Input type for creating a saved traveler
 */
export interface CreateSavedTravelerInput {
  type: TravelerType;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  email?: string;
  phone?: string;
  mealPreference?: MealPreference;
  seatPreference?: SeatPreference;
  assistanceNeeds?: AssistanceNeed[];
  assistanceNotes?: string;
  knownTravelerNumber?: string;
  redressNumber?: string;
  isPrimary?: boolean;
  relationship?: string;
}

/**
 * Input type for updating a saved traveler
 */
export interface UpdateSavedTravelerInput extends Partial<CreateSavedTravelerInput> {
  id: string;
}

/**
 * Meal preference labels
 */
export const MEAL_PREFERENCE_LABELS: Record<MealPreference, string> = {
  standard: 'Standard Meal',
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  kosher: 'Kosher',
  halal: 'Halal',
  gluten_free: 'Gluten Free',
  diabetic: 'Diabetic Meal',
  low_sodium: 'Low Sodium',
  hindu: 'Hindu Meal',
  asian_veg: 'Asian Vegetarian',
  other: 'Other',
};

/**
 * Seat preference labels
 */
export const SEAT_PREFERENCE_LABELS: Record<SeatPreference, string> = {
  aisle: 'Aisle Seat',
  window: 'Window Seat',
  middle: 'Middle Seat',
  no_preference: 'No Preference',
};

/**
 * Assistance need labels
 */
export const ASSISTANCE_NEED_LABELS: Record<AssistanceNeed, string> = {
  wheelchair: 'Wheelchair Assistance',
  visual_impairment: 'Visual Impairment Support',
  hearing_impairment: 'Hearing Impairment Support',
  mobility_assistance: 'Mobility Assistance',
  oxygen_required: 'Oxygen Required',
  service_animal: 'Service Animal',
  stretcher: 'Stretcher Required',
  medical_equipment: 'Medical Equipment',
  cognitive_support: 'Cognitive Support',
  other: 'Other Assistance',
};

/**
 * Traveler type labels
 */
export const TRAVELER_TYPE_LABELS: Record<TravelerType, string> = {
  adult: 'Adult (12+ years)',
  child: 'Child (2-11 years)',
  infant: 'Infant (under 2 years)',
};

// ============================================================
// TRIP PREFERENCES
// ============================================================

/**
 * Cabin class options
 */
export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';

/**
 * Bed type preference
 */
export type BedTypePreference = 'single' | 'double' | 'queen' | 'king' | 'twin' | 'no_preference';

/**
 * Smoking preference
 */
export type SmokingPreference = 'smoking' | 'non_smoking' | 'no_preference';

/**
 * Flight preferences
 */
export interface FlightPreferences {
  seatPreference: SeatPreference;
  cabinClass: CabinClass;
  baggageDefaults: {
    checkedBags: number;         // Default number of checked bags
    carryOnBags: number;         // Default number of carry-on bags
  };
  preferredAirlines: string[];   // Airline codes (IATA)
  avoidedAirlines?: string[];    // Airlines to avoid
  mealPreference?: MealPreference;
  preferredAirports?: string[];  // Airport codes (IATA)
  avoidAirports?: string[];      // Airports to avoid
  preferDirectFlights: boolean;
  maxLayovers?: number;
  layoverPreference?: 'short' | 'medium' | 'long' | 'no_preference';
}

/**
 * Hotel preferences
 */
export interface HotelPreferences {
  bedType: BedTypePreference;
  smokingPolicy: SmokingPreference;
  lateCheckoutPreference: boolean;
  highFloorPreference?: boolean;
  quietRoomPreference?: boolean;
  preferredAmenities: string[];  // e.g., "wifi", "pool", "gym", "spa", "breakfast"
  preferredChains?: string[];    // Hotel chain preferences
  avoidedChains?: string[];      // Hotel chains to avoid
  roomTypePreference?: string;   // e.g., "standard", "deluxe", "suite"
  accessibilityNeeds?: string[];
}

/**
 * Budget guardrails
 */
export interface BudgetGuardrails {
  currency: string;              // ISO 4217 currency code
  defaultBudget?: number;        // Default budget per trip
  maxBudget?: number;            // Maximum budget limit
  alertThreshold?: number;       // Percentage (0-100) to trigger budget alert
  budgetPeriod?: 'per_trip' | 'per_month' | 'per_year';
  includeFlights: boolean;
  includeHotels: boolean;
  includeActivities: boolean;
  includeMeals: boolean;
  includeTransport: boolean;
}

/**
 * Complete user trip preferences (for profile settings)
 * Note: This is different from TripPreferences in trip-generator which is for AI trip generation
 */
export interface UserTripPreferences {
  flight: FlightPreferences;
  hotel: HotelPreferences;
  budget: BudgetGuardrails;
  additionalNotes?: string;
}

/**
 * Default flight preferences
 */
export const DEFAULT_FLIGHT_PREFERENCES: FlightPreferences = {
  seatPreference: 'no_preference',
  cabinClass: 'economy',
  baggageDefaults: {
    checkedBags: 0,
    carryOnBags: 1,
  },
  preferredAirlines: [],
  preferDirectFlights: true,
};

/**
 * Default hotel preferences
 */
export const DEFAULT_HOTEL_PREFERENCES: HotelPreferences = {
  bedType: 'no_preference',
  smokingPolicy: 'no_preference',
  lateCheckoutPreference: false,
  preferredAmenities: [],
};

/**
 * Default budget guardrails
 */
export const DEFAULT_BUDGET_GUARDRAILS: BudgetGuardrails = {
  currency: 'EUR',
  alertThreshold: 80,
  budgetPeriod: 'per_trip',
  includeFlights: true,
  includeHotels: true,
  includeActivities: true,
  includeMeals: true,
  includeTransport: true,
};

/**
 * Cabin class labels
 */
export const CABIN_CLASS_LABELS: Record<CabinClass, string> = {
  economy: 'Economy',
  premium_economy: 'Premium Economy',
  business: 'Business',
  first: 'First Class',
};

/**
 * Bed type labels
 */
export const BED_TYPE_LABELS: Record<BedTypePreference, string> = {
  single: 'Single Bed',
  double: 'Double Bed',
  queen: 'Queen Bed',
  king: 'King Bed',
  twin: 'Twin Beds',
  no_preference: 'No Preference',
};

/**
 * Smoking preference labels
 */
export const SMOKING_PREFERENCE_LABELS: Record<SmokingPreference, string> = {
  smoking: 'Smoking Room',
  non_smoking: 'Non-Smoking Room',
  no_preference: 'No Preference',
};