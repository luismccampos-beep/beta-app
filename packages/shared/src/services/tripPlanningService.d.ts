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
export declare class TripPlanningService {
    /**
     * Submit a trip planning request
     * @param formData The form data from the booking form
     * @returns Promise with the API response
     */
    static submitTripPlanningRequest(formData: BookingFormData): Promise<TripPlanningResponse>;
}
export {};
