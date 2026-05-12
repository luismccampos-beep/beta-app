export interface SustainableDestination {
    id: string;
    name: string;
    country: string;
    image: string;
    description: string;
    ecoRating: number;
    co2Reduction: string;
    highlights: string[];
}
export interface FootprintSegmentInput {
    mode: string;
    origin: {
        lat?: number;
        lon?: number;
        code?: string;
    };
    destination: {
        lat?: number;
        lon?: number;
        code?: string;
    };
    passengers?: number;
    class?: string;
    subcategory?: string;
    country?: string;
    distanceKm?: number;
}
export interface FootprintSegmentResult {
    mode: string;
    distanceKm: number;
    passengers: number;
    class: string;
    co2Kg: number;
}
export interface FootprintResponse {
    totalCo2Kg: number;
    segments: FootprintSegmentResult[];
}
/**
 * Supported transport modes for CO2 calculation
 */
type TransportMode = 'flight' | 'train' | 'ferry' | 'bus';
export declare const sustainableService: {
    /**
     * Fetch all sustainable destinations
     */
    getDestinations(): Promise<SustainableDestination[]>;
    /**
     * Fetch a single destination by ID
     */
    getDestinationById(id: string): Promise<SustainableDestination | undefined>;
    /**
     * Compute carbon footprint via API with local fallback
     * If API fails, uses client-side calculation
     */
    computeFootprint(segments: FootprintSegmentInput[]): Promise<FootprintResponse>;
    /**
     * Compute carbon footprint locally (instant, no API call)
     * Useful for real-time estimates or offline mode
     */
    computeFootprintLocally(segments: FootprintSegmentInput[]): FootprintResponse;
    /**
     * Get all available transport modes and their CO2 factors
     * Useful for displaying emission comparisons in UI
     */
    getTransportModes(): Array<{
        mode: TransportMode;
        co2PerKm: number;
    }>;
};
export {};
