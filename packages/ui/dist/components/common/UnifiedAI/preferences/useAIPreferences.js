"use client";
import { useCallback, useEffect, useState } from 'react';
import { loadPreferences, resetPreferences, savePreferences } from './preferencesService';
export function useAIPreferences() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const result = await loadPreferences();
        setData(result);
        setIsLoading(false);
    }, []);
    const save = useCallback(async (preferences) => {
        setIsLoading(true);
        setError(null);
        try {
            const saved = await savePreferences(preferences);
            setData(saved);
            return saved;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao guardar preferências');
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const reset = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const resetData = await resetPreferences();
            setData(resetData);
            return resetData;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Falha ao repor preferências');
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        void refresh();
    }, [refresh]);
    return {
        data,
        isLoading,
        error,
        save,
        reset,
        refresh,
    };
}
//# sourceMappingURL=useAIPreferences.js.map