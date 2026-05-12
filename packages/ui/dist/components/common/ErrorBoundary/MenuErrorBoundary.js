"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { AlertCircle } from 'lucide-react';
class MenuErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false,
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('MenuErrorBoundary caught an error:', error, errorInfo);
    }
    render() {
        const { labels = {} } = this.props;
        const { title = 'Something went wrong', subtitle = "We couldn't load the menu. Please try refreshing the page.", refresh = 'Refresh Page', } = labels;
        if (this.state.hasError) {
            return this.props.fallback || (_jsx("div", { className: 'fixed inset-0 flex items-center justify-center bg-background z-50 p-4', children: _jsxs("div", { className: 'bg-card p-6 rounded-lg shadow-lg max-w-sm text-center border', children: [_jsx(AlertCircle, { className: 'h-12 w-12 text-destructive mx-auto mb-4' }), _jsx("h2", { className: 'text-lg font-semibold mb-2', children: title }), _jsx("p", { className: 'text-muted-foreground mb-4', children: subtitle }), _jsx("button", { onClick: () => window.location.reload(), className: 'px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors', children: refresh })] }) }));
        }
        return this.props.children;
    }
}
export { MenuErrorBoundary };
export default MenuErrorBoundary;
//# sourceMappingURL=MenuErrorBoundary.js.map