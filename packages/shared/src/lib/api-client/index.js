export class ApiClientError extends Error {
    constructor(message, opts) {
        super(message);
        this.name = "ApiClientError";
        if (opts?.statusCode !== undefined) {
            this.statusCode = opts.statusCode;
        }
        if (opts?.response !== undefined) {
            this.response = opts.response;
        }
        if (opts?.body !== undefined) {
            this.body = opts.body;
        }
        this.isUnauthorized = opts?.statusCode === 401;
    }
}
function resolveBaseURL(explicit) {
    if (explicit && explicit.trim())
        return explicit;
    if (typeof window !== "undefined") {
        const w = window;
        if (typeof w.__API_URL__ === "string" && w.__API_URL__.trim())
            return w.__API_URL__;
    }
    const viteUrl = globalThis?.import?.meta?.env?.VITE_API_URL;
    if (typeof viteUrl === "string" && viteUrl.trim())
        return viteUrl;
    return "/api";
}
function buildQuery(params) {
    if (!params)
        return "";
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value == null)
            continue;
        if (Array.isArray(value)) {
            for (const v of value)
                qs.append(key, String(v));
        }
        else {
            qs.set(key, String(value));
        }
    }
    const s = qs.toString();
    return s ? `?${s}` : "";
}
async function safeReadBody(response) {
    if (response.status === 204)
        return null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        try {
            return await response.json();
        }
        catch {
            return null;
        }
    }
    try {
        const text = await response.text();
        return text || null;
    }
    catch {
        return null;
    }
}
function mergeSignals(a, b) {
    if (!a)
        return b;
    if (!b)
        return a;
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    if (a.aborted || b.aborted)
        controller.abort();
    else {
        a.addEventListener("abort", onAbort, { once: true });
        b.addEventListener("abort", onAbort, { once: true });
    }
    return controller.signal;
}
class ApiClient {
    constructor(baseURL = "") {
        this.baseURL = resolveBaseURL(baseURL);
        this.defaultHeaders = {
            "Content-Type": "application/json",
        };
    }
    setBaseURL(baseURL) {
        this.baseURL = baseURL;
    }
    async request(endpoint, config = {}) {
        const { params, timeoutMs = 30000, headers, signal, ...fetchConfig } = config;
        const url = `${this.baseURL}${endpoint}${buildQuery(params)}`;
        const timeoutController = new AbortController();
        const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
        const mergedSignal = mergeSignals(signal || undefined, timeoutController.signal);
        try {
            const response = await fetch(url, {
                ...fetchConfig,
                headers: {
                    ...this.defaultHeaders,
                    ...headers,
                },
                signal: mergedSignal ?? null,
            });
            const body = await safeReadBody(response);
            if (!response.ok) {
                const message = (typeof body === "object" && body && body.message) ||
                    (typeof body === "object" && body && body.error) ||
                    `HTTP error! status: ${response.status}`;
                throw new ApiClientError(String(message), {
                    statusCode: response.status,
                    response,
                    body,
                });
            }
            return body;
        }
        catch (error) {
            if (error instanceof ApiClientError)
                throw error;
            if (error instanceof Error) {
                if (error.name === "AbortError") {
                    throw new ApiClientError("Request timeout", { statusCode: 408 });
                }
                throw new ApiClientError(error.message);
            }
            throw new ApiClientError("Unknown error occurred");
        }
        finally {
            clearTimeout(timeoutId);
        }
    }
    get(endpoint, config) {
        return this.request(endpoint, { ...config, method: "GET" });
    }
    post(endpoint, data, config) {
        return this.request(endpoint, {
            ...config,
            method: "POST",
            body: data === undefined ? null : JSON.stringify(data),
        });
    }
    put(endpoint, data, config) {
        return this.request(endpoint, {
            ...config,
            method: "PUT",
            body: data === undefined ? null : JSON.stringify(data),
        });
    }
    patch(endpoint, data, config) {
        return this.request(endpoint, {
            ...config,
            method: "PATCH",
            body: data === undefined ? null : JSON.stringify(data),
        });
    }
    delete(endpoint, config) {
        return this.request(endpoint, { ...config, method: "DELETE" });
    }
    setAuthToken(token) {
        this.defaultHeaders = {
            ...this.defaultHeaders,
            Authorization: `Bearer ${token}`,
        };
    }
    removeAuthToken() {
        const current = this.defaultHeaders;
        const { Authorization: _Authorization, ...rest } = current;
        this.defaultHeaders = rest;
    }
}
const apiClient = new ApiClient();
export default apiClient;
//# sourceMappingURL=index.js.map