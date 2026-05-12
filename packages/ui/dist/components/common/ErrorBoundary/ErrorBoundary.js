"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { Component } from 'react';
import { Button } from '@akmleva/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { reportError } from '../../../logger';
import { sanitizeText } from '../../../utils/sanitize';
const didResetKeysChange = (prevKeys, nextKeys) => {
    if (!prevKeys || !nextKeys)
        return false;
    if (prevKeys.length !== nextKeys.length)
        return true;
    for (let i = 0; i < prevKeys.length; i++) {
        // eslint-disable-next-line security/detect-object-injection
        const prevKey = prevKeys[i];
        // eslint-disable-next-line security/detect-object-injection
        const nextKey = nextKeys[i];
        if (!Object.is(prevKey, nextKey)) {
            return true;
        }
    }
    return false;
};
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.handleRetry = () => {
            try {
                this.props.onRetry?.();
                this.props.onRecover?.();
                this.setState({
                    hasError: false,
                    retryCount: this.state.retryCount + 1,
                });
            }
            catch (error) {
                const context = { tags: { action: 'retry' } };
                if (this.props.boundaryId) {
                    context.boundaryId = this.props.boundaryId;
                }
                reportError(error, context);
            }
        };
        this.handleReload = () => {
            try {
                if (this.props.onReload) {
                    this.props.onReload();
                    return;
                }
                window.location.reload();
            }
            catch (error) {
                const context = { tags: { action: 'reload' } };
                if (this.props.boundaryId) {
                    context.boundaryId = this.props.boundaryId;
                }
                reportError(error, context);
            }
        };
        this.state = { hasError: false, retryCount: 0 };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        if (this.props.reportToMonitoring !== false) {
            const context = {};
            if (this.props.boundaryId) {
                context.boundaryId = this.props.boundaryId;
            }
            if (errorInfo.componentStack) {
                context.componentStack = errorInfo.componentStack;
            }
            reportError(error, context);
        }
        this.props.onError?.(error, errorInfo);
        this.setState({ errorInfo });
    }
    componentDidUpdate(prevProps) {
        if (this.state.hasError && didResetKeysChange(prevProps.resetKeys, this.props.resetKeys)) {
            this.handleRetry();
        }
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallbackRender) {
                const fallbackContext = {
                    resetError: this.handleRetry,
                    reload: this.handleReload,
                    ...(this.state.error && { error: this.state.error }),
                    ...(this.state.errorInfo && { errorInfo: this.state.errorInfo }),
                };
                return this.props.fallbackRender(fallbackContext);
            }
            if (this.props.fallback) {
                return this.props.fallback;
            }
            const title = sanitizeText(this.props.customMessage || 'Algo correu mal', { maxLength: 120 });
            const message = sanitizeText(this.state.error?.message || 'Ocorreu um erro inesperado. Por favor, tente novamente.', { maxLength: 240 });
            return (_jsx("div", { className: `flex flex-col items-center justify-center min-h-[200px] p-6 text-center ${this.props.className || ''}`, role: "alert", "aria-live": "assertive", children: _jsxs("div", { className: "max-w-md mx-auto", children: [_jsx(AlertTriangle, { className: "h-12 w-12 text-red-500 mx-auto mb-4", "aria-hidden": "true" }), _jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: title }), _jsx("p", { className: "text-gray-600 mb-6", children: message }), process.env.NODE_ENV === 'development' && this.state.errorInfo && (_jsxs("details", { className: "mb-6 text-left", children: [_jsx("summary", { className: "cursor-pointer text-sm text-gray-500 hover:text-gray-700", children: "Detalhes do erro (desenvolvimento)" }), _jsx("pre", { className: "mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-60", children: _jsxs("code", { children: [this.state.error?.stack, '\n\n', this.state.errorInfo.componentStack] }) })] })), _jsxs("div", { className: "flex gap-3 justify-center flex-wrap", children: [this.props.showRetry !== false && (_jsxs(Button, { type: "button", onClick: this.handleRetry, variant: "outline", size: "sm", className: "flex items-center gap-2", "aria-label": "Tentar novamente", children: [_jsx(RefreshCw, { className: "h-4 w-4", "aria-hidden": "true" }), "Tentar Novamente"] })), _jsxs(Button, { type: "button", onClick: this.handleReload, size: "sm", className: "flex items-center gap-2", "aria-label": "Recarregar p\u00E1gina", children: [_jsx(RefreshCw, { className: "h-4 w-4", "aria-hidden": "true" }), "Recarregar P\u00E1gina"] })] })] }) }));
        }
        return this.props.children;
    }
}
export const ErrorBoundaryGroup = ({ boundaries, children, }) => {
    return boundaries.reduceRight((acc, boundary, index) => {
        const key = boundary.boundaryId || `boundary-${index}`;
        return (_jsx(ErrorBoundary, { ...boundary, children: acc }, key));
    }, children);
};
export const withErrorBoundary = (WrappedComponent, boundaryProps) => {
    const WithErrorBoundary = (props) => (_jsx(ErrorBoundary, { ...boundaryProps, children: _jsx(WrappedComponent, { ...props }) }));
    WithErrorBoundary.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    return WithErrorBoundary;
};
/** @alias */
export default ErrorBoundary;
//# sourceMappingURL=ErrorBoundary.js.map