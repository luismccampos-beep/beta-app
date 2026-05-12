import type { TravelPackage, ExtendedTravelPackage, PackageFilters } from '../types/package';
declare class PackageService {
    getAllPackages(filters?: PackageFilters): Promise<TravelPackage[]>;
    getPackageById(id: string): Promise<TravelPackage | null>;
    getPackageBySlug(slug: string): Promise<ExtendedTravelPackage | null>;
    searchPackages(query: string): Promise<TravelPackage[]>;
    filterPackages(filters: PackageFilters): Promise<TravelPackage[]>;
    getPackagesByCategory(category: string): Promise<TravelPackage[]>;
    getFeaturedPackages(limit?: number): Promise<TravelPackage[]>;
    getCategoryStats(): Promise<Record<string, number>>;
    private buildFilterParams;
    private fetchPackageWithDetails;
    private findPackageById;
    private findPackageBySlug;
}
export declare const getCategoryLabel: (category: string) => string;
export declare const getCategoryColor: (category: string) => string;
export declare const getDifficultyColor: (difficulty?: string) => string;
declare const packageService: PackageService;
export default packageService;
