"use client";
import { useCallback, useState } from 'react';
import { createTripDraft } from './tripGeneratorService';
export function useTripGenerator() {
    const [trip, setTrip] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const generateTrip = useCallback(async (preferences) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createTripDraft(preferences);
            setTrip(result);
            return result;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao gerar viagem');
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const clearTrip = useCallback(() => {
        setTrip(null);
        setError(null);
    }, []);
    return {
        trip,
        isLoading,
        error,
        generateTrip,
        clearTrip,
    };
}
//# sourceMappingURL=useTripGenerator.js.map