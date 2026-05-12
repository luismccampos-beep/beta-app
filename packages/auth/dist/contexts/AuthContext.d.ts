import type { User, AuthState, AuthOperations, AuthProviderProps } from "../types/index";
/**
 * Unified AuthProvider that works across all apps (web, admin, frontend)
 * Each app provides its own apiClient adapter for API communication
 * @public
 */
export declare function AuthProvider({ children, apiClient, onLogout, onLoginSuccess, onSessionExpired, }: AuthProviderProps): import("react/jsx-runtime").JSX.Element;
/**
 * Main hook for accessing authentication context
 * @throws {Error} If used outside AuthProvider
 * @public
 */
export declare function useAuth(): AuthState & AuthOperations;
/**
 * Hook for accessing only authentication state (read-only)
 * More efficient than useAuth for components that only need state
 * @public
 */
export declare function useAuthState(): {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isInitialized: boolean;
    error: import("./AuthContext").AuthError | null;
};
/**
 * Hook for checking permissions
 * @public
 */
export declare function usePermissions(): {
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string | string[]) => boolean;
    isAdmin: boolean;
    isUser: boolean;
    isAgent: boolean;
};
export type { User, AuthState, AuthResponse, AuthError, LoginCredentials, RegisterData, UpdateProfileData, ChangePasswordData, ResetPasswordData, ConfirmResetPasswordData, AuthApiClient, AuthProviderProps, } from "../types/index.js";
//# sourceMappingURL=AuthContext.d.ts.map