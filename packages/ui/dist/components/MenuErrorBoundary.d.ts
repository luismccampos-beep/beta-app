import { Component, type ErrorInfo, type ReactNode } from 'react';
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
declare class MenuErrorBoundary extends Component<MenuErrorBoundaryProps, State> {
    state: State;
    static getDerivedStateFromError(error: Error): State;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    render(): string | number | bigint | boolean | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export { MenuErrorBoundary };
export default MenuErrorBoundary;
