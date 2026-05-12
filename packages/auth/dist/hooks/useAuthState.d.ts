import type { User, AuthError } from "../types/index";
import { isValidUser } from "../utils/index";
/**
 * Internal authentication state
 * @internal
 */
export interface LocalAuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: AuthError | null;
}
/**
 * Initial state for authentication
 * @internal
 */
export declare const initialState: LocalAuthState;
export interface UseAuthStateReturn {
    state: LocalAuthState;
    updateState: (updates: Partial<LocalAuthState>) => void;
    clearAuthData: () => void;
    setAuthData: (user: User, token: string, refreshToken?: string) => void;
    getStoredAuth: () => {
        token: string | null;
        user: Partial<User> | null;
        refreshToken: string | null;
    };
}
/**
 * Hook for managing authentication state
 * @internal
 */
export declare function useAuthState(): UseAuthStateReturn;
export { isValidUser };
//# sourceMappingURL=useAuthState.d.ts.map