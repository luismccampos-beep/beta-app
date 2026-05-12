import apiClient from '../lib/api-client';
export class TripPlanningService {
    /**
     * Submit a trip planning request
     * @param formData The form data from the booking form
     * @returns Promise with the API response
     */
    static async submitTripPlanningRequest(formData) {
        try {
            const response = await apiClient.post('/trip-planning', {
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
            });
            return response;
        }
        catch (error) {
            console.error('Error submitting trip planning request:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=tripPlanningService.js.map