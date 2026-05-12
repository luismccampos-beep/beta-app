const defaultClientConfig = {
    baseUrl: '/api',
    timeoutMs: 15000,
    retryAttempts: 2,
    retryDelayMs: 600,
    headers: {},
};
let clientConfig = { ...defaultClientConfig };
export function configureAIClient(config) {
    clientConfig = {
        ...clientConfig,
        ...config,
        headers: {
            ...clientConfig.headers,
            ...(config.headers ?? {}),
        },
    };
}
const isAbsoluteUrl = (path) => /^https?:\/\//i.test(path);
const buildUrl = (path, baseUrl) => {
    if (isAbsoluteUrl(path))
        return path;
    if (!path.startsWith('/'))
        return `${baseUrl.replace(/\/$/, '')}/${path}`;
    return `${baseUrl.replace(/\/$/, '')}${path}`;
};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const mergeSignals = (signal, timeoutMs) => {
    if (!timeoutMs && !signal) {
        const controller = new AbortController();
        return { signal: controller.signal, cleanup: () => { } };
    }
    const controller = new AbortController();
    const abort = () => controller.abort();
    let timeoutId;
    if (timeoutMs) {
        timeoutId = setTimeout(abort, timeoutMs);
    }
    if (signal) {
        if (signal.aborted) {
            abort();
        }
        else {
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
const shouldRetry = (status) => {
    if (status === null)
        return true;
    return status === 429 || status >= 500;
};
const prepareBody = (body) => {
    if (body === undefined) {
        return { body: undefined, isJson: false };
    }
    if (body === null) {
        return { body: null, isJson: false };
    }
    if (typeof body === 'string' || body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob || body instanceof ArrayBuffer) {
        return { body: body, isJson: false };
    }
    if (typeof body === 'object') {
        return { body: JSON.stringify(body), isJson: true };
    }
    return { body: undefined, isJson: false };
};
const parseResponse = async (response, parseAs) => {
    if (response.status === 204) {
        return undefined;
    }
    if (parseAs === 'text') {
        return (await response.text());
    }
    return (await response.json());
};
export async function aiRequest(path, options = {}) {
    const { baseUrl, timeoutMs, retryAttempts, retryDelayMs, parseAs, body: requestBody, signal, ...requestInit } = options;
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
    let lastError;
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
            return await parseResponse(response, resolvedParseAs);
        }
        catch (error) {
            lastError = error;
            if (attempt < resolvedRetryAttempts && shouldRetry(null)) {
                await sleep(resolvedRetryDelayMs * (attempt + 1));
                continue;
            }
            throw error;
        }
        finally {
            cleanup();
        }
    }
    throw lastError ?? new Error('AI request failed');
}
//# sourceMappingURL=aiApiClient.js.map