import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
const ErrorBoundary = ({ fallback: Fallback, showErrorDetails = false, children }) => {
    return (_jsx(ReactErrorBoundary, { fallbackRender: ({ error, resetErrorBoundary }) => (_jsx(Fallback, { error: showErrorDetails ? error : undefined, resetError: resetErrorBoundary })), children: children }));
};
export { ErrorBoundary };
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map