import React, { Component, type ReactNode } from 'react';
export interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    fallbackRender?: (context: {
        error?: Error;
        errorInfo?: React.ErrorInfo;
        resetError: () => void;
        reload: () => void;
    }) => ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    onRecover?: () => void;
    onRetry?: () => void;
    onReload?: () => void;
    resetKeys?: Array<unknown>;
    boundaryId?: string;
    reportToMonitoring?: boolean;
    showRetry?: boolean;
    customMessage?: string;
    className?: string;
}
interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
    retryCount: number;
}
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState>;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    handleRetry: () => void;
    handleReload: () => void;
    componentDidUpdate(prevProps: ErrorBoundaryProps): void;
    render(): ReactNode;
}
export declare const ErrorBoundaryGroup: ({ boundaries, children, }: {
    boundaries: Array<Omit<ErrorBoundaryProps, "children"> & {
        boundaryId?: string;
    }>;
    children: ReactNode;
}) => ReactNode;
export declare const withErrorBoundary: <Props extends object>(WrappedComponent: React.ComponentType<Props>, boundaryProps?: Omit<ErrorBoundaryProps, "children">) => React.ComponentType<Props>;
/** @alias */
export default ErrorBoundary;
