// packages/shared/src/types/traveler-profile.ts
/**
 * Document type labels for display
 */
export const DOCUMENT_TYPE_LABELS = {
    passport: 'Passport',
    national_id: 'National ID',
    visa: 'Visa',
    drivers_license: "Driver's License",
    travel_pass: 'Travel Pass',
    tax_id: 'Tax Identification Number',
};
/**
 * Badge type configurations
 */
export const BADGE_CONFIGS = {
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
/**
 * Loyalty status display labels
 */
export const LOYALTY_STATUS_LABELS = {
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
export const LOYALTY_CATEGORY_LABELS = {
    airline: 'Airline',
    hotel: 'Hotel',
    car_rental: 'Car Rental',
    credit_card: 'Credit Card',
    other: 'Other',
};
/**
 * Meal preference labels
 */
export const MEAL_PREFERENCE_LABELS = {
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
export const SEAT_PREFERENCE_LABELS = {
    aisle: 'Aisle Seat',
    window: 'Window Seat',
    middle: 'Middle Seat',
    no_preference: 'No Preference',
};
/**
 * Assistance need labels
 */
export const ASSISTANCE_NEED_LABELS = {
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
export const TRAVELER_TYPE_LABELS = {
    adult: 'Adult (12+ years)',
    child: 'Child (2-11 years)',
    infant: 'Infant (under 2 years)',
};
/**
 * Default flight preferences
 */
export const DEFAULT_FLIGHT_PREFERENCES = {
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
export const DEFAULT_HOTEL_PREFERENCES = {
    bedType: 'no_preference',
    smokingPolicy: 'no_preference',
    lateCheckoutPreference: false,
    preferredAmenities: [],
};
/**
 * Default budget guardrails
 */
export const DEFAULT_BUDGET_GUARDRAILS = {
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
export const CABIN_CLASS_LABELS = {
    economy: 'Economy',
    premium_economy: 'Premium Economy',
    business: 'Business',
    first: 'First Class',
};
/**
 * Bed type labels
 */
export const BED_TYPE_LABELS = {
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
export const SMOKING_PREFERENCE_LABELS = {
    smoking: 'Smoking Room',
    non_smoking: 'Non-Smoking Room',
    no_preference: 'No Preference',
};
//# sourceMappingURL=traveler-profile.js.map