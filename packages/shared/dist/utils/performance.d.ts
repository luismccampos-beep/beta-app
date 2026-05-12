/**
 * Debounce function with proper TypeScript typing
 */
export declare function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function with proper typing
 */
export declare function throttle<T extends (...args: unknown[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * requestAnimationFrame wrapper
 */
export declare function requestAnimationFrameWrapper(callback: FrameRequestCallback): number;
/**
 * cancelAnimationFrame wrapper
 */
export declare function cancelAnimationFrameWrapper(id: number): void;
/**
 * Check if user prefers reduced motion
 */
export declare function prefersReducedMotion(): boolean;
/**
 * Scroll handler wrapper using throttle
 */
export declare function createOptimizedScrollHandler(handler: (event: Event) => void): () => void;
/**
 * Resize handler wrapper using debounce
 */
export declare function createOptimizedResizeHandler(handler: (event: Event) => void): () => void;
/**
 * Batch DOM updates in next animation frame
 */
export declare function batchDOMUpdates(updates: (() => void)[]): void;
/**
 * Preload critical resource
 */
export declare function preloadResource(url: string, type?: 'image' | 'script' | 'style'): void;
/**
 * Lazy load images
 */
export declare function createLazyImageLoader(): (img: HTMLImageElement) => void;
/**
 * Optimize animation by applying will-change and cleanup
 */
export declare function optimizeAnimation(element: HTMLElement, properties: Record<string, string | number>): () => void;
/**
 * Check if element is in viewport
 */
export declare function isInViewport(element: HTMLElement): boolean;
/**
 * Smooth scroll to element
 */
export declare function smoothScrollTo(element: HTMLElement, offset?: number): void;
/**
 * Debounce with immediate option
 */
export declare function optimizedDebounce<T extends (...args: unknown[]) => void>(func: T, wait: number, immediate?: boolean): (...args: Parameters<T>) => void;
/**
 * Lightweight event manager
 */
export declare class EventManager {
    private listeners;
    addEventListener(element: EventTarget, event: string, listener: EventListener, options?: AddEventListenerOptions): void;
    removeAllListeners(): void;
}
