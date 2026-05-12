import apiClient from '../lib/api-client';
/**
 * Service class for handling destination-related API calls
 */
export class DestinationService {
    /**
     * Get all available destinations with optional filtering
     */
    static async getDestinations(filters) {
        const params = { ...filters };
        const resp = await apiClient.get('/destinations', {
            params
        });
        return resp?.destinations || [];
    }
    /**
     * Get a single destination by ID
     */
    static async getDestinationById(id) {
        try {
            const resp = await apiClient.get(`/destinations/${id}`);
            return resp?.destination || null;
        }
        catch (error) {
            console.error(`Error fetching destination ${id}:`, error);
            return null;
        }
    }
    /**
     * Get destinations by continent
     */
    static async getDestinationsByContinent(continent) {
        const resp = await apiClient.get('/destinations', {
            params: { continent }
        });
        return resp?.destinations || [];
    }
    /**
     * Get featured destinations
     */
    static async getFeaturedDestinations(limit = 6) {
        const resp = await apiClient.get('/destinations', {
            params: { limit, featured: true }
        });
        return resp?.destinations || [];
    }
    /**
     * Search destinations by query string
     */
    static async searchDestinations(query) {
        const resp = await apiClient.get('/destinations', {
            params: { q: query }
        });
        return resp?.destinations || [];
    }
}
//# sourceMappingURL=destinationService.js.map