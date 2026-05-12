import type { DestinationDetail } from '../types/trip';
/**
 * Search parameters for destination queries
 */
export interface DestinationFilters {
    continent?: string;
    country?: string;
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    duration?: string;
}
/**
 * Service class for handling destination-related API calls
 */
export declare class DestinationService {
    /**
     * Get all available destinations with optional filtering
     */
    static getDestinations(filters?: DestinationFilters): Promise<DestinationDetail[]>;
    /**
     * Get a single destination by ID
     */
    static getDestinationById(id: string): Promise<DestinationDetail | null>;
    /**
     * Get destinations by continent
     */
    static getDestinationsByContinent(continent: string): Promise<DestinationDetail[]>;
    /**
     * Get featured destinations
     */
    static getFeaturedDestinations(limit?: number): Promise<DestinationDetail[]>;
    /**
     * Search destinations by query string
     */
    static searchDestinations(query: string): Promise<DestinationDetail[]>;
}
