/**
 * TanStack Start middleware `next()` usually yields a `Response`, but during
 * internal phases (e.g. `loadEntries`) it can return router context objects.
 * This helper returns the wrapped/ bare `Response` when one exists, or
 * `undefined` when `next()` produced a non-Response value.
 *
 * Uses duck-typing instead of `instanceof Response` to avoid cross-realm
 * failures (edge runtime, different global, polyfilled Response).
 */
function isResponseLike(value: unknown): value is Response {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    'headers' in value &&
    typeof (value as { status: unknown }).status === 'number' &&
    typeof (value as { headers: unknown }).headers === 'object' &&
    (value as { headers: unknown }).headers !== null
  )
}

export function unwrapResponse(result: unknown): Response | undefined {
  if (isResponseLike(result)) {
    return result as Response
  }

  if (
    typeof result === 'object' &&
    result !== null &&
    'response' in result &&
    isResponseLike((result as { response: unknown }).response)
  ) {
    return (result as { response: Response }).response
  }

  return undefined
}
