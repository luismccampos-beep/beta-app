export interface FullPageLoadingProps {
    message?: string;
    className?: string;
    /** If true, renders with a backdrop overlay. If false, replaces content. */
    isOverlay?: boolean;
}
declare function FullPageLoading({ message, className, isOverlay }: FullPageLoadingProps): import("react/jsx-runtime").JSX.Element;
export default FullPageLoading;
