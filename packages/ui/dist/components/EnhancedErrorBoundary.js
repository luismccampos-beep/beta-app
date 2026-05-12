"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Component } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './Button';
const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    },
};
const shakeVariants = {
    shake: {
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.5 }
    }
};
const detailVariants = {
    hidden: {
        opacity: 0,
        height: 0,
        marginTop: 0
    },
    visible: {
        opacity: 1,
        height: 'auto',
        marginTop: 16,
        transition: { duration: 0.3, ease: 'easeOut' }
    },
    exit: {
        opacity: 0,
        height: 0,
        marginTop: 0,
        transition: { duration: 0.2, ease: 'easeIn' }
    },
};
const DEFAULT_LABELS = {
    title: 'Ocorreu um erro',
    subtitle: 'Pedimos desculpa, algo inesperado aconteceu.',
    tryAgain: 'Tentar novamente',
    showDetails: 'Ver detalhes',
    hideDetails: 'Ocultar detalhes',
    message: 'Mensagem:',
    copied: 'Copiado!',
    copyDetails: 'Copiar detalhes',
};
// Extracted component for the error icon with pulse animation
const ErrorIcon = () => (_jsxs("div", { className: "relative", children: [_jsx(XCircle, { className: "h-16 w-16 text-red-600 dark:text-red-500" }), _jsx(motion.div, { className: "absolute inset-0 h-16 w-16 text-red-600 dark:text-red-500", animate: {
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
            }, transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }, children: _jsx(XCircle, { className: "h-16 w-16" }) })] }));
