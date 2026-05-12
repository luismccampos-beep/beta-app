"use client";
import { useCallback, useState } from 'react';
import { runAISearch } from './searchService';
export function useAISearch() {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const search = useCallback(async (query) => {
        if (!query.trim()) {
            setResults(null);
            setError(null);
            return null;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await runAISearch(query);
            setResults(data);
            return data;
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Falha na pesquisa');
            return null;
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    const clear = useCallback(() => {
        setResults(null);
        setError(null);
    }, []);
    return {
        results,
        isLoading,
        error,
        search,
        clear,
    };
}
//# sourceMappingURL=useAISearch.js.map