export type TripPreferences = {
    name?: string;
    email?: string;
    budget: number;
    duration: number;
    interests: string[];
    sustainability: number;
    travelers: number;
    destination?: string;
    additionalComments?: string;
};
export type TripDayPlan = {
    day: number;
    title: string;
    activities: string[];
    location: string;
    estimatedCost: number;
};
export type GeneratedTrip = {
    id: string;
    destination: string;
    duration: number;
    totalEstimatedCost: number;
    summary: string;
    days: TripDayPlan[];
    generatedAt: string;
    aiGenerated: boolean;
};
export type TripGeneratorOptions = {
    cacheTtlMs?: number;
    apiEndpoint?: string;
};
export declare function createTripDraft(preferences: TripPreferences, options?: TripGeneratorOptions): Promise<GeneratedTrip>;
