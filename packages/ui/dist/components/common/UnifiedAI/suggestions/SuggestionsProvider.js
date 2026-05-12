import { jsx as _jsx } from "react/jsx-runtime";
import { SuggestionsRenderer } from './SuggestionsRenderer';
import { useAISuggestions } from './useAISuggestions';
export function SuggestionsProvider({ children, options, onSelect }) {
    const { items, isLoading, error, refresh } = useAISuggestions(options);
    if (typeof children === 'function') {
        return children({ items, isLoading, error, refresh });
    }
    if (children !== undefined && children !== null) {
        return children;
    }
    return (_jsx(SuggestionsRenderer, { suggestions: items, isLoading: isLoading, error: error, onSelect: onSelect }));
}
//# sourceMappingURL=SuggestionsProvider.js.map