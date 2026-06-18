/**
 * Fallback configurations and mock data for external services
 * Used when hotels, flights, or weather APIs are unavailable
 */

export interface HotelFallback {
  id: string;
  name: string;
  stars: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  imageUrl?: string;
  rating: number;
  reviewCount: number;
}

export interface FlightFallback {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  price: number;
  currency: string;
  cabinClass: string;
}

export interface WeatherFallback {
  date: string;
  temperature: {
    min: number;
    max: number;
    current: number;
  };
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

/**
 * Generate fallback hotel data
 */
export function getHotelFallback(count: number = 5): HotelFallback[] {
  const hotelNames = [
    'Grand Hotel Plaza',
    'Seaside Resort & Spa',
    'Mountain View Lodge',
    'City Center Inn',
    'Boutique Hotel',
    'Luxury Suites',
    'Beachfront Paradise',
    'Historic Manor Hotel',
  ];

  const amenities = [
    'WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Parking', 
    'Room Service', 'Business Center', 'Pet Friendly', 'Airport Shuttle'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `hotel-fallback-${i + 1}`,
    name: hotelNames[i % hotelNames.length],
    stars: Math.floor(Math.random() * 3) + 3, // 3-5 stars
    pricePerNight: Math.floor(Math.random() * 300) + 80, // $80-$380
    currency: 'USD',
    amenities: amenities.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 5) + 3),
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0
    reviewCount: Math.floor(Math.random() * 500) + 50,
  }));
}

/**
 * Generate fallback flight data
 */
export function getFlightFallback(count: number = 5): FlightFallback[] {
  const airlines = ['Delta', 'United', 'American', 'Lufthansa', 'Air France', 'British Airways', 'Emirates'];
  const cabins = ['economy', 'premium_economy', 'business', 'first'];

  return Array.from({ length: count }, (_, i) => {
    const departureHour = Math.floor(Math.random() * 12) + 6; // 6 AM - 6 PM
    const durationHours = Math.floor(Math.random() * 8) + 2; // 2-10 hours
    const arrivalHour = (departureHour + durationHours) % 24;

    return {
      id: `flight-fallback-${i + 1}`,
      airline: airlines[i % airlines.length],
      flightNumber: `${airlines[i % airlines.length].substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 9000) + 1000}`,
      departure: {
        airport: 'JFK',
        time: `${departureHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      arrival: {
        airport: 'LHR',
        time: `${arrivalHour.toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      duration: `${durationHours}h ${Math.floor(Math.random() * 60)}m`,
      price: Math.floor(Math.random() * 800) + 200, // $200-$1000
      currency: 'USD',
      cabinClass: cabins[Math.floor(Math.random() * cabins.length)],
    };
  });
}

/**
 * Generate fallback weather data
 */
export function getWeatherFallback(days: number = 7): WeatherFallback[] {
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear', 'Overcast'];
  const baseTemp = 20; // Base temperature in Celsius

  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    const tempVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5

    return {
      date: date.toISOString().split('T')[0],
      temperature: {
        min: baseTemp + tempVariation - 3,
        max: baseTemp + tempVariation + 3,
        current: baseTemp + tempVariation,
      },
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
      windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
      precipitation: Math.random() > 0.7 ? Math.floor(Math.random() * 10) : 0, // 0-10mm
    };
  });
}

/**
 * Check if external service is configured
 */
export function isServiceConfigured(service: 'hotels' | 'flights' | 'weather'): boolean {
  switch (service) {
    case 'hotels':
      return !!(process.env.NEXT_PUBLIC_HOTELBEDS_API_KEY || process.env.GOOGLE_HOTELS_API_KEY);
    case 'flights':
      return !!process.env.NEXT_PUBLIC_DUFFEL_API_KEY;
    case 'weather':
      return !!process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    default:
      return false;
  }
}

/**
 * Get service status for all external services
 */
export function getExternalServicesStatus() {
  return {
    hotels: isServiceConfigured('hotels'),
    flights: isServiceConfigured('flights'),
    weather: isServiceConfigured('weather'),
  };
}