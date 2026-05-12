// utils/performance.ts

/**
 * Debounce function with proper TypeScript typing
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
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
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
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
export function requestAnimationFrameWrapper(callback: FrameRequestCallback): number {
  if (typeof window !== 'undefined' && window.requestAnimationFrame) {
    return window.requestAnimationFrame(callback);
  }
  return setTimeout(callback, 16); // ~60fps fallback
}

/**
 * cancelAnimationFrame wrapper
 */
export function cancelAnimationFrameWrapper(id: number): void {
  if (typeof window !== 'undefined' && window.cancelAnimationFrame) {
    window.cancelAnimationFrame(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Scroll handler wrapper using throttle
 */
export function createOptimizedScrollHandler(handler: (event: Event) => void): () => void {
  const throttledHandler = throttle((event: unknown) => {
    handler(event as Event);
  }, 100);

  window.addEventListener('scroll', throttledHandler as EventListener, { passive: true });

  return () => {
    window.removeEventListener('scroll', throttledHandler as EventListener);
  };
}

/**
 * Resize handler wrapper using debounce
 */
export function createOptimizedResizeHandler(handler: (event: Event) => void): () => void {
  const debouncedHandler = debounce((event: unknown) => {
    handler(event as Event);
  }, 100);

  window.addEventListener('resize', debouncedHandler as EventListener);

  return () => {
    window.removeEventListener('resize', debouncedHandler as EventListener);
  };
}

/**
 * Batch DOM updates in next animation frame
 */
export function batchDOMUpdates(updates: (() => void)[]): void {
  if (updates.length === 0) return;

  requestAnimationFrameWrapper(() => {
    updates.forEach((fn) => fn());
  });
}

/**
 * Preload critical resource
 */
export function preloadResource(url: string, type: 'image' | 'script' | 'style' = 'image'): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = type === 'image' ? 'preload' : 'prefetch';
  link.as = type;
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Lazy load images
 */
export function createLazyImageLoader(): (img: HTMLImageElement) => void {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return (img: HTMLImageElement) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      }
    };
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            obs.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  return (img: HTMLImageElement) => {
    observer.observe(img);
  };
}

/**
 * Optimize animation by applying will-change and cleanup
 */
export function optimizeAnimation(
  element: HTMLElement,
  properties: Record<string, string | number>
): () => void {
  const originalStyles: Record<string, string> = {};
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
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(element: HTMLElement, offset = 0): void {
  const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Debounce with immediate option
 */
export function optimizedDebounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const callNow = immediate && !timeout;

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);

    if (callNow) func(...args);
  };
}

/**
 * Lightweight event manager
 */
export class EventManager {
  private listeners = new Map<string, Set<EventListener>>();

  addEventListener(
    element: EventTarget,
    event: string,
    listener: EventListener,
    options?: AddEventListenerOptions
  ) {
    const key = `${event}_${element.toString()}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }

    this.listeners.get(key)!.add(listener);
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
