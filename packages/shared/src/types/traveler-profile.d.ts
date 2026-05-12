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
    issuer: string;
    issueDate: string;
    expiryDate: string;
    status: DocumentStatus;
    documentUrl?: string;
    country: string;
    notes?: string;
    isVerified: boolean;
}
/**
 * Emergency contact information
 */
export interface EmergencyContact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
    alternativePhone?: string;
    email?: string;
    country: string;
    isPrimary: boolean;
}
/**
 * Travel achievement/badge types
 */
export type BadgeType = 'first_trip' | 'explorer' | 'world_traveler' | 'early_booker' | 'sustainable_traveler' | 'reviewer' | 'loyal_customer' | 'adventure_seeker' | 'culture_enthusiast' | 'beach_lover' | 'mountain_explorer' | 'city_hopper' | 'foodie_traveler' | 'budget_savvy' | 'luxury_traveler';
/**
 * Travel badge/achievement
 */
export interface TravelBadge {
    id: string;
    type: BadgeType;
    name: string;
    description: string;
    icon: string;
    earnedAt?: string;
    progress?: number;
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
    longestTrip: number;
    badges: TravelBadge[];
}
/**
 * Known traveler program info (e.g., TSA PreCheck, Global Entry)
 */
export interface KnownTravelerProgram {
    id: string;
    programName: string;
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
    weight: number;
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
export declare const DOCUMENT_TYPE_LABELS: Record<DocumentType, string>;
/**
 * Badge type configurations
 */
export declare const BADGE_CONFIGS: Record<BadgeType, {
    name: string;
    description: string;
    icon: string;
    threshold?: number;
}>;
/**
 * Loyalty program category
 */
export type LoyaltyProgramCategory = 'airline' | 'hotel' | 'car_rental' | 'credit_card' | 'other';
/**
 * Loyalty program status/tier levels
 */
export type LoyaltyStatus = 'basic' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'elite' | 'super_elite' | 'concierge';
/**
 * Loyalty program information (airlines, hotels, etc.)
 */
export interface LoyaltyProgram {
    id: string;
    programName: string;
    programCategory: LoyaltyProgramCategory;
    membershipNumber: string;
    status: LoyaltyStatus;
    statusLabel?: string;
    points: number;
    pointsLabel?: string;
    tierPoints?: number;
    tierThreshold?: number;
    expiryDate?: string;
    joinDate?: string;
    programUrl?: string;
    redeemUrl?: string;
    helpUrl?: string;
    logoUrl?: string;
    benefits?: string[];
    isVerified: boolean;
    lastSyncedAt?: string;
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
export declare const LOYALTY_STATUS_LABELS: Record<LoyaltyStatus, string>;
/**
 * Loyalty category display labels
 */
export declare const LOYALTY_CATEGORY_LABELS: Record<LoyaltyProgramCategory, string>;
/**
 * Traveler type (adult, child, infant)
 */
export type TravelerType = 'adult' | 'child' | 'infant';
/**
 * Meal preference options
 */
export type MealPreference = 'standard' | 'vegetarian' | 'vegan' | 'kosher' | 'halal' | 'gluten_free' | 'diabetic' | 'low_sodium' | 'hindu' | 'asian_veg' | 'other';
/**
 * Seat preference options
 */
export type SeatPreference = 'aisle' | 'window' | 'middle' | 'no_preference';
/**
 * Assistance needs for travelers
 */
export type AssistanceNeed = 'wheelchair' | 'visual_impairment' | 'hearing_impairment' | 'mobility_assistance' | 'oxygen_required' | 'service_animal' | 'stretcher' | 'medical_equipment' | 'cognitive_support' | 'other';
/**
 * Saved traveler profile (for reuse during checkout)
 */
export interface SavedTraveler {
    id: string;
    type: TravelerType;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    nationality: string;
    gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    email?: string;
    phone?: string;
    documents: TravelerDocument[];
    mealPreference?: MealPreference;
    seatPreference?: SeatPreference;
    frequentFlyerPrograms?: LoyaltyProgram[];
    assistanceNeeds?: AssistanceNeed[];
    assistanceNotes?: string;
    knownTravelerNumber?: string;
    redressNumber?: string;
    isPrimary: boolean;
    relationship?: string;
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
export declare const MEAL_PREFERENCE_LABELS: Record<MealPreference, string>;
/**
 * Seat preference labels
 */
export declare const SEAT_PREFERENCE_LABELS: Record<SeatPreference, string>;
/**
 * Assistance need labels
 */
export declare const ASSISTANCE_NEED_LABELS: Record<AssistanceNeed, string>;
/**
 * Traveler type labels
 */
export declare const TRAVELER_TYPE_LABELS: Record<TravelerType, string>;
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
        checkedBags: number;
        carryOnBags: number;
    };
    preferredAirlines: string[];
    avoidedAirlines?: string[];
    mealPreference?: MealPreference;
    preferredAirports?: string[];
    avoidAirports?: string[];
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
    preferredAmenities: string[];
    preferredChains?: string[];
    avoidedChains?: string[];
    roomTypePreference?: string;
    accessibilityNeeds?: string[];
}
/**
 * Budget guardrails
 */
export interface BudgetGuardrails {
    currency: string;
    defaultBudget?: number;
    maxBudget?: number;
    alertThreshold?: number;
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
export declare const DEFAULT_FLIGHT_PREFERENCES: FlightPreferences;
/**
 * Default hotel preferences
 */
export declare const DEFAULT_HOTEL_PREFERENCES: HotelPreferences;
/**
 * Default budget guardrails
 */
export declare const DEFAULT_BUDGET_GUARDRAILS: BudgetGuardrails;
/**
 * Cabin class labels
 */
export declare const CABIN_CLASS_LABELS: Record<CabinClass, string>;
/**
 * Bed type labels
 */
export declare const BED_TYPE_LABELS: Record<BedTypePreference, string>;
/**
 * Smoking preference labels
 */
export declare const SMOKING_PREFERENCE_LABELS: Record<SmokingPreference, string>;
