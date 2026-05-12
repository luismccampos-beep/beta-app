import type { AuthApiClient } from "../types/index";
import type { UseAuthStateReturn } from "./useAuthState";
export interface UseAuthSessionReturn {
    refreshAccessToken: () => Promise<string>;
    validateToken: () => Promise<boolean>;
    checkSession: () => Promise<boolean>;
    updateLastActivity: () => void;
}
/**
 * Hook for session and token management
 * @internal
 */
export declare function useAuthSession(apiClient: AuthApiClient, authState: UseAuthStateReturn, callbacks?: {
    onSessionExpired?: () => void;
}): UseAuthSessionReturn;
//# sourceMappingURL=useAuthSession.d.ts.map