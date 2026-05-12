import { Component, type ErrorInfo, type ReactNode } from 'react';
type FallbackRender = (args: {
    error: Error;
    errorInfo?: ErrorInfo;
    resetError: () => void;
}) => ReactNode;
export interface EnhancedErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    fallbackRender?: FallbackRender;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    onReset?: () => void;
    resetKeys?: unknown[];
    isolate?: boolean;
    labels?: {
        title?: string;
        subtitle?: string;
        tryAgain?: string;
        showDetails?: string;
        hideDetails?: string;
        message?: string;
        copied?: string;
        copyDetails?: string;
    };
}
interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
    showDetails: boolean;
    shake: boolean;
    resetKey: number;
    copySuccess: boolean;
}
declare class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, State> {
    private shakeTimeoutId;
    private copyTimeoutId;
    state: State;
    static getDerivedStateFromError(error: Error): Partial<State>;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    componentDidUpdate(prevProps: EnhancedErrorBoundaryProps): void;
    componentWillUnmount(): void;
    private clearTimeouts;
    private hasResetKeysChanged;
    resetError: () => void;
    toggleDetails: () => void;
    copyErrorDetails: () => Promise<void>;
    private formatErrorText;
    private getLabels;
    private renderCustomFallback;
    renderFallbackUI(): string | number | bigint | true | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element;
    render(): string | number | bigint | true | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element;
}
export { EnhancedErrorBoundary };
export default EnhancedErrorBoundary;
