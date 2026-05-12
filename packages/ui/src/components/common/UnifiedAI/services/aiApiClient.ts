type AIRequestConfig = Omit<RequestInit, 'body'> & {
  baseUrl?: string;
  timeoutMs?: number;
  retryAttempts?: number;
  retryDelayMs?: number;
  parseAs?: 'json' | 'text';
  body?: BodyInit | Record<string, unknown> | null | object;
};

type AIClientConfig = {
  baseUrl: string;
  timeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
  headers: Record<string, string>;
};

const defaultClientConfig: AIClientConfig = {
  baseUrl: '/api',
  timeoutMs: 15000,
  retryAttempts: 2,
  retryDelayMs: 600,
  headers: {},
};

let clientConfig = { ...defaultClientConfig };

export function configureAIClient(config: Partial<AIClientConfig>): void {
  clientConfig = {
    ...clientConfig,
    ...config,
    headers: {
      ...clientConfig.headers,
      ...(config.headers ?? {}),
    },
  };
}

const isAbsoluteUrl = (path: string): boolean => /^https?:\/\//i.test(path);

const buildUrl = (path: string, baseUrl: string): string => {
  if (isAbsoluteUrl(path)) return path;
  if (!path.startsWith('/')) return `${baseUrl.replace(/\/$/, '')}/${path}`;
  return `${baseUrl.replace(/\/$/, '')}${path}`;
};

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const mergeSignals = (signal?: AbortSignal | null, timeoutMs?: number): { signal: AbortSignal; cleanup: () => void } => {
  if (!timeoutMs && !signal) {
    const controller = new AbortController();
    return { signal: controller.signal, cleanup: () => {} };
  }

  const controller = new AbortController();
  const abort = () => controller.abort();
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  if (timeoutMs) {
    timeoutId = setTimeout(abort, timeoutMs);
  }

  if (signal) {
    if (signal.aborted) {
      abort();
    } else {
      signal.addEventListener('abort', abort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (signal) {
        signal.removeEventListener('abort', abort);
      }
    },
  };
};

const shouldRetry = (status: number | null): boolean => {
  if (status === null) return true;
  return status === 429 || status >= 500;
};

const prepareBody = (body: unknown): { body?: BodyInit | null | undefined; isJson: boolean } => {
  if (body === undefined) {
    return { body: undefined, isJson: false };
  }

  if (body === null) {
    return { body: null, isJson: false };
  }

  if (typeof body === 'string' || body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob || body instanceof ArrayBuffer) {
    return { body: body as BodyInit, isJson: false };
  }

  if (typeof body === 'object') {
    return { body: JSON.stringify(body), isJson: true };
  }

  return { body: undefined, isJson: false };
};

const parseResponse = async <T>(response: Response, parseAs: 'json' | 'text'): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  if (parseAs === 'text') {
    return (await response.text()) as T;
  }

  return (await response.json()) as T;
};

export async function aiRequest<T>(path: string, options: AIRequestConfig = {}): Promise<T> {
  const {
    baseUrl,
    timeoutMs,
    retryAttempts,
    retryDelayMs,
    parseAs,
    body: requestBody,
    signal,
    ...requestInit
  } = options;

  const resolvedBaseUrl = baseUrl ?? clientConfig.baseUrl;
  const resolvedTimeoutMs = timeoutMs ?? clientConfig.timeoutMs;
  const resolvedRetryAttempts = retryAttempts ?? clientConfig.retryAttempts;
  const resolvedRetryDelayMs = retryDelayMs ?? clientConfig.retryDelayMs;
  const resolvedParseAs = parseAs ?? 'json';

  const url = buildUrl(path, resolvedBaseUrl);
  const { body, isJson } = prepareBody(requestBody);

  const headers = {
    Accept: 'application/json',
    ...clientConfig.headers,
    ...(options.headers ?? {}),
    ...(isJson ? { 'Content-Type': 'application/json' } : {}),
  };

  let lastError: unknown;

  for (let attempt = 0; attempt <= resolvedRetryAttempts; attempt += 1) {
    const { signal: mergedSignal, cleanup } = mergeSignals(signal, resolvedTimeoutMs);
    try {
      const response = await fetch(url, {
        ...requestInit,
        headers,
        ...(body !== undefined ? { body } : {}),
        signal: mergedSignal,
      });

      if (!response.ok) {
        const status = response.status;
        const errorBody = await response.text().catch(() => '');
        if (shouldRetry(status) && attempt < resolvedRetryAttempts) {
          await sleep(resolvedRetryDelayMs * (attempt + 1));
          continue;
        }

        const message = errorBody || response.statusText || 'Request failed';
        throw new Error(`${status} ${message}`);
      }

      return await parseResponse<T>(response, resolvedParseAs);
    } catch (error) {
      lastError = error;
      if (attempt < resolvedRetryAttempts && shouldRetry(null)) {
        await sleep(resolvedRetryDelayMs * (attempt + 1));
        continue;
      }
      throw error;
    } finally {
      cleanup();
    }
  }

  throw lastError ?? new Error('AI request failed');
}
