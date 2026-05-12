"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '../../../ui/button';
import { Input } from '../../../ui/input';
import { SearchResultsRenderer } from './SearchResultsRenderer';
import { useAISearch } from './useAISearch';
export function SearchInterface() {
    const [query, setQuery] = useState('');
    const { results, isLoading, error, search, clear } = useAISearch();
    const handleSubmit = (event) => {
        event.preventDefault();
        void search(query);
    };
    return (_jsxs("div", { className: "space-y-3", children: [_jsxs("form", { onSubmit: handleSubmit, className: "flex flex-wrap gap-2", children: [_jsx(Input, { placeholder: "Pesquisar destinos, tours ou experi\u00EAncias", value: query, onChange: (event) => setQuery(event.target.value) }), _jsx(Button, { type: "submit", loading: isLoading, children: "Buscar" }), _jsx(Button, { type: "button", variant: "ghost", onClick: clear, children: "Limpar" })] }), error && _jsx("div", { className: "text-sm text-destructive", children: error }), _jsx(SearchResultsRenderer, { query: query, results: results })] }));
}
//# sourceMappingURL=SearchInterface.js.map