import type { ReactNode } from 'react';
import { type AISuggestionsState } from './useAISuggestions';
import type { AISuggestion } from '../types/ai.types';
import type { SuggestionsOptions } from './suggestionsService';
export interface SuggestionsProviderProps {
    children?: ReactNode | ((state: AISuggestionsState) => ReactNode);
    options?: SuggestionsOptions;
    onSelect?: (suggestion: AISuggestion) => void;
}
export declare function SuggestionsProvider({ children, options, onSelect }: SuggestionsProviderProps): string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
