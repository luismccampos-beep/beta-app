"use client";

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

export interface MenuErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    labels?: {
        title?: string;
        subtitle?: string;
        refresh?: string;
    };
}

interface State {
    hasError: boolean;
    error?: Error;
}

class MenuErrorBoundary extends Component<MenuErrorBoundaryProps, State> {
    public override state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('MenuErrorBoundary caught an error:', error, errorInfo);
    }

    public override render() {
        const { labels = {} } = this.props;
        const {
            title = 'Something went wrong',
            subtitle = "We couldn't load the menu. Please try refreshing the page.",
            refresh = 'Refresh Page',
        } = labels;

        if (this.state.hasError) {
            return this.props.fallback || (
                <div className='fixed inset-0 flex items-center justify-center bg-background z-50 p-4'>
                    <div className='bg-card p-6 rounded-lg shadow-lg max-w-sm text-center border'>
                        <AlertCircle className='h-12 w-12 text-destructive mx-auto mb-4' />
                        <h2 className='text-lg font-semibold mb-2'>{title}</h2>
                        <p className='text-muted-foreground mb-4'>
                            {subtitle}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors'
                        >
                            {refresh}
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export { MenuErrorBoundary };
export default MenuErrorBoundary;
