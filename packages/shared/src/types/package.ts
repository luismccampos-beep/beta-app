// =============================================================================
// Supporting Types
// =============================================================================

export interface Review {
  id: string;
  name: string;
  avatar?: string | null;
  verified?: boolean;
  rating: number;
  date: string;
  comment: string;
  helpful?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  index?: number;
}

export type ServiceCategory =
  | 'accommodation'
  | 'transportation'
  | 'activities'
  | 'dining'
  | 'insurance'
  | 'guides'
  | 'equipment';

export interface ServiceProvider {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  verified: boolean;
  description: string;
}

export interface ServiceAvailability {
  date: string;
  availableSlots: number;
  price: number;
  timeSlots?: string[];
}

export interface AddOnService {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface PackageService {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  currency: string;
  duration?: string;
  location?: string;
  rating?: number;
  reviews?: number;
  images: string[];
  features: string[];
  included: string[];
  excluded?: string[];
  availability: ServiceAvailability[];
  capacity: {
    min: number;
    max: number;
  };
  difficulty?: 'easy' | 'moderate' | 'challenging' | 'expert';
  requirements?: string[];
  cancellationPolicy: string;
  provider: ServiceProvider;
  tags: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  addOns?: AddOnService[];
}

// =============================================================================
// Travel Package
// =============================================================================

export type PackageCategory =
  | 'adventure'
  | 'luxury'
  | 'family'
  | 'romantic'
  | 'cultural'
  | 'eco'
  | 'coastal'
  | 'corporate'
  | 'cultural-exchange'
  | 'gastronomic'
  | 'group-travel'
  | 'photography'
  | 'snow-sports'
  | 'wellness'
  | string;

export type DifficultyLevel = 'easy' | 'moderate' | 'challenging' | 'expert';

export interface TravelPackage {
  id: string;
  slug?: string;
  name: string;
  title?: string;
  description: string;
  destination: string;
  price: number;
  duration: number;
  rating: number;
  reviews: number;
  category: PackageCategory;
  images: string[];
  features?: string[];
  inclusions?: string[];
  exclusions?: string[];
  included?: string[];
  excluded?: string[];
  highlights?: string[];
  tags: string[];
  difficulty?: DifficultyLevel;
  bestTimeToVisit?: string | string[];
  climate?: string;
  requirements?: string[];
  serviceType?: 'package' | 'service' | 'both';

  // Web feature specific fields
  groupSize?: { min: number; max: number };
  ageRestrictions?: { min: number };
  languages?: string[];
  physicalRequirements?: string[];
  weatherInfo?: Array<{
    season: string;
    temperature: string;
    rainfall: string;
    description: string;
  }>;
  reviewsCount?: number;
  originalPrice?: number;
  featured?: boolean;
  seo?: { slug: string };
}

// =============================================================================
// Extended Travel Package — typed itinerary and weather structures
// =============================================================================

export interface ItineraryActivity {
  id?: string;
  name: string;
  duration?: string;
  description?: string;
  location?: string;
  type?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: ItineraryActivity[];
}

export interface MonthlyWeather {
  month: string;
  avgTemperature: number;
  minTemperature?: number;
  maxTemperature?: number;
  rainfall?: number;
  humidity?: number;
  description?: string;
}

export interface MonthlyRecommendation {
  month: string;
  recommended: boolean;
  reason?: string;
  highlights?: string[];
}

export interface DayDetail {
  day: number;
  morning: ItineraryActivity[];
  afternoon: ItineraryActivity[];
  evening: ItineraryActivity[];
}

export interface PackageAvailability {
  startDate: string;
  endDate: string;
  spotsAvailable: number;
}

export interface ExtendedTravelPackage extends TravelPackage {
  itinerary?: ItineraryDay[];
  availability?: PackageAvailability[];
  monthlyWeather?: MonthlyWeather[];
  monthlyRecommendations?: MonthlyRecommendation[];
  dayDetails?: DayDetail[];
  extraActivities?: Array<{ name: string; duration: string }>;
  similarPackages?: TravelPackage[];
}

// =============================================================================
// Search & Filter
// =============================================================================

export interface PackageSearchParams {
  q?: string;
  destination?: string;
  type?: string;
  featured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface PackagesResponse {
  success: boolean;
  data: TravelPackage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PackageFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  minRating?: number;
  serviceType?: 'package' | 'service' | 'both';
}