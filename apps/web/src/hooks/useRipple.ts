'use client';

import { useCallback } from 'react';

/**
 * Returns an onClick handler that creates a ripple effect on the clicked element.
 * The target element must have the `ripple` utility class (position: relative; overflow: hidden).
 *
 * @example
 * const ripple = useRipple();
 * <button className="ripple" onClick={ripple}>Click me</button>
 */
export function useRipple(): (e: React.MouseEvent<HTMLElement>) => void {
  return useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  }, []);
}
