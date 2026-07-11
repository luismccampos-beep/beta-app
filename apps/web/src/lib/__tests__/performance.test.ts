import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle, getVirtualRange, memoComponent, shallowEqual } from '../performance';
import { type ComponentType } from 'react';

describe('performance utilities', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('debounce', () => {
    it('delays function invocation', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 300);

      debounced('a');
      debounced('b');
      debounced('c');

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(300);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('c');
    });

    it('cancels previous pending invocations', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 200);

      debounced();
      vi.advanceTimersByTime(100);
      debounced();
      vi.advanceTimersByTime(100);
      debounced();
      vi.advanceTimersByTime(200);

      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('resets timer on each call', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 500);

      debounced();
      vi.advanceTimersByTime(400);
      debounced(); // reset
      vi.advanceTimersByTime(400); // not enough after reset
      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100); // completes the 500ms from last call
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('invokes immediately on first call', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 300);

      throttled();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('limits invocations to once per interval', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 200);

      throttled();
      throttled();
      throttled();
      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(200);
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('schedules trailing call if last call was during cooldown', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled(); // immediate call
      expect(fn).toHaveBeenCalledTimes(1);

      throttled(); // during cooldown, schedules trailing
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('getVirtualRange', () => {
    it('calculates visible range at top of list', () => {
      const range = getVirtualRange(0, 600, 100, 50);
      expect(range.startIndex).toBe(0);
      expect(range.endIndex).toBeGreaterThanOrEqual(9); // 6 visible + 3 overscan each side
      expect(range.offsetY).toBe(0);
    });

    it('calculates visible range when scrolled down', () => {
      const range = getVirtualRange(1500, 600, 100, 50);
      expect(range.startIndex).toBe(12); // Math.floor(1500/100) - 3 = 12
      expect(range.offsetY).toBe(1200); // startIndex * itemHeight
    });

    it('clamps startIndex to not exceed total items', () => {
      const range = getVirtualRange(5000, 600, 100, 20);
      expect(range.endIndex).toBe(20);
      expect(range.startIndex).toBe(19); // clamped to totalItems - 1
    });

    it('handles zero items', () => {
      const range = getVirtualRange(0, 600, 100, 0);
      expect(range.startIndex).toBe(0);
      expect(range.endIndex).toBe(0);
    });
  });

  describe('shallowEqual', () => {
    it('returns true for identical objects', () => {
      const obj = { a: 1, b: 'hello', c: true };
      expect(shallowEqual(obj, { a: 1, b: 'hello', c: true })).toBe(true);
    });

    it('returns false for different values', () => {
      expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);
    });

    it('returns false if key count differs', () => {
      expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it('returns true for same reference', () => {
      const obj = { a: 1 };
      expect(shallowEqual(obj, obj)).toBe(true);
    });

    it('returns false for null vs object', () => {
      expect(shallowEqual({} as Record<string, unknown>, null as unknown as Record<string, unknown>)).toBe(false);
    });
  });

  describe('memoComponent', () => {
    it('wraps component with memo and sets displayName', () => {
      const TestComponent: ComponentType<{ name: string }> = () => null;
      const Memoized = memoComponent('TestComponent', TestComponent);
      expect(Memoized.displayName).toBe('TestComponent');
    });
  });
});