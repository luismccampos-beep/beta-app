/**
 * Wraps an async function, returning the fallback value if the function throws.
 * Use for graceful degradation when optional data fetches fail.
 */
export function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  return Promise.resolve().then(fn).catch(() => fallback);
}
