import apiClient from '../lib/api-client';
// TODO: Move smart-form types to shared or fix path
// Note: BookingForm types moved to @akmleva/ui package
// import type { BookingFormData } from '@akmleva/ui'; // Temporarily commented to break circular dependency

// Temporary type definition to avoid circular dependency
interface BookingFormData {
  destination: string;
  dateRange: {
    from: string;
    to: string;
  };
  travelers: string;
  name: string;
  email: string;
  phone: string;
  travelType: string;
  budget: string;
  message?: string;
}

export interface TripPlanningResponse {
  success: boolean;
  message: string;
  requestId?: string;
  estimatedResponseTime?: string;
}

export class TripPlanningService {
  /**
   * Submit a trip planning request
   * @param formData The form data from the booking form
   * @returns Promise with the API response
   */
  static async submitTripPlanningRequest(formData: BookingFormData): Promise<TripPlanningResponse> {
    try {
      const response = await apiClient.post<TripPlanningResponse>(
        '/trip-planning',
        {
          destination: formData.destination,
          dateRange: {
            from: formData.dateRange.from,
            to: formData.dateRange.to,
          },
          travelers: formData.travelers,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          travelType: formData.travelType,
          budget: formData.budget,
          message: formData.message,
        }
      );

      return response;
    } catch (error) {
      console.error('Error submitting trip planning request:', error);
      throw error;
    }
  }
}