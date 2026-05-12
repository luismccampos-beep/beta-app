const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";

export const TokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  getUser: <T>(): T | null => {
    if (typeof window === "undefined") return null;
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: <T>(user: T): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  saveTokens: (
    tokens: { accessToken: string; refreshToken: string },
    expiresInMs: number = 3600000,
  ): void => {
    if (typeof window === "undefined") return;
    const now = Date.now();
    localStorage.setItem(TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, (now + expiresInMs).toString());
  },

  getTokenTimeRemaining: (): number => {
    if (typeof window === "undefined") return 0;
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return 0;
    const remaining = parseInt(expiry) - Date.now();
    return Math.max(0, remaining);
  },

  isTokenExpired: (): boolean => {
    return TokenManager.getTokenTimeRemaining() <= 0;
  },

  shouldRefreshToken: (): boolean => {
    const remaining = TokenManager.getTokenTimeRemaining();
    return remaining > 0 && remaining < 300000; // 5 minutes
  },

  hasValidToken: (): boolean => {
    const token = TokenManager.getAccessToken();
    return !!token && !TokenManager.isTokenExpired();
  },

  clearAll: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  },

  clearTokens: (): void => {
    TokenManager.clearAll();
  },
};
