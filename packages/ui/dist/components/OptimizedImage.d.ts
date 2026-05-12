import React from 'react';
export interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    onLoad?: () => void;
    onError?: () => void;
    sizes?: string;
    fill?: boolean;
    style?: React.CSSProperties;
    loading?: 'lazy' | 'eager';
    fallbackSrc?: string;
    fallbackComponent?: React.ReactNode;
}
/**
 * OptimizedImage component with WebP support and lazy loading
 *
 * Features:
 * - Automatic WebP format conversion
 * - Lazy loading with intersection observer
 * - Progressive loading with blur placeholder
 * - Error handling with fallback
 * - Performance monitoring
 */
declare const OptimizedImage: React.FC<OptimizedImageProps>;
export default OptimizedImage;
