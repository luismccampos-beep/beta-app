import { describe, expect, it } from 'vitest';
import { safeFetch } from '../safe-fetch';

describe('safeFetch', () => {
  it('returns the result when the function succeeds', async () => {
    const result = await safeFetch(() => Promise.resolve(42), 0);
    expect(result).toBe(42);
  });

  it('returns the fallback when the function throws', async () => {
    const result = await safeFetch(() => Promise.reject(new Error('fail')), 'default');
    expect(result).toBe('default');
  });

  it('returns the fallback when the function throws synchronously', async () => {
    const result = await safeFetch(() => {
      throw new Error('sync fail');
    }, null);
    expect(result).toBeNull();
  });

  it('works with complex fallback objects', async () => {
    const fallback = { items: [], total: 0 };
    const result = await safeFetch(() => Promise.reject(new Error('db down')), fallback);
    expect(result).toEqual({ items: [], total: 0 });
    expect(result).toBe(fallback); // same reference
  });

  it('preserves the resolved value type', async () => {
    const data = { name: 'test', count: 5 };
    const result = await safeFetch(() => Promise.resolve(data), { name: '', count: 0 });
    expect(result.name).toBe('test');
    expect(result.count).toBe(5);
  });

  it('handles async functions that take time', async () => {
    const result = await safeFetch(
      () => new Promise<string>((resolve) => setTimeout(() => resolve('done'), 10)),
      'fallback',
    );
    expect(result).toBe('done');
  });
});
