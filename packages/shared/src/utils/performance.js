// utils/performance.ts
/**
 * Debounce function with proper TypeScript typing
 */
export function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            func(...args);
        }, wait);
    };
}
/**
 * Throttle function with proper typing
 */
export function throttle(func, limit) {
    let inThrottle = false;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}
/**
 * requestAnimationFrame wrapper
 */
export function requestAnimationFrameWrapper(callback) {
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
        return window.requestAnimationFrame(callback);
    }
    return setTimeout(callback, 16); // ~60fps fallback
}
/**
 * cancelAnimationFrame wrapper
 */
export function cancelAnimationFrameWrapper(id) {
    if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
        window.cancelAnimationFrame(id);
    }
    else {
        clearTimeout(id);
    }
}
/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
    return (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
/**
 * Scroll handler wrapper using throttle
 */
export function createOptimizedScrollHandler(handler) {
    const throttledHandler = throttle((event) => {
        handler(event);
    }, 100);
    window.addEventListener('scroll', throttledHandler, { passive: true });
    return () => {
        window.removeEventListener('scroll', throttledHandler);
    };
}
/**
 * Resize handler wrapper using debounce
 */
export function createOptimizedResizeHandler(handler) {
    const debouncedHandler = debounce((event) => {
        handler(event);
    }, 100);
    window.addEventListener('resize', debouncedHandler);
    return () => {
        window.removeEventListener('resize', debouncedHandler);
    };
}
/**
 * Batch DOM updates in next animation frame
 */
export function batchDOMUpdates(updates) {
    if (updates.length === 0)
        return;
    requestAnimationFrameWrapper(() => {
        updates.forEach((fn) => fn());
    });
}
/**
 * Preload critical resource
 */
export function preloadResource(url, type = 'image') {
    if (typeof document === 'undefined')
        return;
    const link = document.createElement('link');
    link.rel = type === 'image' ? 'preload' : 'prefetch';
    link.as = type;
    link.href = url;
    document.head.appendChild(link);
}
/**
 * Lazy load images
 */
export function createLazyImageLoader() {
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
        return (img) => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        };
    }
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    obs.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.01,
    });
    return (img) => {
        observer.observe(img);
    };
}
/**
 * Optimize animation by applying will-change and cleanup
 */
export function optimizeAnimation(element, properties) {
    const originalStyles = {};
    const keys = Object.keys(properties);
    element.style.willChange = keys.join(',');
    keys.forEach((prop) => {
        const cssProp = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
        // eslint-disable-next-line security/detect-object-injection
        originalStyles[cssProp] = element.style.getPropertyValue(cssProp);
        // eslint-disable-next-line security/detect-object-injection
        element.style.setProperty(cssProp, String(properties[prop]));
    });
    const cleanup = () => {
        element.style.willChange = 'auto';
        keys.forEach((prop) => {
            const cssProp = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
            element.style.removeProperty(cssProp);
        });
    };
    element.addEventListener('animationend', cleanup, { once: true });
    element.addEventListener('transitionend', cleanup, { once: true });
    return cleanup;
}
/**
 * Check if element is in viewport
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth));
}
/**
 * Smooth scroll to element
 */
export function smoothScrollTo(element, offset = 0) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
}
/**
 * Debounce with immediate option
 */
export function optimizedDebounce(func, wait, immediate = false) {
    let timeout = null;
    return (...args) => {
        const callNow = immediate && !timeout;
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            timeout = null;
            if (!immediate)
                func(...args);
        }, wait);
        if (callNow)
            func(...args);
    };
}
/**
 * Lightweight event manager
 */
export class EventManager {
    constructor() {
        this.listeners = new Map();
    }
    addEventListener(element, event, listener, options) {
        const key = `${event}_${element.toString()}`;
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(listener);
        element.addEventListener(event, listener, options);
    }
    removeAllListeners() {
        this.listeners.forEach((listeners) => {
            listeners.forEach((listener) => {
                // In a full system you'd track the element too to remove listeners
                listeners.delete(listener);
            });
        });
        this.listeners.clear();
    }
}
//# sourceMappingURL=performance.js.map