// Extracted component for error header
const ErrorHeader = ({ title, subtitle }) => (_jsxs("div", { className: "flex flex-col items-center space-y-4", children: [_jsx(ErrorIcon, {}), _jsxs("div", { className: "text-center space-y-2", children: [_jsx("h2", { className: "text-2xl font-bold text-red-700 dark:text-red-400", children: title }), _jsx("p", { className: "text-gray-600 dark:text-gray-400 text-sm", children: subtitle })] })] }));
// Extracted component for error name badge
const ErrorNameBadge = ({ errorName }) => {
    if (errorName === 'Error')
        return null;
    return (_jsx("div", { className: "mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg", children: _jsx("p", { className: "text-sm font-mono text-red-800 dark:text-red-300", children: errorName }) }));
};
// Extracted component for action buttons
const ErrorActions = ({ onReset, onToggleDetails, showDetails, labels }) => (_jsxs("div", { className: "mt-6 flex flex-col sm:flex-row gap-3", children: [_jsx(Button, { onClick: onReset, className: "flex-1 bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800", children: labels.tryAgain }), _jsx(Button, { onClick: onToggleDetails, variant: "outline", className: "flex-1 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20", children: showDetails ? (_jsxs(_Fragment, { children: [_jsx(ChevronUp, { className: "h-4 w-4 mr-2" }), labels.hideDetails] })) : (_jsxs(_Fragment, { children: [_jsx(ChevronDown, { className: "h-4 w-4 mr-2" }), labels.showDetails] })) })] }));
// Extracted component for stack trace section
const StackTraceSection = ({ title, content }) => (_jsxs("div", { children: [_jsx("h3", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2", children: title }), _jsx("pre", { className: "text-xs text-gray-800 dark:text-gray-200 font-mono overflow-auto max-h-32 whitespace-pre-wrap break-all bg-white dark:bg-gray-900 p-2 rounded", children: content })] }));
// Extracted component for error details panel
const ErrorDetailsPanel = ({ error, errorInfo, errorMessage, copySuccess, onCopy, labels }) => (_jsx(motion.div, { variants: detailVariants, initial: "hidden", animate: "visible", exit: "exit", className: "overflow-hidden", children: _jsxs("div", { className: "bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2", children: labels.message }), _jsx("p", { className: "text-sm text-gray-800 dark:text-gray-200 font-mono", children: errorMessage })] }), error.stack && (_jsx(StackTraceSection, { title: "Stack Trace:", content: error.stack })), errorInfo?.componentStack && (_jsx(StackTraceSection, { title: "Component Stack:", content: errorInfo.componentStack })), _jsx(Button, { onClick: onCopy, variant: "ghost", size: "sm", className: "w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20", disabled: copySuccess, children: copySuccess ? (_jsxs(_Fragment, { children: [_jsx(motion.span, { initial: { scale: 0 }, animate: { scale: 1 }, className: "mr-2", children: "\u2713" }), labels.copied] })) : (_jsxs(_Fragment, { children: [_jsx(Copy, { className: "h-4 w-4 mr-2" }), labels.copyDetails] })) })] }) }));
class EnhancedErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.shakeTimeoutId = null;
        this.copyTimeoutId = null;
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            showDetails: false,
            shake: false,
            resetKey: 0,
            copySuccess: false,
        };
        this.resetError = () => {
            this.props.onReset?.();
            this.setState({
                hasError: false,
                error: null,
                errorInfo: null,
                showDetails: false,
                shake: false,
                resetKey: this.state.resetKey + 1,
                copySuccess: false,
            });
        };
        this.toggleDetails = () => {
            this.setState((prevState) => ({
                showDetails: !prevState.showDetails
            }));
        };
        this.copyErrorDetails = async () => {
            const { error, errorInfo } = this.state;
            if (!error)
                return;
            const errorText = this.formatErrorText(error, errorInfo);
            try {
                await navigator.clipboard.writeText(errorText);
                this.setState({ copySuccess: true });
                this.copyTimeoutId = window.setTimeout(() => {
                    this.setState({ copySuccess: false });
                }, 2000);
            }
            catch (err) {
                console.error('Failed to copy error details:', err);
            }
        };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            shake: true
        };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error, errorInfo);
        }
        this.shakeTimeoutId = window.setTimeout(() => {
            this.setState({ shake: false });
        }, 500);
    }
    componentDidUpdate(prevProps) {
        if (this.hasResetKeysChanged(prevProps.resetKeys) && this.state.hasError) {
            this.resetError();
        }
    }
    componentWillUnmount() {
        this.clearTimeouts();
    }
    clearTimeouts() {
        if (this.shakeTimeoutId) {
            clearTimeout(this.shakeTimeoutId);
        }
        if (this.copyTimeoutId) {
            clearTimeout(this.copyTimeoutId);
        }
    }
    hasResetKeysChanged(prevResetKeys) {
        const { resetKeys } = this.props;
        if (!resetKeys || !prevResetKeys) {
            return false;
        }
        if (resetKeys.length !== prevResetKeys.length) {
            return true;
        }
        const prevIterator = prevResetKeys[Symbol.iterator]();
        for (const key of resetKeys) {
            const prevKey = prevIterator.next().value;
            if (key !== prevKey) {
                return true;
            }
        }
        return false;
    }
    formatErrorText(error, errorInfo) {
        return [
            '=== Error Details ===',
            '',
            'Message:',
            error.toString(),
            '',
            'Stack:',
            error.stack || 'No stack trace available',
            '',
            'Component Stack:',
            errorInfo?.componentStack || 'No component stack available',
            '',
            'Timestamp:',
            new Date().toISOString(),
        ].join('\n');
    }
    getLabels() {
        return { ...DEFAULT_LABELS, ...this.props.labels };
    }
    renderCustomFallback() {
        const { fallback, fallbackRender } = this.props;
        const { error, errorInfo } = this.state;
        if (fallbackRender && error) {
            return fallbackRender({
                error,
                errorInfo: errorInfo || undefined,
                resetError: this.resetError
            });
        }
        if (fallback) {
            return fallback;
        }
        return null;
    }
    renderFallbackUI() {
        const customFallback = this.renderCustomFallback();
        if (customFallback) {
            return customFallback;
        }
        const { error, errorInfo, showDetails, shake, copySuccess } = this.state;
        const { isolate } = this.props;
        const labels = this.getLabels();
        const errorMessage = error?.message || 'An unexpected error occurred';
        const errorName = error?.name || 'Error';
        return (_jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { className: `fixed inset-0 z-50 flex items-center justify-center p-4 ${isolate ? '' : 'bg-black/30 backdrop-blur-sm'}`, initial: "hidden", animate: "visible", exit: "exit", variants: containerVariants, role: "alert", "aria-live": "assertive", "aria-atomic": "true", children: _jsxs(motion.div, { className: "bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md", variants: shake ? shakeVariants : {}, animate: shake ? 'shake' : '', children: [_jsx(ErrorHeader, { title: labels.title, subtitle: labels.subtitle }), _jsx(ErrorNameBadge, { errorName: errorName }), _jsx(ErrorActions, { onReset: this.resetError, onToggleDetails: this.toggleDetails, showDetails: showDetails, labels: labels }), _jsx(AnimatePresence, { children: showDetails && error && (_jsx(ErrorDetailsPanel, { error: error, errorInfo: errorInfo, errorMessage: errorMessage, copySuccess: copySuccess, onCopy: this.copyErrorDetails, labels: labels })) })] }) }, "error-backdrop") }));
    }
    render() {
        if (this.state.hasError) {
            return this.renderFallbackUI();
        }
        return _jsx("div", { children: this.props.children }, this.state.resetKey);
    }
}
export { EnhancedErrorBoundary };
export default EnhancedErrorBoundary;
//# sourceMappingURL=EnhancedErrorBoundary.js.map