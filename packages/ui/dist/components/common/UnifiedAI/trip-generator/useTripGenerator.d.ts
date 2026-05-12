import type { GeneratedTrip, TripPreferences } from './tripGeneratorService';
export interface TripGeneratorState {
    trip: GeneratedTrip | null;
    isLoading: boolean;
    error: string | null;
    generateTrip: (preferences: TripPreferences) => Promise<GeneratedTrip | null>;
    clearTrip: () => void;
}
export declare function useTripGenerator(): TripGeneratorState;
