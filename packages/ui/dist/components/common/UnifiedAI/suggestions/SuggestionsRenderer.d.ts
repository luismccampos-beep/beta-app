import type { AISuggestion } from '../types/ai.types';
export interface SuggestionsRendererProps {
    suggestions: AISuggestion[];
    isLoading?: boolean;
    error?: string | null;
    onSelect?: ((suggestion: AISuggestion) => void) | undefined;
}
export declare function SuggestionsRenderer(props: SuggestionsRendererProps): import("react/jsx-runtime").JSX.Element;
