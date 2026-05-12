import type { ReactNode } from "react";
type ViewMode = "grid" | "list";
export interface SharedFilterBarSortOption {
    value: string;
    label: string;
}
export interface SharedFilterBarProps {
    query: string;
    onQueryChange: (query: string) => void;
    searchPlaceholder?: string;
    sortBy?: string;
    sortOptions?: SharedFilterBarSortOption[];
    onSortChange?: (value: string) => void;
    viewMode?: ViewMode;
    onViewModeChange?: (mode: ViewMode) => void;
    filtersLabel?: string;
    onToggleFilters?: () => void;
    activeFiltersCount?: number;
    rightSlot?: ReactNode;
}
export declare function SharedFilterBar({ query, onQueryChange, searchPlaceholder, sortBy, sortOptions, onSortChange, viewMode, onViewModeChange, filtersLabel, onToggleFilters, activeFiltersCount, rightSlot, }: SharedFilterBarProps): import("react/jsx-runtime").JSX.Element;
export {};
