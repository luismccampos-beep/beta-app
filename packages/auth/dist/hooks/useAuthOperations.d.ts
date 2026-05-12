import type { User, AuthResponse, LoginCredentials, RegisterData, AuthApiClient } from "../types/index";
import { type UseAuthStateReturn } from "./useAuthState";
export interface UseAuthOperationsReturn {
    login: (emailOrCreds: LoginCredentials | string, password?: string) => Promise<AuthResponse>;
    register: (userData: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
}
/**
 * Hook for authentication operations (login, register, logout)
 * @internal
 */
export declare function useAuthOperations(apiClient: AuthApiClient, authState: UseAuthStateReturn, callbacks?: {
    onLogout?: () => void;
    onLoginSuccess?: (user: User) => void;
}): UseAuthOperationsReturn;
//# sourceMappingURL=useAuthOperations.d.ts.map