import apiClient from '../lib/api-client';
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
export class DestinationService {
  /**
   * Get all available destinations with optional filtering
   */
  static async getDestinations(filters?: DestinationFilters): Promise<DestinationDetail[]> {
    const params: Record<string, string | number | undefined> = { ...filters };
    const resp = await apiClient.get<{ destinations: DestinationDetail[] }>('/destinations', {
      params
    });
    return resp?.destinations || [];
  }

  /**
   * Get a single destination by ID
   */
  static async getDestinationById(id: string): Promise<DestinationDetail | null> {
    try {
      const resp = await apiClient.get<{ destination: DestinationDetail }>(`/destinations/${id}`);
      return resp?.destination || null;
    } catch (error) {
      console.error(`Error fetching destination ${id}:`, error);
      return null;
    }
  }

  /**
   * Get destinations by continent
   */
  static async getDestinationsByContinent(continent: string): Promise<DestinationDetail[]> {
    const resp = await apiClient.get<{ destinations: DestinationDetail[] }>('/destinations', {
      params: { continent }
    });
    return resp?.destinations || [];
  }

  /**
   * Get featured destinations
   */
  static async getFeaturedDestinations(limit: number = 6): Promise<DestinationDetail[]> {
    const resp = await apiClient.get<{ destinations: DestinationDetail[] }>('/destinations', {
      params: { limit, featured: true }
    });
    return resp?.destinations || [];
  }

  /**
   * Search destinations by query string
   */
  static async searchDestinations(query: string): Promise<DestinationDetail[]> {
    const resp = await apiClient.get<{ destinations: DestinationDetail[] }>('/destinations', {
      params: { q: query }
    });
    return resp?.destinations || [];
  }
}