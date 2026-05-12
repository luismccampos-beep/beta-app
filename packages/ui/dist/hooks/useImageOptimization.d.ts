interface UseImageOptimizationOptions {
    threshold?: number;
    rootMargin?: string;
    placeholder?: string;
    retryAttempts?: number;
    retryDelay?: number;
}
interface UseImageOptimizationReturn {
    isLoaded: boolean;
    isInView: boolean;
    hasError: boolean;
    isLoading: boolean;
    retryCount: number;
    imageRef: React.RefObject<HTMLDivElement | null>;
    optimizedSrc: string;
    handleLoad: () => void;
    handleError: () => void;
    retry: () => void;
    generateWebPUrl: (src: string) => string;
    generatePlaceholder: (width?: number, height?: number) => string;
}
/**
 * Hook for optimizing images with WebP conversion and lazy loading
 */
export declare const useImageOptimization: (options?: UseImageOptimizationOptions) => UseImageOptimizationReturn;
interface UseImagePreloaderReturn {
    loadedImages: Set<string>;
    failedImages: Set<string>;
    isLoaded: (url: string) => boolean;
    hasFailed: (url: string) => boolean;
    allLoaded: boolean;
    loadingProgress: number;
}
/**
 * Hook for preloading critical images
 */
export declare const useImagePreloader: (urls: string[]) => UseImagePreloaderReturn;
interface UseResponsiveImagesReturn {
    generateSrcSet: (baseUrl: string, sizes: number[]) => string;
    generateWebPSrcSet: (baseUrl: string, sizes: number[]) => string;
    generateAVIFSrcSet: (baseUrl: string, sizes: number[]) => string;
    generateSizes: (breakpoints: Array<{
        minWidth: string;
        size: string;
    }>, defaultSize: string) => string;
}
/**
 * Hook for responsive image sources
 */
export declare const useResponsiveImages: () => UseResponsiveImagesReturn;
interface ImageMetrics {
    loadTime: number;
    fileSize: number;
    dimensions: {
        width: number;
        height: number;
    };
    compressionRatio?: number;
    format?: string;
}
interface UseImagePerformanceReturn {
    metrics: ImageMetrics | null;
    measureImage: (imgElement: HTMLImageElement) => void;
    averageLoadTime: number;
    totalMeasurements: number;
}
/**
 * Hook for image performance monitoring
 */
export declare const useImagePerformance: () => UseImagePerformanceReturn;
export default useImageOptimization;
