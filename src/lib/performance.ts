/**
 * Performance optimization utilities.
 * Provides helpers for React.memo, debouncing, and virtualization.
 */

import { memo, type ComponentType } from 'react';

// ─── React.memo helper ─────────────────────────────────────────────────────

/**
 * Wraps a component with React.memo and sets a display name.
 * Use for pure functional components that don't need to re-render
 * if their props haven't changed.
 *
 * @example
 * const MyCard = memoComponent('MyCard', ({ title }: { title: string }) => (
 *   <div>{title}</div>
 * ));
 */
export function memoComponent<P extends object>(
  name: string,
  component: ComponentType<P>,
  propsAreEqual?: (prev: P, next: P) => boolean,
): ComponentType<P> {
  const Memoized = memo(component, propsAreEqual);
  Memoized.displayName = name;
  return Memoized;
}

// ─── Debounce ──────────────────────────────────────────────────────────────

/**
 * Creates a debounced version of a function.
 * The debounced function delays invoking `fn` until after `delayMs` milliseconds
 * have elapsed since the last time the debounced function was invoked.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delayMs);
  };
}

// ─── Throttle ──────────────────────────────────────────────────────────────

/**
 * Creates a throttled version of a function.
 * The throttled function invokes `fn` at most once every `intervalMs` milliseconds.
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  intervalMs: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = intervalMs - (now - lastCall);

    if (remaining <= 0) {
      lastCall = now;
      fn(...args);
    } else if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        fn(...args);
        timeoutId = null;
      }, remaining);
    }
  };
}

// ─── Virtualization helpers ────────────────────────────────────────────────

/**
 * Calculates which items should be visible in a virtualized list.
 * Useful for implementing windowing without a library dependency.
 *
 * @param scrollTop - Current scroll position
 * @param containerHeight - Height of the visible container
 * @param itemHeight - Height of each item (can be average if variable)
 * @param totalItems - Total number of items
 * @param overscan - Number of extra items to render above/below viewport
 * @returns Object with startIndex, endIndex, and offsetY for positioning
 */
export function getVirtualRange(
  scrollTop: number,
  containerHeight: number,
  itemHeight: number,
  totalItems: number,
  overscan = 3,
): { startIndex: number; endIndex: number; offsetY: number } {
  if (totalItems === 0) {
    return { startIndex: 0, endIndex: 0, offsetY: 0 };
  }

  const rawStartIndex = Math.floor(scrollTop / itemHeight) - overscan;
  const startIndex = Math.max(0, Math.min(rawStartIndex, totalItems - 1));
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
  const endIndex = Math.min(totalItems, startIndex + visibleCount);
  const offsetY = startIndex * itemHeight;

  return { startIndex, endIndex, offsetY };
}

// ─── Shallow comparison for memo ───────────────────────────────────────────

/**
 * Performs a shallow comparison of two objects.
 * Useful as the `propsAreEqual` argument for React.memo.
 */
export function shallowEqual(objA: Record<string, unknown>, objB: Record<string, unknown>): boolean {
  if (Object.is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) return false;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    if (!Object.is(objA[key], objB[key])) return false;
  }

  return true;
}