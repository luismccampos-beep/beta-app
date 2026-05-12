import type { TripPreferences } from './tripGeneratorService';
export interface TripFormRendererProps {
    formId?: string;
    onSubmit?: (preferences: TripPreferences) => void;
}
export declare function TripFormRenderer(props: TripFormRendererProps): import("react/jsx-runtime").JSX.Element;
