import React from 'react';
declare const SIZE_CLASSES: {
    readonly sm: {
        readonly screen: "h-6 w-6";
        readonly spinner: "h-4 w-4";
    };
    readonly md: {
        readonly screen: "h-8 w-8";
        readonly spinner: "h-6 w-6";
    };
    readonly lg: {
        readonly screen: "h-12 w-12";
        readonly spinner: "h-8 w-8";
    };
};
type Size = keyof typeof SIZE_CLASSES;
export interface LoadingScreenProps {
    message?: string;
    className?: string;
    icon?: React.ComponentType<{
        className?: string;
    }>;
    size?: Size;
}
export declare const LoadingScreen: React.FC<LoadingScreenProps>;
/** @alias */
export default LoadingScreen;
export interface LoadingSpinnerProps {
    className?: string;
    size?: Size;
    text?: string;
}
export declare const LoadingSpinner: React.FC<LoadingSpinnerProps>;
