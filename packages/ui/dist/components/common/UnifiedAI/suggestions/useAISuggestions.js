"use client";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchSuggestions } from './suggestionsService';
export function useAISuggestions(options = {}) {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const optionsKey = useMemo(() => JSON.stringify(options), [options]);
    const stableOptions = useMemo(() => options, [optionsKey]);
    const refresh = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchSuggestions(stableOptions);
            setItems(data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load suggestions');
        }
        finally {
            setIsLoading(false);
        }
    }, [stableOptions]);
    useEffect(() => {
        void refresh();
    }, [refresh]);
    return {
        items,
        isLoading,
        error,
        refresh,
    };
}
//# sourceMappingURL=useAISuggestions.js.map