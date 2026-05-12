import React from 'react';
export interface ErrorFallbackProps {
    error?: Error;
    resetError: () => void;
}
interface Props {
    fallback: React.ComponentType<ErrorFallbackProps>;
    showErrorDetails?: boolean;
    children: React.ReactNode;
}
declare const ErrorBoundary: React.FC<Props>;
export { ErrorBoundary };
export default ErrorBoundary;
export type { Props as ErrorBoundaryProps };
