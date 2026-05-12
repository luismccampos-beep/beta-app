export interface SearchResultsRendererProps {
    query?: string;
    results?: {
        suggestions: Array<{
            id: string;
            title: string;
            description?: string;
            category?: string;
            country?: string;
            tags?: string[];
            popularity?: number;
            imageUrl?: string;
        }>;
        popularDestinations?: unknown[];
        total: number;
        hasMore: boolean;
    } | null;
}
export declare function SearchResultsRenderer(props: SearchResultsRendererProps): import("react/jsx-runtime").JSX.Element;
