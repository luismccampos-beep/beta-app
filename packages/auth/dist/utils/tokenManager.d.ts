export declare const TokenManager: {
    getAccessToken: () => string | null;
    setAccessToken: (token: string) => void;
    getRefreshToken: () => string | null;
    setRefreshToken: (token: string) => void;
    getUser: <T>() => T | null;
    setUser: <T>(user: T) => void;
    saveTokens: (tokens: {
        accessToken: string;
        refreshToken: string;
    }, expiresInMs?: number) => void;
    getTokenTimeRemaining: () => number;
    isTokenExpired: () => boolean;
    shouldRefreshToken: () => boolean;
    hasValidToken: () => boolean;
    clearAll: () => void;
    clearTokens: () => void;
};
//# sourceMappingURL=tokenManager.d.ts.map